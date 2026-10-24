/* script.js – presentation + assistant logic. Content lives in data.js. */
(function () {
  "use strict";
  const P = PORTFOLIO;
  const $ = (s, r = document) => r.querySelector(s);
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- tiny DOM helper ---------- */
  function el(tag, props = {}, ...kids) {
    const n = document.createElement(tag);
    for (const [k, v] of Object.entries(props)) {
      if (k === "class") n.className = v;
      else if (k === "text") n.textContent = v;
      else if (k.startsWith("on")) n.addEventListener(k.slice(2), v);
      else if (v !== false && v != null) n.setAttribute(k, v);
    }
    kids.flat().forEach(c => c != null && n.append(c));
    return n;
  }
  const slugClass = s => "s-" + s.toLowerCase().replace(/\s+/g, "-");

  /* ---------- static content ---------- */
  $("#hero-role").textContent = P.role;
  $("#hero-tagline").textContent = P.tagline;
  $("#hero-intro").textContent = P.intro;
  $("#about-bio").textContent = P.bio;
  if (P.contact.cv) { const cv = $("#hero-cv"); cv.href = P.contact.cv; cv.hidden = false; }

  $("#education").append(...P.education.map(e => el("div", {},
    el("p", { class: "edu-title", text: e.title }),
    el("p", { class: "edu-note" }, e.url ? el("a", { class: "edu-link", href: e.url, target: "_blank", rel: "noopener noreferrer", text: e.place }) : e.place),
    el("p", { class: "edu-note", text: e.note }))));

  $("#approach").append(...P.approach.map(([t, d]) => el("li", {}, el("strong", { text: t }), el("span", { text: d }))));

  /* ---------- skills (usage is derived from project data) ---------- */
  const usedIn = name => P.projects.filter(p => p.tech.some(t => t.toLowerCase() === name.toLowerCase())).map(p => p.title);
  $("#skills-grid").append(...P.skills.map(g => el("div", { class: "skill-group" },
    el("h3", { text: g.group }),
    el("ul", { class: "skill-list" }, g.items.map(i => {
      const u = usedIn(i);
      return el("li", {}, el("span", { class: "skill-name", text: i }),
        el("span", { class: "skill-used" + (u.length ? "" : " none"), text: u.length ? "Used in " + u.join(", ") : "Learned through coursework and study" }));
    })))));

  /* ---------- media with graceful placeholder ---------- */
  function media(src, alt, label) {
    const box = el("div", { class: "media" });
    const ph = () => { box.replaceChildren(el("div", { class: "placeholder", text: label || "Screenshot coming soon" })); };
    if (!src) { ph(); return box; }
    const img = el("img", { src, alt, loading: "lazy", decoding: "async" });
    img.addEventListener("error", ph, { once: true });
    box.append(img);
    return box;
  }

  /* ---------- project showcase ---------- */
  const state = { category: "All", query: "", focus: null };
  const categories = ["All", ...new Set(P.projects.map(p => p.category))];
  const filterBox = $("#filters");
  categories.forEach(c => filterBox.append(el("button", {
    type: "button", class: "chip", "aria-pressed": String(c === "All"), text: c,
    onclick: () => setFilter(c)
  })));

  function setFilter(c) {
    state.category = c;
    filterBox.querySelectorAll(".chip").forEach(b => b.setAttribute("aria-pressed", String(b.textContent === c)));
    renderProjects();
  }
  const matches = p => {
    const q = state.query.trim().toLowerCase();
    const hay = [p.title, p.summary, p.category, ...p.tech].join(" ").toLowerCase();
    return (state.category === "All" || p.category === state.category) && (!q || hay.includes(q));
  };

  function renderProjects() {
    const list = P.projects.filter(matches);
    $("#project-count").textContent = `Showing ${list.length} of ${P.projects.length} projects`;
    const grid = $("#project-grid");
    grid.replaceChildren();
    if (!list.length) { grid.append(el("p", { class: "empty", text: "No projects match. Clear the search or choose All." })); return; }
    list.forEach(p => grid.append(card(p)));
  }

  function card(p) {
    return el("article", { class: "project-card" + (state.focus === p.slug ? " is-focus" : ""), id: "project-" + p.slug },
      media(p.images[0], p.title + " screenshot"),
      el("div", { class: "project-body" },
        p.status ? el("span", { class: "status " + slugClass(p.status), text: p.status }) : null,
        el("h3", { text: p.title }),
        el("p", { text: p.summary }),
        el("div", { class: "tags" }, p.tech.map(t => el("span", { text: t }))),
        el("div", { class: "card-actions" },
          p.demo ? el("a", { class: "btn btn-primary", href: p.demo, target: "_blank", rel: "noopener noreferrer", text: "Visit live site", "aria-label": "Visit the live site of " + p.title + " (opens in a new tab)" }) : null,
          el("button", { type: "button", class: p.demo ? "btn" : "btn btn-primary", text: "Details", "aria-label": "Open details for " + p.title, onclick: e => openProject(p.slug, e.currentTarget) }),
          p.repo ? el("a", { class: "btn", href: p.repo, target: "_blank", rel: "noopener noreferrer", text: "GitHub" }) : null)));
  }
  $("#project-search").addEventListener("input", e => { state.query = e.target.value; renderProjects(); });
  renderProjects();

  /* ---------- project dialog + gallery ---------- */
  const dlg = $("#project-dialog");
  let lastTrigger = null;
  function openProject(slug, trigger) {
    const p = P.projects.find(x => x.slug === slug);
    if (!p) return;
    state.focus = slug;
    lastTrigger = trigger || null;
    let idx = 0;
    const body = $("#pd-body");
    const stage = el("div", { class: "gallery" });
    const counter = el("span", { "aria-live": "polite" });
    const prev = el("button", { type: "button", text: "Previous", onclick: () => show(idx - 1) });
    const next = el("button", { type: "button", text: "Next", onclick: () => show(idx + 1) });
    const nav = el("div", { class: "gallery-nav" }, prev, counter, next);
    function show(i) {
      idx = Math.max(0, Math.min(i, Math.max(p.images.length - 1, 0)));
      stage.replaceChildren(media(p.images[idx], `${p.title} screenshot ${idx + 1}`, "Add a screenshot in data.js"));
      counter.textContent = p.images.length ? `${idx + 1} / ${p.images.length}` : "No screenshots yet";
      prev.disabled = idx === 0; next.disabled = idx >= p.images.length - 1;
    }
    show(0);
    const section = (h, t) => t ? el("div", { class: "pd-section" }, el("h3", { text: h }), el("p", { text: t })) : null;
    body.replaceChildren(
      p.status ? el("span", { class: "status " + slugClass(p.status), text: p.status }) : null,
      el("h2", { id: "pd-title", text: p.title }),
      el("p", { class: "section-note", text: p.category }),
      stage, p.images.length > 1 ? nav : null,
      p.video ? el("video", { controls: "", preload: "none", src: p.video, "aria-label": p.title + " walkthrough" }) : null,
      section("What it is", p.summary),
      section("Problem it solves", p.problem),
      section("My contribution", p.role),
      section("What I learned", p.learned),
      el("div", { class: "pd-section" }, el("h3", { text: "Technologies" }), el("div", { class: "tags" }, p.tech.map(t => el("span", { text: t })))),
      el("div", { class: "pd-links" },
        p.demo ? el("a", { class: "btn btn-primary", href: p.demo, target: "_blank", rel: "noopener noreferrer", text: "Visit live site" }) : null,
        p.repo ? el("a", { class: "btn", href: p.repo, target: "_blank", rel: "noopener noreferrer", text: "View source on GitHub" }) : el("span", { class: "edu-note", text: "Source code is not public." })));
    if (!dlg.open) dlg.showModal();
    renderProjects();
  }
  dlg.addEventListener("keydown", e => {
    if (!dlg.open) return;
    const prevB = dlg.querySelector(".gallery-nav button:first-child"), nextB = dlg.querySelector(".gallery-nav button:last-child");
    if (e.key === "ArrowLeft" && prevB && !prevB.disabled) prevB.click();
    if (e.key === "ArrowRight" && nextB && !nextB.disabled) nextB.click();
  });
  $("#pd-close").addEventListener("click", () => dlg.close());
  dlg.addEventListener("click", e => { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener("close", () => lastTrigger && lastTrigger.isConnected && lastTrigger.focus());

  /* ---------- certificates & contact ---------- */
  $("#credentials").append(...P.credentials.map(c => el("a", { class: "cert", href: c.url, target: "_blank", rel: "noopener noreferrer" },
    media(c.image, c.title + " certificate preview", "Preview"),
    el("div", {}, el("strong", { text: c.title }), el("span", { text: c.detail })))));
  const ct = P.contact;
  $("#contact-links").append(
    el("a", { href: "mailto:" + ct.email, text: ct.email }),
    el("a", { href: ct.linkedin, target: "_blank", rel: "noopener noreferrer", text: "LinkedIn" }),
    el("a", { href: ct.github, target: "_blank", rel: "noopener noreferrer", text: "GitHub" }));

  /* ---------- reveal on scroll + gentle tilt (fine pointers only) ---------- */
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && (e.target.classList.add("visible"), io.unobserve(e.target))), { threshold: 0.08 });
    document.querySelectorAll(".reveal").forEach(s => io.observe(s));
  } else document.querySelectorAll(".reveal").forEach(s => s.classList.add("visible"));
  document.getElementById("home").classList.add("visible");

  if (!reduceMotion && matchMedia("(pointer: fine)").matches) {
    const t = document.querySelector(".interactive-tilt");
    t.addEventListener("mousemove", e => {
      const r = t.getBoundingClientRect();
      t.style.transform = `perspective(900px) rotateX(${((e.clientY - r.top) / r.height - .5) * -8}deg) rotateY(${((e.clientX - r.left) / r.width - .5) * 8}deg)`;
    });
    t.addEventListener("mouseleave", () => (t.style.transform = ""));
  }

  /* =====================================================
     PORTFOLIO ASSISTANT
     Command matching over data.js. Not an AI model.
     ===================================================== */
  const panel = $("#assistant"), log = $("#as-log"), transcriptEl = $("#as-transcript");
  const mic = $("#as-mic"), statusText = $("#as-status-text");
  const dots = document.querySelectorAll(".status-dot");
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  const canSpeak = "speechSynthesis" in window;
  let recognition = null, listening = false, muted = false, lastReply = "", introDone = false;

  function setState(s) {
    dots.forEach(d => d.dataset.state = s);
    statusText.textContent = { idle: "Idle", listening: "Listening", speaking: "Speaking", unavailable: "Voice unavailable (text works)" }[s];
  }
  const baseState = () => (SR ? "idle" : "unavailable");
  setState(baseState());

  function say(text, opts = {}) {
    lastReply = text;
    log.append(el("div", { class: "msg bot", text }));
    log.scrollTop = log.scrollHeight;
    if (opts.silent) return;
    speak(text);
  }
  function speak(text) {
    if (!canSpeak || muted) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-ZA";
    u.onstart = () => setState("speaking");
    u.onend = u.onerror = () => setState(listening ? "listening" : baseState());
    speechSynthesis.speak(u);
  }
  const userSaid = t => { log.append(el("div", { class: "msg user", text: t })); log.scrollTop = log.scrollHeight; };

  function openPanel() {
    panel.hidden = false;
    $("#open-assistant").setAttribute("aria-expanded", "true");
    if (!introDone) {
      introDone = true;
      say(`Welcome to ${P.name}'s developer portfolio. I'm your portfolio assistant. You can explore ${P.pronoun.possessive} projects, discover ${P.pronoun.possessive} technical skills, learn about ${P.pronoun.possessive} background, or find out how to make contact. What would you like to know?`);
    }
    $("#as-input").focus();
  }
  function closePanel() { stopAll(); panel.hidden = true; $("#open-assistant").focus(); }
  function stopAll() {
    if (canSpeak) speechSynthesis.cancel();
    stopListening();
    setState(baseState());
  }

  /* --- speech recognition --- */
  if (!SR) {
    mic.disabled = true;
    mic.textContent = "Voice input not supported";
    $("#as-note").textContent += " Voice input isn't supported in this browser. Type below or tap a suggestion instead.";
  } else {
    recognition = new SR();
    recognition.lang = "en-ZA";
    recognition.interimResults = true;
    recognition.continuous = false;
    recognition.onresult = e => {
      let text = "", final = false;
      for (const r of e.results) { text += r[0].transcript; final = final || r.isFinal; }
      transcriptEl.textContent = text;
      if (final) { transcriptEl.textContent = ""; handle(text); }
    };
    recognition.onerror = e => {
      stopListening();
      if (e.error === "not-allowed" || e.error === "service-not-allowed") {
        mic.disabled = true; mic.textContent = "Microphone blocked";
        say("Microphone access was denied. You can still type a question or tap a suggestion below.", { silent: true });
      } else if (e.error === "no-speech") say("I didn't hear anything. Try again or type your question.", { silent: true });
      else if (e.error !== "aborted") say("Voice recognition had a problem. Typing still works.", { silent: true });
    };
    recognition.onend = () => { if (listening) stopListening(); };
  }
  function startListening() {
    if (!recognition || listening) return;
    if (canSpeak) speechSynthesis.cancel();
    try { recognition.start(); listening = true; mic.setAttribute("aria-pressed", "true"); mic.textContent = "Stop listening"; setState("listening"); }
    catch { /* already started */ }
  }
  function stopListening() {
    if (recognition && listening) { try { recognition.stop(); } catch { /* ignore */ } }
    listening = false; transcriptEl.textContent = "";
    mic.setAttribute("aria-pressed", "false");
    if (!mic.disabled) mic.textContent = "Start listening";
    if (!(canSpeak && speechSynthesis.speaking)) setState(baseState());
  }

  /* --- intents --- */
  const list = a => a.length < 2 ? a.join("") : a.slice(0, -1).join(", ") + " and " + a[a.length - 1];
  const allTech = [...new Set(P.projects.flatMap(p => p.tech).concat(P.skills.flatMap(g => g.items)))];
  const goTo = id => { document.getElementById(id).scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" }); };

  function highlight(slug) {
    state.focus = slug; renderProjects();
    const c = document.getElementById("project-" + slug);
    if (c) c.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
  }
  function showProjects(filterFn, intro) {
    setFilter("All"); $("#project-search").value = ""; state.query = "";
    const found = P.projects.filter(filterFn);
    goTo("projects");
    if (found.length === 1) highlight(found[0].slug);
    return found;
  }

  function handle(raw) {
    const text = raw.trim();
    if (!text) return;
    userSaid(text);
    const t = text.toLowerCase().replace(/[.,!?]/g, "");

    if (/\b(stop|quiet|be quiet|cancel)\b/.test(t) && /(listen|talk|speak|stop$|^stop)/.test(t)) { say("Stopped.", { silent: true }); stopAll(); return; }

    if (/\b(contact|email|reach|hire|linkedin|get in touch)\b/.test(t)) {
      goTo("contact");
      return say(`You can email ${P.name} at ${ct.email}, or find ${P.pronoun.possessive} LinkedIn and GitHub links on the contact section, which I've just opened.`);
    }
    if (/\b(demo|live)\b/.test(t)) {
      const target = P.projects.find(p => p.slug === state.focus && p.demo) || P.projects.find(p => p.demo);
      if (target) { say(`Opening the live site of ${target.title}.`); window.open(target.demo, "_blank", "noopener"); }
      else say("None of the listed projects has a live demo yet.");
      return;
    }
    if (/(how (does|do) (this|it|that)|show me how|how it works|walk me through)/.test(t)) {
      const p = P.projects.find(x => x.slug === state.focus);
      if (!p) return say("Ask about a project first, for example CleanSA or CodeForge, and I'll open its breakdown.");
      openProject(p.slug); return say(`Here is the breakdown of ${p.title}: ${p.summary} It uses ${list(p.tech)}.`);
    }
    // a named project
    const named = P.projects.find(p => t.includes(p.title.toLowerCase()) || t.includes(p.slug.replace(/-/g, " ")) || t.includes(p.slug) || (p.aliases || []).some(a => t.includes(a)));
    if (named) { showProjects(p => p.slug === named.slug); highlight(named.slug); return say(`${named.title}: ${named.summary} Technologies: ${list(named.tech)}. Say "show me how this works" to open the details.`); }

    // a technology
    const tech = allTech.filter(x => new RegExp("(^|\\W)" + x.toLowerCase().replace(/[+#.]/g, m => "\\" + m) + "(\\W|$)").test(t));
    const isDb = /\b(database|databases|data)\b/.test(t);
    if (tech.length || isDb) {
      const names = isDb && !tech.length ? ["SQL", "MySQL", "Oracle SQL"] : tech;
      const found = showProjects(p => p.tech.some(x => names.map(n => n.toLowerCase()).includes(x.toLowerCase())));
      goTo(found.length ? "projects" : "skills");
      const inSkills = P.skills.some(g => g.items.some(i => names.map(n => n.toLowerCase()).includes(i.toLowerCase())));
      if (found.length) return say(`${list(names)} appears in ${list(found.map(p => p.title))}.`);
      return say(inSkills
        ? `${list(names)} is on ${P.pronoun.possessive} skills list from coursework and study, but I don't have a listed project that uses it yet.`
        : `I don't have ${list(names)} listed for ${P.name}.`);
    }
    if (/\b(skill|skills|technolog\w*|stack|tools|languages)\b/.test(t)) {
      goTo("skills"); return say(`${P.name} works with ${list(P.skills[0].items)}, plus ${list(P.skills[1].items)} and ${list(P.skills[2].items)}. Each skill lists the projects that use it.`);
    }
    if (/\b(project|projects|work|best|built|portfolio)\b/.test(t)) {
      showProjects(() => true); goTo("projects");
      return say(`There are ${P.projects.length} projects: ${list(P.projects.map(p => p.title))}. Pick one to see its screenshots, technologies and source code.`);
    }
    if (/\b(education|study|studying|university|degree|graduat\w*)\b/.test(t)) {
      goTo("about"); const e = P.education[0]; return say(`${P.name} is studying ${e.title} at ${e.place}. ${e.note}.`);
    }
    if (/\b(introduce|who|about|background|tell me)\b/.test(t)) {
      goTo("about"); return say(`${P.name} is a ${P.role.toLowerCase()}. ${P.tagline}. ${P.bio}`);
    }
    say("I can introduce Lerato, show projects, filter by technology, open a project's details, or share contact information. Try one of the suggestions below.");
  }

  /* --- wire up controls --- */
  ["Introduce Lerato", "Show me his best projects", "What technologies does he use?", "Show me his Python projects", "Tell me about his database projects", "Take me to his skills", "How can I contact him?"]
    .forEach(c => $("#as-chips").append(el("button", { type: "button", text: c, onclick: () => handle(c) })));
  $("#open-assistant").addEventListener("click", () => (panel.hidden ? openPanel() : closePanel()));
  $("#hero-assistant").addEventListener("click", openPanel);
  $("#as-close").addEventListener("click", closePanel);
  mic.addEventListener("click", () => (listening ? stopListening() : startListening()));
  $("#as-stop").addEventListener("click", stopAll);
  $("#as-replay").addEventListener("click", () => lastReply && (muted ? say(lastReply, { silent: true }) : speak(lastReply)));
  $("#as-mute").addEventListener("click", e => {
    muted = !muted; e.currentTarget.setAttribute("aria-pressed", String(muted));
    e.currentTarget.textContent = muted ? "Unmute" : "Mute";
    if (muted && canSpeak) speechSynthesis.cancel();
  });
  if (!canSpeak) { $("#as-mute").disabled = $("#as-replay").disabled = true; }
  $("#as-form").addEventListener("submit", e => { e.preventDefault(); const i = $("#as-input"); handle(i.value); i.value = ""; });
  panel.addEventListener("keydown", e => { if (e.key === "Escape") closePanel(); });
  window.addEventListener("pagehide", () => canSpeak && speechSynthesis.cancel());
})();

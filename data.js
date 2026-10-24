/* ============================================================
   data.js – the ONE place to edit your content.
   Project detail (problem / role / learned) is drawn from each
   project's own README, so it matches what the repo says.
   Empty fields ("") are simply hidden on the page.
   Add screenshots to IMAGES/projects/<slug>/ and list them in
   `images`. Missing images show a placeholder automatically.
   ============================================================ */
const PORTFOLIO = {
  name: "Lerato Makhoba",
  role: "Software developer",
  tagline: "Final-year BSc Information Technology student at North-West University",
  pronoun: { subject: "he", possessive: "his" }, // used by the voice assistant
  intro:
    "I build practical applications and enjoy understanding how software works from the front end through to the back end. I'm looking for internship and graduate opportunities where I can keep growing as a developer.",
  bio:
    "I'm completing my BSc in Information Technology at North-West University. My studies and personal projects cover C#, Java, Python, SQL, networking and web development. My goal is to become a developer who builds reliable, user-friendly applications.",
  education: [
    { title: "BSc Information Technology", place: "North-West University", note: "Final year", url: "https://www.nwu.ac.za" }
  ],
  approach: [
    ["Understand", "Clarify the problem and who it is for before writing code."],
    ["Break it down", "Split the work into small pieces that can be built and tested one at a time."],
    ["Build and test", "Get a working version first, then check it against real use."],
    ["Refine", "Improve readability, structure and usability. I also use AI tools to speed up learning, then verify and understand what I ship."]
  ],
  contact: {
    email: "Lerato_Makhoba@outlook.com",
    linkedin: "https://www.linkedin.com/in/lerato-makhoba-b54b54375/",
    github: "https://github.com/Lerato13Dev",
    cv: "" // e.g. "Certificates/Lerato_Makhoba_CV.pdf" – a button appears only when set
  },
  // Skill groups come from your GitHub README. "Used in" is calculated
  // automatically from each project's `tech` list below.
  skills: [
    { group: "Languages", items: ["C#", "Java", "Python", "C++", "SQL", "JavaScript"] },
    { group: "Web", items: ["HTML", "CSS"] },
    { group: "Databases", items: ["MySQL", "Oracle SQL"] },
    { group: "Tools", items: ["Git", "GitHub", "Visual Studio", "VS Code"] }
  ],
  credentials: [
    {
      title: "Cisco: Introduction to Cybersecurity",
      detail: "Cisco Networking Academy, 2025",
      url: "Certificates/Introduction_to_Cybersecurity.pdf",
      image: "IMAGES/certificate-preview.png"
    }
  ],
  // category: "Web Development" | "Software Development" | "Data & Databases" | "Networking"
  // status: "Completed" | "Prototype" | "In progress" | "Learning project" | "" (hidden)
  projects: [
    {
      slug: "cleansa",
      title: "CleanSA",
      aliases: ["clean sa", "clean essay"], // extra names the voice assistant recognises
      category: "Web Development",
      status: "Prototype",
      summary: "An environmental reporting and mapping prototype for South Africa. People can report an environmental problem, attach a photo, and see it plotted on an interactive map built with Leaflet and OpenStreetMap.",
      problem: "People had no simple way to report an environmental problem such as illegal dumping, see it on a map, or track what happened to it afterwards.",
      tech: ["JavaScript", "HTML", "CSS", "Leaflet", "OpenStreetMap"],
      role: "I designed the report flow, the incident lifecycle (reported, under review, verified, cleanup planned, cleanup in progress, resolved) and the map and filtering features, and used AI as a pair-programming assistant while keeping the architecture and feature decisions my own.",
      learned: "How to work with a mapping library and real geographic data, how to design a status lifecycle for user-submitted reports, and how to search and filter a growing dataset by province, severity and status.",
      repo: "https://github.com/Lerato13Dev/CleanSA", demo: "https://lerato13dev.github.io/CleanSA/",
      images: ["IMAGES/projects/cleansa/screenshot-1.webp"], video: ""
    },
    {
      slug: "codeforge",
      title: "CodeForge",
      aliases: ["code forge"],
      category: "Web Development",
      status: "Learning project",
      summary: "A GitHub explorer built with no framework and no backend: search any developer, browse their repositories, filter and sort them, save favourites, and read a repository's README, all through the public GitHub REST API.",
      problem: "I wanted a project that pushed past beginner exercises and forced me to work with a real, rate-limited public API with no backend to hide behind.",
      tech: ["HTML", "CSS", "JavaScript", "GitHub REST API"],
      role: "I built the whole thing solo: the API calls, the search and filtering, local-storage favourites, the dark and light themes, and handling loading states, errors, empty results and GitHub's rate limits.",
      learned: "How to call a real REST API directly from the browser with no secret keys, how to handle rate limits and failed requests gracefully, and how to render untrusted README content safely using Marked.js and DOMPurify.",
      repo: "https://github.com/Lerato13Dev/CodeForge", demo: "https://lerato13dev.github.io/CodeForge/",
      images: ["IMAGES/projects/codeforge/screenshot-1.webp"], video: ""
    },
    {
      slug: "bohlale-village-portal",
      title: "Bohlale Village Residence Portal",
      aliases: ["bohlale", "residence portal"],
      category: "Web Development",
      status: "Prototype",
      summary: "A residence portal concept bringing issue reporting, bus schedules, leadership contacts, announcements and petitions into one place, instead of scattered across WhatsApp groups and notices.",
      problem: "Residence information and requests were scattered across WhatsApp, printed notices and word of mouth, making it hard to find or track anything.",
      tech: ["HTML", "CSS", "JavaScript", "localStorage"],
      role: "I identified the everyday residence problems, mapped which features to digitise, designed the user flows with mobile use in mind, and considered privacy around student numbers and direct contact details. I used AI to help implement the result while keeping the product decisions and testing my own.",
      learned: "How to turn a messy, real-world problem into a scoped set of features, and how to prioritise mobile usability and basic privacy when a prototype might later need real accounts and a backend.",
      repo: "https://github.com/Lerato13Dev/bohlale-village-portal", demo: "https://lerato13dev.github.io/bohlale-village-portal/",
      images: ["IMAGES/projects/bohlale-village-portal/screenshot-1.webp"], video: ""
    },
    {
      slug: "movie-stream",
      title: "MovieStream",
      aliases: ["openstream", "open stream", "movie stream"],
      category: "Web Development",
      status: "Learning project",
      summary: "A movie streaming frontend inspired by cinematic streaming platforms, with a hero section, search, category browsing and responsive hover animations, built with plain HTML, CSS and JavaScript.",
      problem: "I wanted to find out whether I could realistically build a polished, streaming-platform-style interface using only HTML, CSS and JavaScript.",
      tech: ["HTML", "CSS", "JavaScript"],
      role: "I built the interface end to end: the hero section, search, category layout and the hover and transition details, using AI as a learning and debugging assistant while reviewing and testing every change myself.",
      learned: "Structuring a real frontend project, responsive layout and positioning, and how far UI polish can go without a framework.",
      repo: "https://github.com/Lerato13Dev/movie-stream", demo: "https://lerato13dev.github.io/movie-stream/",
      images: ["IMAGES/projects/movie-stream/screenshot-1.webp"], video: ""
    },
    {
      slug: "glasshouse-shop",
      title: "Glasshouse Shop",
      aliases: ["glasshouse", "glass house"],
      category: "Web Development",
      status: "",
      summary: "A handcrafted optical store website showcasing premium eyewear with a clean, responsive design.",
      problem: "",
      tech: ["HTML", "CSS"],
      role: "AI assisted the design and development process.",
      learned: "",
      repo: "https://github.com/Lerato13Dev/glasshouse-shop", demo: "https://lerato13dev.github.io/glasshouse-shop/",
      images: ["IMAGES/projects/glasshouse-shop/screenshot-1.webp"], video: ""
    },
    {
      slug: "portfolio",
      title: "This portfolio",
      category: "Web Development",
      status: "",
      summary: "A responsive portfolio with a project showcase and a command-based voice assistant, written in plain HTML, CSS and JavaScript.",
      problem: "Give recruiters a fast way to see who I am, what I have built and how to reach me.",
      tech: ["HTML", "CSS", "JavaScript"],
      role: "", learned: "",
      repo: "https://github.com/Lerato13Dev/Portfolio", demo: "https://lerato13dev.github.io/Portfolio/",
      images: ["IMAGES/portfolio-preview.png"], video: ""
    },
    {
      slug: "university-projects",
      title: "University software projects",
      category: "Software Development",
      status: "Completed",
      summary: "Academic projects from my BSc covering object-oriented programming, database development, networking and problem-solving.",
      problem: "",
      tech: ["C#", "Java", "SQL"],
      role: "", learned: "",
      repo: "", demo: "",
      images: [], video: ""
    }
  ]
};
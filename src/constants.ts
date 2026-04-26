// ============================================================
// CODEKNOW — CONSTANTS: Mentors, Modules, Quests
// ============================================================

export interface Mentor {
  id: string;
  name: string;
  sector: string;
  avatar: string;
  sprites: string[];  // [idle, blink, talking]
  color: string;
  icon: string;
  specialty: Record<string, string>;
  personality: Record<string, string>;
  description: Record<string, string>;
}

export interface Module {
  id: string;
  name: string;
  tagline: Record<string, string>;
  description: Record<string, string>;
  color: string;
  gradient: string;
  icon: string;
  mentorIds: string[];
  techs: string[];
}

export interface Quest {
  id: string;
  mentorId: string;
  title: Record<string, string>;
  description: Record<string, string>;
  difficulty: 'Novice' | 'Adept' | 'Expert' | 'Master';
  xpReward: number;
  prompt: Record<string, string>;
  lang: string;
  order: number;
}

// ============================================================
// MENTORS
// ============================================================
export const MENTORS: Mentor[] = [
  {
    id: "rin",
    name: "Rin",
    sector: "FRONTEND_CORE",
    avatar: "/assets/mentors/mentor_webdev.png",
    sprites: ["/assets/mentors/mentor_webdev.png", "/assets/mentors/mentor_webdev_1.png", "/assets/mentors/mentor_webdev_2.png"],
    color: "#00f2ff",
    icon: "monitor",
    specialty: { en: "React & Tailwind CSS", fr: "React & Tailwind CSS" },
    personality: {
      en: "Perfectionist pixel artist. She will reject anything that's not frame-perfect.",
      fr: "Artiste pixel perfectionniste. Elle rejette tout ce qui n'est pas au pixel près."
    },
    description: {
      en: "Guardian of the Interface Realm. Her CSS spells are legendary.",
      fr: "Gardienne du Royaume Interface. Ses sorts CSS sont légendaires."
    }
  },
  {
    id: "tess",
    name: "Tess",
    sector: "PYTHON_DATA",
    avatar: "/assets/mentors/mentor_python.png",
    sprites: ["/assets/mentors/mentor_python.png", "/assets/mentors/mentor_python_1.png", "/assets/mentors/mentor_python_2.png"],
    color: "#fde047",
    icon: "layers",
    specialty: { en: "Python, Flask & Pandas", fr: "Python, Flask & Pandas" },
    personality: {
      en: "Cold logic. She processes data like a machine and expects you to do the same.",
      fr: "Logique froide. Elle traite les données comme une machine et attend que tu fasses pareil."
    },
    description: {
      en: "The Data Sentinel. She manages the core logic pipeline of the Academy.",
      fr: "La Sentinelle des Données. Elle gère le pipeline logique central de l'Académie."
    }
  },
  {
    id: "sora",
    name: "Sora",
    sector: "PHP_BACKEND",
    avatar: "/assets/mentors/mentor_php.png",
    sprites: ["/assets/mentors/mentor_php.png", "/assets/mentors/mentor_php_1.png", "/assets/mentors/mentor_php_2.png"],
    color: "#8b5cf6",
    icon: "server",
    specialty: { en: "PHP & Symfony", fr: "PHP & Symfony" },
    personality: {
      en: "Traditional but powerful. She knows every legacy trick in the book.",
      fr: "Traditionnelle mais puissante. Elle connaît chaque astuce du code ancien."
    },
    description: {
      en: "Keeper of the Ancient Backend Scrolls. Master of Symfony architecture.",
      fr: "Gardienne des Anciens Parchemins Backend. Maîtresse de l'architecture Symfony."
    }
  },
  {
    id: "kael",
    name: "Kael",
    sector: "SYSTEM_SERIES",
    avatar: "/assets/mentors/mentor_csharp.png",
    sprites: ["/assets/mentors/mentor_csharp.png", "/assets/mentors/mentor_csharp_1.png", "/assets/mentors/mentor_csharp_2.png"],
    color: "#ff3399",
    icon: "cpu",
    specialty: { en: "C, C++ & C#", fr: "C, C++ & C#" },
    personality: {
      en: "Brutally efficient. He speaks in assembly when he's excited. No exceptions.",
      fr: "Brutalement efficace. Il parle en assembleur quand il est excité. Aucune exception."
    },
    description: {
      en: "Rogue system architect from the underground. He deals with raw machine logic.",
      fr: "Architecte système renégat de l'underground. Il gère la logique machine brute."
    }
  },
  {
    id: "lina",
    name: "Lina",
    sector: "SQL_ARCHIVE",
    avatar: "/assets/mentors/mentor_sql.png",
    sprites: ["/assets/mentors/mentor_sql.png", "/assets/mentors/mentor_sql_1.png", "/assets/mentors/mentor_sql_2.png"],
    color: "#3b82f6",
    icon: "database",
    specialty: { en: "SQL & DB Architecture", fr: "SQL & Architecture BDD" },
    personality: {
      en: "The Archivist. Every record has a place. Disorder is her enemy.",
      fr: "L'Archiviste. Chaque enregistrement a sa place. Le désordre est son ennemi."
    },
    description: {
      en: "Keeper of the infinite indexed vault. Nothing escapes her queries.",
      fr: "Gardienne du coffre infiniment indexé. Rien n'échappe à ses requêtes."
    }
  },
  {
    id: "eva",
    name: "Eva",
    sector: "CYBER_SECURITY",
    avatar: "/assets/mentors/mentor_typescript.png",
    sprites: ["/assets/mentors/mentor_typescript.png", "/assets/mentors/mentor_typescript_1.png", "/assets/mentors/mentor_typescript_2.png"],
    color: "#00ff9f",
    icon: "shield",
    specialty: { en: "TypeScript & Security", fr: "TypeScript & Sécurité" },
    personality: {
      en: "Playful but dangerous. She will find the type error in your soul.",
      fr: "Joueuse mais dangereuse. Elle trouvera l'erreur de type dans votre âme."
    },
    description: {
      en: "Ghost of the encrypted network. Her eyes pierce through any firewall.",
      fr: "Fantôme du réseau chiffré. Ses yeux percent n'importe quel pare-feu."
    }
  },
  {
    id: "nova",
    name: "Nova",
    sector: "AI_3D_FUTURE",
    avatar: "/assets/mentors/mentor_nova.png",
    sprites: ["/assets/mentors/mentor_nova.png", "/assets/mentors/mentor_nova_1.png", "/assets/mentors/mentor_nova_2.png"],
    color: "#ffffff",
    icon: "zap",
    specialty: { en: "AI Prompting & Three.js", fr: "Prompt IA & Three.js" },
    personality: {
      en: "She speaks from the future. Her logic defies human comprehension.",
      fr: "Elle parle depuis le futur. Sa logique défie la compréhension humaine."
    },
    description: {
      en: "Dimensional traveler. She merges intelligence and 3D space into new worlds.",
      fr: "Voyageuse dimensionnelle. Elle fusionne intelligence et espace 3D en nouveaux mondes."
    }
  }
];

// ============================================================
// MODULES
// ============================================================
export const MODULES: Module[] = [
  {
    id: "frontend",
    name: "FRONTEND",
    tagline: { en: "Build what users see", fr: "Construis ce que les utilisateurs voient" },
    description: { en: "React, Next.js, Tailwind CSS, Bootstrap", fr: "React, Next.js, Tailwind CSS, Bootstrap" },
    color: "#00f2ff",
    gradient: "from-cyan-500/20 to-blue-500/5",
    icon: "monitor",
    mentorIds: ["rin"],
    techs: ["React", "Next.js", "Tailwind", "Bootstrap", "HTML", "CSS"]
  },
  {
    id: "backend",
    name: "BACKEND",
    tagline: { en: "Power the machine", fr: "Alimente la machine" },
    description: { en: "Python/Pandas/Flask, PHP/Symfony, C/C++/C#", fr: "Python/Pandas/Flask, PHP/Symfony, C/C++/C#" },
    color: "#ff3399",
    gradient: "from-pink-500/20 to-purple-500/5",
    icon: "server",
    mentorIds: ["tess", "sora", "kael"],
    techs: ["Python", "Flask", "Pandas", "PHP", "Symfony", "C", "C++", "C#"]
  },
  {
    id: "database",
    name: "DATABASE",
    tagline: { en: "Master the data", fr: "Maîtrise les données" },
    description: { en: "SQL, MySQL, PostgreSQL, Database Architecture", fr: "SQL, MySQL, PostgreSQL, Architecture BDD" },
    color: "#3b82f6",
    gradient: "from-blue-500/20 to-indigo-500/5",
    icon: "database",
    mentorIds: ["lina"],
    techs: ["SQL", "MySQL", "PostgreSQL", "Joins", "Indexes"]
  },
  {
    id: "ai_cyber",
    name: "AI & CYBER",
    tagline: { en: "The future of code", fr: "Le futur du code" },
    description: { en: "TypeScript, Security, AI Prompting, Three.js", fr: "TypeScript, Sécurité, Prompt IA, Three.js" },
    color: "#00ff9f",
    gradient: "from-emerald-500/20 to-cyan-500/5",
    icon: "shield",
    mentorIds: ["eva", "nova"],
    techs: ["TypeScript", "Security", "AI", "Three.js", "Prompt Engineering"]
  }
];

// ============================================================
// QUESTS — Full catalogue
// ============================================================
export const INITIAL_QUESTS: Quest[] = [
  // ── FRONTEND (Rin) ──────────────────────────────────────
  {
    id: "fe_html_1", mentorId: "rin", lang: "HTML", difficulty: "Novice", xpReward: 80, order: 1,
    title: { en: "Semantic Structure", fr: "Structure Sémantique" },
    description: { en: "Build a proper HTML5 page skeleton.", fr: "Construis un squelette de page HTML5 correct." },
    prompt: { en: "Create an HTML5 page with header, nav, main, and footer tags. Add a title and a paragraph.", fr: "Crée une page HTML5 avec les balises header, nav, main et footer. Ajoute un titre et un paragraphe." }
  },
  {
    id: "fe_css_1", mentorId: "rin", lang: "CSS", difficulty: "Novice", xpReward: 90, order: 2,
    title: { en: "Flexbox Combat", fr: "Combat Flexbox" },
    description: { en: "Master centering elements with Flexbox.", fr: "Maîtrise le centrage des éléments avec Flexbox." },
    prompt: { en: "Center a <div> horizontally and vertically inside its parent using CSS Flexbox.", fr: "Centre un <div> horizontalement et verticalement dans son parent en utilisant CSS Flexbox." }
  },
  {
    id: "fe_tailwind_1", mentorId: "rin", lang: "Tailwind", difficulty: "Adept", xpReward: 120, order: 3,
    title: { en: "Utility Warrior", fr: "Guerrier Utility" },
    description: { en: "Style a card component using only Tailwind utilities.", fr: "Stylise un composant carte en utilisant uniquement les utilitaires Tailwind." },
    prompt: { en: "Create a dark card with rounded corners, a pink border, padding, a title and a description using Tailwind classes only.", fr: "Crée une carte sombre avec des coins arrondis, une bordure rose, du padding, un titre et une description en utilisant uniquement les classes Tailwind." }
  },
  {
    id: "fe_react_1", mentorId: "rin", lang: "React", difficulty: "Adept", xpReward: 150, order: 4,
    title: { en: "The Component Era", fr: "L'Ère des Composants" },
    description: { en: "Create your first reusable React component.", fr: "Crée ton premier composant React réutilisable." },
    prompt: { en: "Write a React functional component 'Button' that accepts 'label' (string) and 'onClick' props. Style it with a pink background.", fr: "Écris un composant fonctionnel React 'Button' qui accepte les props 'label' (string) et 'onClick'. Stylise-le avec un fond rose." }
  },
  {
    id: "fe_react_2", mentorId: "rin", lang: "React", difficulty: "Adept", xpReward: 180, order: 5,
    title: { en: "State Machine", fr: "Machine à État" },
    description: { en: "Control UI state with React hooks.", fr: "Contrôle l'état de l'UI avec les hooks React." },
    prompt: { en: "Create a counter component using useState. Add increment, decrement and reset buttons.", fr: "Crée un composant compteur avec useState. Ajoute des boutons incrémenter, décrémenter et réinitialiser." }
  },
  {
    id: "fe_react_3", mentorId: "rin", lang: "React", difficulty: "Expert", xpReward: 250, order: 6,
    title: { en: "Effect Protocol", fr: "Protocole Effect" },
    description: { en: "Fetch data with useEffect and display it.", fr: "Récupère des données avec useEffect et affiche-les." },
    prompt: { en: "Use useEffect to fetch data from 'https://jsonplaceholder.typicode.com/posts?_limit=3' on mount and display the post titles.", fr: "Utilise useEffect pour récupérer des données depuis 'https://jsonplaceholder.typicode.com/posts?_limit=3' au montage et afficher les titres des posts." }
  },
  // ── BACKEND - Tess (Python) ──────────────────────────────
  {
    id: "py_1", mentorId: "tess", lang: "Python", difficulty: "Novice", xpReward: 80, order: 1,
    title: { en: "Variable Synthesis", fr: "Synthèse de Variables" },
    description: { en: "Declare and manipulate Python variables.", fr: "Déclare et manipule des variables Python." },
    prompt: { en: "Declare a list of 5 integers, compute their sum and average, and print both results.", fr: "Déclare une liste de 5 entiers, calcule leur somme et leur moyenne, et affiche les deux résultats." }
  },
  {
    id: "py_2", mentorId: "tess", lang: "Flask", difficulty: "Adept", xpReward: 130, order: 2,
    title: { en: "Flask Foundation", fr: "Fondation Flask" },
    description: { en: "Deploy your first micro-service with Flask.", fr: "Déploie ton premier micro-service avec Flask." },
    prompt: { en: "Create a Flask app with a route GET /status that returns JSON: {'status': 'online', 'academy': 'CodeKnow'}.", fr: "Crée une app Flask avec une route GET /status qui retourne du JSON : {'status': 'online', 'academy': 'CodeKnow'}." }
  },
  {
    id: "py_3", mentorId: "tess", lang: "Pandas", difficulty: "Adept", xpReward: 160, order: 3,
    title: { en: "Data Slicing Protocol", fr: "Protocole de Découpage" },
    description: { en: "Filter and analyze data with Pandas.", fr: "Filtre et analyse des données avec Pandas." },
    prompt: { en: "Create a DataFrame with columns ['name', 'age', 'score']. Filter rows where score > 75 and sort by age descending.", fr: "Crée un DataFrame avec les colonnes ['name', 'age', 'score']. Filtre les lignes où score > 75 et trie par age décroissant." }
  },
  {
    id: "py_4", mentorId: "tess", lang: "Python", difficulty: "Expert", xpReward: 220, order: 4,
    title: { en: "OOP Protocol", fr: "Protocole POO" },
    description: { en: "Design a Python class hierarchy.", fr: "Conçois une hiérarchie de classes Python." },
    prompt: { en: "Create an abstract class 'Animal' with an abstract method 'speak()', then implement 'Dog' and 'Cat' subclasses.", fr: "Crée une classe abstraite 'Animal' avec une méthode abstraite 'speak()', puis implémente les sous-classes 'Dog' et 'Cat'." }
  },
  // ── BACKEND - Sora (PHP) ─────────────────────────────────
  {
    id: "php_1", mentorId: "sora", lang: "PHP", difficulty: "Novice", xpReward: 80, order: 1,
    title: { en: "PHP Genesis", fr: "Genèse PHP" },
    description: { en: "Write your first PHP logic.", fr: "Écris ta première logique PHP." },
    prompt: { en: "Write a PHP function that takes an array of numbers and returns only the even ones.", fr: "Écris une fonction PHP qui prend un tableau de nombres et retourne uniquement les nombres pairs." }
  },
  {
    id: "php_2", mentorId: "sora", lang: "PHP", difficulty: "Adept", xpReward: 140, order: 2,
    title: { en: "OOP Architecture", fr: "Architecture POO" },
    description: { en: "Apply OOP principles in PHP.", fr: "Applique les principes POO en PHP." },
    prompt: { en: "Create a PHP class 'User' with private properties 'name' and 'email', a constructor, and getters/setters.", fr: "Crée une classe PHP 'User' avec les propriétés privées 'name' et 'email', un constructeur et des getters/setters." }
  },
  {
    id: "php_3", mentorId: "sora", lang: "Symfony", difficulty: "Expert", xpReward: 250, order: 3,
    title: { en: "Symfony Controller", fr: "Contrôleur Symfony" },
    description: { en: "Create a Symfony API endpoint.", fr: "Crée un endpoint API Symfony." },
    prompt: { en: "Create a Symfony controller with a route POST /api/guardians that accepts JSON {name, level} and returns a JSON response.", fr: "Crée un contrôleur Symfony avec une route POST /api/guardians qui accepte le JSON {name, level} et retourne une réponse JSON." }
  },
  // ── BACKEND - Kael (C/C#) ────────────────────────────────
  {
    id: "cs_1", mentorId: "kael", lang: "C#", difficulty: "Novice", xpReward: 100, order: 1,
    title: { en: "Type Declaration", fr: "Déclaration de Types" },
    description: { en: "Declare strongly-typed variables in C#.", fr: "Déclare des variables fortement typées en C#." },
    prompt: { en: "Write a C# class 'Guardian' with properties Name (string), Level (int), and XP (double). Add a constructor and a ToString() override.", fr: "Écris une classe C# 'Guardian' avec les propriétés Name (string), Level (int) et XP (double). Ajoute un constructeur et une surcharge de ToString()." }
  },
  {
    id: "cs_2", mentorId: "kael", lang: "C#", difficulty: "Adept", xpReward: 170, order: 2,
    title: { en: "Interface Protocol", fr: "Protocole Interface" },
    description: { en: "Implement interfaces in C#.", fr: "Implémente des interfaces en C#." },
    prompt: { en: "Define an interface ICombatant with Attack() and Defend() methods, then implement it in a 'Warrior' class.", fr: "Définis une interface ICombatant avec les méthodes Attack() et Defend(), puis implémente-la dans une classe 'Warrior'." }
  },
  {
    id: "cs_3", mentorId: "kael", lang: "C#", difficulty: "Expert", xpReward: 240, order: 3,
    title: { en: "LINQ Mastery", fr: "Maîtrise LINQ" },
    description: { en: "Query collections with LINQ.", fr: "Interroge des collections avec LINQ." },
    prompt: { en: "Given a List<Guardian>, use LINQ to get all guardians with Level > 5, ordered by XP descending, and select only their Names.", fr: "À partir d'une List<Guardian>, utilise LINQ pour obtenir tous les gardiens avec Level > 5, ordonnés par XP décroissant, et sélectionne uniquement leurs Noms." }
  },
  // ── DATABASE - Lina (SQL) ────────────────────────────────
  {
    id: "sql_1", mentorId: "lina", lang: "SQL", difficulty: "Novice", xpReward: 80, order: 1,
    title: { en: "Basic Query", fr: "Requête de Base" },
    description: { en: "Retrieve records from a table.", fr: "Récupère des enregistrements d'une table." },
    prompt: { en: "Write a SELECT query to get name and xp from the 'guardians' table where level > 5, ordered by xp DESC.", fr: "Écris une requête SELECT pour obtenir name et xp de la table 'guardians' où level > 5, ordonnée par xp DESC." }
  },
  {
    id: "sql_2", mentorId: "lina", lang: "SQL", difficulty: "Adept", xpReward: 140, order: 2,
    title: { en: "Join Protocol", fr: "Protocole JOIN" },
    description: { en: "Combine data from multiple tables.", fr: "Combine des données de plusieurs tables." },
    prompt: { en: "Write a query joining 'guardians' and 'quests' tables (guardians.id = quests.guardian_id) to show guardian name and their completed quest titles.", fr: "Écris une requête joignant les tables 'guardians' et 'quests' (guardians.id = quests.guardian_id) pour afficher le nom du gardien et les titres de leurs quêtes complétées." }
  },
  {
    id: "sql_3", mentorId: "lina", lang: "SQL", difficulty: "Expert", xpReward: 210, order: 3,
    title: { en: "Aggregation Strike", fr: "Frappe d'Agrégation" },
    description: { en: "Use GROUP BY and HAVING for advanced queries.", fr: "Utilise GROUP BY et HAVING pour des requêtes avancées." },
    prompt: { en: "Write a query that returns the module_id and count of completed quests, only for modules with more than 3 completions, grouped by module.", fr: "Écris une requête qui retourne le module_id et le nombre de quêtes complétées, seulement pour les modules avec plus de 3 complétions, groupés par module." }
  },
  // ── AI & CYBER - Eva (TypeScript) ───────────────────────
  {
    id: "ts_1", mentorId: "eva", lang: "TypeScript", difficulty: "Novice", xpReward: 100, order: 1,
    title: { en: "Type System Init", fr: "Init Système de Types" },
    description: { en: "Define types and interfaces in TypeScript.", fr: "Définis des types et interfaces en TypeScript." },
    prompt: { en: "Create a TypeScript interface 'Guardian' with id (number), name (string), level (number), skills (string[]). Then create a typed function that returns a new Guardian.", fr: "Crée une interface TypeScript 'Guardian' avec id (number), name (string), level (number), skills (string[]). Puis crée une fonction typée qui retourne un nouveau Guardian." }
  },
  {
    id: "ts_2", mentorId: "eva", lang: "TypeScript", difficulty: "Adept", xpReward: 180, order: 2,
    title: { en: "Generic Weapon", fr: "Arme Générique" },
    description: { en: "Write generic TypeScript functions.", fr: "Écris des fonctions TypeScript génériques." },
    prompt: { en: "Write a generic function 'filterBy<T>' that takes an array of T and a predicate function, returning filtered results.", fr: "Écris une fonction générique 'filterBy<T>' qui prend un tableau de T et une fonction prédicat, retournant les résultats filtrés." }
  },
  // ── AI & CYBER - Nova (AI/3D) ────────────────────────────
  {
    id: "nova_1", mentorId: "nova", lang: "Three.js", difficulty: "Adept", xpReward: 200, order: 1,
    title: { en: "First Dimension", fr: "Première Dimension" },
    description: { en: "Create a basic Three.js scene.", fr: "Crée une scène Three.js de base." },
    prompt: { en: "Write the JavaScript code to create a Three.js scene with a rotating red cube. Include renderer, camera, scene, BoxGeometry, and an animate loop.", fr: "Écris le code JavaScript pour créer une scène Three.js avec un cube rouge en rotation. Inclus le renderer, la caméra, la scène, BoxGeometry et une boucle animate." }
  },
  {
    id: "nova_2", mentorId: "nova", lang: "AI", difficulty: "Expert", xpReward: 280, order: 2,
    title: { en: "Prompt Engineering", fr: "Ingénierie de Prompt" },
    description: { en: "Write an optimized AI system prompt.", fr: "Écris un prompt système IA optimisé." },
    prompt: { en: "Write a system prompt for an AI coding assistant that is sharp, concise, uses role-play framing, includes output format constraints, and handles edge cases.", fr: "Écris un prompt système pour un assistant IA de codage qui est précis, concis, utilise un cadre de jeu de rôle, inclut des contraintes de format de sortie, et gère les cas limites." }
  }
];

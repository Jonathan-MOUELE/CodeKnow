<div align="center">

# ⚡ CODEKNOW: RPG CODE ACADEMY ⚡

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Powered by Gemini](https://img.shields.io/badge/Powered%20by-Google%20Gemini-blue.svg)](https://deepmind.google/technologies/gemini/)
[![Framework: React](https://img.shields.io/badge/Framework-React-61dafb.svg)](https://reactjs.org/)

**CodeKnow** est une plateforme d'apprentissage du code immersive, conçue comme un RPG Cyberpunk. Apprenez le développement web, le backend, les bases de données et la cybersécurité à travers des quêtes interactives guidées par des mentors IA ultra-spécialisés.

</div>

---

## 🚀 Concept Immersif

Oubliez les tutoriels ennuyeux. Dans **CodeKnow**, vous progressez comme dans un jeu vidéo :
- **Quêtes Interactives** : Relevez des défis de code réels.
- **Mentors IA** : Chaque langage est gardé par un mentor unique (Rin, Tess, Sora, Kael, Lina, Eva, Nova) avec sa propre personnalité.
- **Feedback Temps Réel** : Vos soumissions sont analysées instantanément par **Google Gemini** pour un retour pédagogique précis.
- **Système de Progression** : Gagnez de l'XP, montez en grade et synchronisez vos succès via Firebase.

## 🛠️ Modules de Formation

| Module | Spécialités | Mentors |
| :--- | :--- | :--- |
| **FRONTEND** | React, Next.js, Tailwind, HTML/CSS | Rin |
| **BACKEND** | Python, Flask, PHP, Symfony, C#, C++ | Tess, Sora, Kael |
| **DATABASE** | SQL, Architecture BDD, Optimisation | Lina |
| **AI & CYBER** | TypeScript, Sécurité, Prompting, Three.js | Eva, Nova |

## 🧠 Intégration IA (Google Gemini)

Le cœur de CodeKnow repose sur l'intégration directe de l'API **Gemini 3 Flash**. Chaque mentor utilise un "System Prompt" spécifique pour évaluer votre code :
- **Analyse Sémantique** : Compréhension réelle de votre logique.
- **Conseils de Senior** : Astuces professionnelles pour les entretiens.
- **Détection de Pièges** : Identification des erreurs courantes de débutants.
- **RPG Framing** : Chaque retour est écrit dans le style et la personnalité du mentor choisi.

## 💻 Stack Technique

- **Frontend** : React 18, Vite, TypeScript, Tailwind CSS, Motion (Framer).
- **IA** : Google Generative AI (Gemini SDK).
- **Backend/Auth** : Firebase (Authentication & Firestore).
- **UI/UX** : Design Cyberpunk/CRT avec effets de scanlines et animations fluides.

## ⚙️ Installation Locale

### Prérequis
- [Node.js](https://nodejs.org/) (v18+)
- Une clé API Google Gemini ([Obtenir ici](https://aistudio.google.com/))

### Étapes
1. **Cloner le projet**
   ```bash
   git clone https://github.com/Jonathan-MOUELE/CodeKnow.git
   cd CodeKnow
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configuration de l'environnement**
   Créez un fichier `.env.local` à la racine :
   ```env
   VITE_FIREBASE_API_KEY=votre_cle
   VITE_FIREBASE_AUTH_DOMAIN=votre_domaine
   VITE_FIREBASE_PROJECT_ID=votre_id
   VITE_FIREBASE_STORAGE_BUCKET=votre_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=votre_sender_id
   VITE_FIREBASE_APP_ID=votre_app_id
   
   # Clé API Gemini (Requis pour le moteur de mentors)
   GEMINI_API_KEY=votre_cle_gemini
   ```

4. **Lancer le serveur de développement**
   ```bash
   npm run dev
   ```

---

<div align="center">
  <p>Développé avec ❤️ pour les futurs Gardiens du Code.</p>
</div>

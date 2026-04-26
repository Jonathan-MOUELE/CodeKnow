# CodeKnow RPG Architecture

This document outlines the technical design and architectural decisions made for the CodeKnow RPG Academy.

## 1. Core Principles
- **Immersion**: The UI uses a "Sublime Retro" aesthetic (CRT effects, pixel art, scanlines) to simulate a 16-bit JRPG Visual Novel.
- **Bilingualism**: First-class support for English and French, switchable at runtime.
- **AI-Driven Feedback**: Mentors are powered by Google Gemini, providing context-aware, personality-driven technical reviews.
- **Security**: Strict Firebase Firestore rules using Attribute-Based Access Control (ABAC).

## 2. Technology Stack
- **Frontend**: React 19 + Vite + Tailwind CSS 4.
- **State Management**: React Context API (`AuthContext`) for auth, user data, and language state.
- **Database/Auth**: Firebase (Firestore & Authentication).
- **AI**: Gemini 1.5 Flash via `@google/genai`.
- **Animations**: `motion` (Framer Motion) for route transitions and lifecycle animations.

## 3. Data Model (Firestore)
- `/users/{userId}`: Core user profile (xp, level, stats).
- `/users/{userId}/quests/{questId}`: Tracks completed missions and submissions.

## 4. AI Prompt Engineering
The Mentors use a "Roleplay Prompting" strategy. In `geminiService.ts`, the model is instructed to act as a specific character (e.g., Rin the TS expert) while evaluating code against JRPG-style criteria (isCorrect, xpReward, trap, seniorTip).

## 5. Visual "Sublime" Effects
- **CRT Overlay**: A global `fixed` div with linear gradients and animation to simulate old monitor scanlines.
- **RetroBox Component**: A reusable component with recursive pixel borders and neon "glow" effects.
- **Lifelike Mentors**: Using `motion` to create subtle breathing and floating animations for character icons.

---
*Created by CodeKnow Systems // Version 3.1.2*

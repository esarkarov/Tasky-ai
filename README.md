# 🧠 Tasky AI

**Tasky AI** is an AI-assisted task management platform built with **React**, **TypeScript**, and **Vite**.  
It combines **Clerk authentication**, **Appwrite persistence**, and **Google Gemini–powered task generation** to help individuals and teams plan and manage work efficiently across multiple productivity views — Inbox, Today, Upcoming, Completed, and Project-focused sections.

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Folder Structure & Architecture](#folder-structure--architecture)
- [Core Services & Modules](#core-services--modules)
- [License](#license)
- [Author](#author)

---

## 🚀 Features

- **Secure authentication & theming** — powered by Clerk with a global router shell, dark theme, and toast notifications.
- **Multiple productivity workspaces** — Inbox, Today, Upcoming, Completed, and Project detail pages, each delivered through lazy-loaded protected routes.
- **AI-generated project task scaffolding** — converts natural language prompts into structured tasks using Google Gemini, automatically persisted via Appwrite when AI assistance is enabled.
- **Appwrite-backed data layer** — provides reusable query builders for counting, filtering, and scheduling tasks.
- **Responsive, accessible UI** — optimized for different devices, highlighting AI workflows and session-based navigation states.

---

## 🧰 Tech Stack

| Category                 | Technologies                                                |
| ------------------------ | ----------------------------------------------------------- |
| **Framework**            | React 19, TypeScript, Vite 7                                |
| **Authentication**       | Clerk React SDK, Clerk Themes                               |
| **Backend-as-a-Service** | Appwrite SDK                                                |
| **AI Integration**       | Google Gemini (`@google/genai`)                             |
| **Styling**              | Tailwind CSS, Radix UI, Tailwind Merge, tailwindcss-animate |
| **Testing**              | Vitest, React Testing Library, jsdom                        |
| **Tooling**              | ESLint, Prettier, TypeScript ESLint, React Compiler         |

---

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone <repo-url>
cd Tasky-ai
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` (or `.env.local`) file at the project root and provide the required keys:

```bash
VITE_CLERK_PUBLISHABLE_KEY="..."
VITE_CLERK_USER_STORAGE_KEY="..."
VITE_APPWRITE_PROJECT_ID="..."
VITE_APPWRITE_TASKS_COLLECTION_ID="..."
VITE_APPWRITE_PROJECTS_COLLECTION_ID="..."
VITE_APPWRITE_ENDPOINT="https://cloud.appwrite.io/v1"
VITE_APPWRITE_DATABASE_ID="..."
VITE_GEMINI_API_KEY="..."
```

These values are validated at runtime to prevent misconfiguration.

### 4. Start the development server

```bash
npm run dev
```

The app will be available at [http://localhost:5173](http://localhost:5173).

---

## 🧪 Usage

### Run the unit test suite

```bash
npm run test
```

### Build for production

```bash
npm run build
```

### Lint & format source

```bash
npm run lint
npm run prettier:check
```

Additional scripts are available for coverage, lint fixing, and auto-formatting.

---

## 🏗️ Folder Structure & Architecture

```bash
src/
├── assets/          # Static assets for marketing and app surfaces
├── components/      # Reusable UI blocks (atoms → organisms → templates)
├── config/          # Runtime configuration (environment schema)
├── constants/       # Shared constants (routes, defaults)
├── hooks/           # Custom React hooks
├── lib/             # External clients (Appwrite, Google Gemini)
├── pages/           # Route-level screens
├── queries/         # Appwrite query builder utilities
├── repositories/    # Data-access abstractions over Appwrite
├── router/          # Route definitions, loaders, actions
├── services/        # Domain logic orchestrating repositories & utilities
├── types/           # Shared TypeScript types & interfaces
├── utils/           # Cross-cutting helpers (auth, text, responses)
└── tests/           # Global Vitest / jsdom setup
```

### Architectural Layers

- **Routing layer:** `src/router` — centralizes public/protected routes, lazy components, loaders, and actions.
- **Service layer:** `src/services` — encapsulates business logic like AI-assisted project creation and bulk persistence.
- **Data access:** `src/repositories` — wraps Appwrite operations with consistent filtering/query logic.
- **Infrastructure clients:** `src/lib` — configures external SDKs (Appwrite, Google Gemini).
- **Presentation layer:** `src/pages` — responsive UI integrated with Clerk session handling.

---

## 🧩 Core Services & Modules

- **Authentication shell (`src/App.tsx`)** — wraps the router with `ClerkProvider`, adds theming and global toasts.
- **Task service (`src/services/task/task.service.ts`)** — aggregates counts, filters by context, and mutates Appwrite documents.
- **AI task generation (`src/services/ai/ai.service.ts`)** — handles Gemini requests, parses JSON responses, and validates structure.
- **Project action handler (`src/router/actions/project/project.action.ts`)** — manages create/update/delete actions and AI-generated project wiring.
- **Appwrite repositories (`src/repositories/*`)** — provide reusable CRUD operations for tasks/projects.

---

## 📄 License

This project is licensed under the **MIT License**.  
See the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

Developed by **Elvin Sarkarov**  
📎 [GitHub @ElvinWeb](https://github.com/ElvinWeb)

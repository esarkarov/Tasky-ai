# Tasky AI

Tasky AI is an AI-assisted task management platform built with React, TypeScript, and Vite. It combines Clerk authentication, Appwrite persistence, and Google Gemini-powered task generation to help individuals and teams plan work across inbox, today, upcoming, completed, and project-focused views.

## Table of Contents

[Features](#features)
[Tech Stack](#tech-stack)
[Getting Started](#getting-started)
[Usage](#usage)
[Folder Structure & Architecture](#folder-structure--architecture)
[Core Services & Modules](#core-services--modules)

## Features

**Secure authentication & theming** powered by Clerk with a global router shell, dark appearance, and toast notifications. 【F:src/App.tsx†L1-L36】
**Multiple productivity workspaces** including Inbox, Today, Upcoming, Completed, and Project detail pages, each delivered through lazy-loaded protected routes. 【F:src/router/routes/protected.routes.ts†L1-L63】
**AI-generated project task scaffolding** that turns prompts into structured tasks using Google Gemini and automatically persists them when project creation is enabled for AI assistance. 【F:src/services/ai/ai.service.ts†L1-L23】【F:src/router/actions/project/project.action.ts†L11-L76】
**Appwrite-backed data layer** for querying and mutating task collections with reusable query builders (counts, inbox filters, scheduling windows). 【F:src/repositories/task/task.repository.ts†L1-L72】【F:src/queries/task/task.queries.ts†L1-L51】
**Responsive, accessible UI** that highlights the AI workflow on the marketing homepage and adapts calls-to-action based on session state. 【F:src/pages/HomePage/HomePage.tsx†L1-L101】

## Tech Stack

**Framework:** React 19, TypeScript, Vite 7【F:package.json†L7-L9】【F:package.json†L42-L45】【F:package.json†L73-L76】
**Authentication:** Clerk React SDK & themes【F:package.json†L19-L21】
**Backend-as-a-Service:** Appwrite client SDK【F:package.json†L34-L35】
**AI Integration:** @google/genai (Gemini)【F:package.json†L21-L21】
**Styling:** Tailwind CSS, Radix UI primitives, Tailwind Merge, tailwindcss-animate【F:package.json†L22-L33】【F:package.json†L47-L49】【F:package.json†L62-L72】
**Testing:** Vitest, Testing Library, jsdom【F:package.json†L10-L12】【F:package.json†L53-L70】
**Tooling:** ESLint, Prettier, TypeScript ESLint, React Compiler【F:package.json†L13-L16】【F:package.json†L63-L75】

## Getting Started

1. **Clone the repository**

- ```bash

  ```

- git clone <repo-url>
- cd Tasky-ai
- ```
  +2. **Install dependencies**
  ```
- ```bash

  ```

- npm install
- ```
  +3. **Configure environment variables** – create a `.env` (or `.env.local`) file at the project root and provide the required keys:
  ```
- ```bash

  ```

- VITE_CLERK_PUBLISHABLE_KEY="..."
- VITE_CLERK_USER_STORAGE_KEY="..."
- VITE_APPWRITE_PROJECT_ID="..."
- VITE_APPWRITE_TASKS_COLLECTION_ID="..."
- VITE_APPWRITE_PROJECTS_COLLECTION_ID="..."
- VITE_APPWRITE_ENDPOINT="https://cloud.appwrite.io/v1"
- VITE_APPWRITE_DATABASE_ID="..."
- VITE_GEMINI_API_KEY="..."
- ```

  ```

- These values are validated at runtime to prevent misconfiguration. 【F:src/config/env.config.ts†L3-L42】4. **Start the development server**
- ```bash

  ```

- npm run dev
- ```

  ```

- Vite will expose the app locally (default: `http://localhost:5173`).【F:package.json†L7-L9】

## Usage

**Run the unit test suite**

- ```bash

  ```

- npm run test
- ```
  **Build for production**
  ```
- ```bash

  ```

- npm run build
- ```
  **Lint & format source**
  ```
- ```bash

  ```

- npm run lint
- npm run prettier:check
- ```

  ```

- Additional scripts are available for coverage, fixing lint issues, and formatting all files. 【F:package.json†L10-L16】
- ## Folder Structure & Architecture
  ```
  src/
  ```
- assets/ # Static assets used across marketing and app surfaces
- components/ # Reusable UI building blocks (atoms → organisms → templates)
- config/ # Runtime configuration (environment schema)
- constants/ # Shared constants such as routes and defaults
- hooks/ # Custom React hooks for domain interactions
- lib/ # Client initializers (Appwrite, Google Gemini)
- pages/ # Route-level screens consumed by the router
- queries/ # Query builder utilities for Appwrite
- repositories/ # Data-access abstractions wrapping SDK calls
- router/ # Route definitions, loaders, and actions
- services/ # Domain logic orchestrating repositories & utilities
- types/ # Shared TypeScript types and interfaces
- utils/ # Cross-cutting helpers (auth, text, response helpers)
- tests/ # Global Vitest/JSDOM setup
  ```**Routing layer:**`src/router`centralizes public vs. protected route groups, lazy components, loaders, and actions for server-like data mutations. 【F:src/router/index.ts†L1-L37】【F:src/router/routes/protected.routes.ts†L1-L63】
**Service layer:**`src/services`encapsulates business rules such as task aggregation, AI-assisted project creation, and bulk persistence. 【F:src/services/task/task.service.ts†L1-L153】【F:src/services/ai/ai.service.ts†L1-L23】
**Data access:**`src/repositories`wraps Appwrite database operations and reuses query builders for consistent filtering. 【F:src/repositories/task/task.repository.ts†L1-L72】【F:src/queries/task/task.queries.ts†L1-L51】
**Infrastructure clients:**`src/lib/appwrite.ts`and`src/lib/google-ai.ts`configure external SDKs with environment keys. 【F:src/lib/appwrite.ts†L1-L8】【F:src/lib/google-ai.ts†L1-L4】
**Presentation layer:**`src/pages` delivers responsive, accessible UI backed by Clerk session-aware logic. 【F:src/pages/HomePage/HomePage.tsx†L1-L101】
- ## Core Services & Modules
  **Authentication shell (`src/App.tsx`)** – wraps the router with `ClerkProvider`, supplies theming overrides, and injects global toasts. 【F:src/App.tsx†L1-L36】
  **Task service (`src/services/task/task.service.ts`)** – aggregates counts, filters tasks by context (today/inbox/upcoming/completed), and mutates Appwrite documents via repositories. 【F:src/services/task/task.service.ts†L7-L153】
  **AI task generation (`src/services/ai/ai.service.ts`)** – sends prompt-driven requests to Gemini, parses JSON responses, and safeguards against malformed output. 【F:src/services/ai/ai.service.ts†L1-L23】
  **Project action handler (`src/router/actions/project/project.action.ts`)** – handles create/update/delete submissions, wires AI-generated tasks into new projects, and returns HTTP-style responses for the router. 【F:src/router/actions/project/project.action.ts†L11-L76】
  **Appwrite repositories (`src/repositories/*`)** – centralize CRUD and bulk operations for tasks and projects using the configured Appwrite client. 【F:src/repositories/task/task.repository.ts†L1-L72】【F:src/lib/appwrite.ts†L1-L8】
- For deeper exploration, open the referenced modules or run the provided scripts to inspect behavior locally.

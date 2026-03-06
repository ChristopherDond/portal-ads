<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:0F172A,100:6366F1&height=180&section=header&text=Portal%20ADS&fontSize=56&fontColor=ffffff&fontAlignY=38&desc=Student%20Projects%20Portal%20%E2%80%94%20Systems%20Analysis%20%26%20Development&descAlignY=60&descSize=16" width="100%"/>

<br/>

[![Next.js](https://img.shields.io/badge/Next.js_15-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Auth.js](https://img.shields.io/badge/Auth.js-000000?style=for-the-badge&logo=authelia&logoColor=white)](https://authjs.dev/)
[![Vercel](https://img.shields.io/badge/Deployed_on_Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://portal-ads-seven.vercel.app)

<br/>

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-6366F1?style=for-the-badge)](https://portal-ads-seven.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](./LICENSE)

<br/>

> **A fullstack web platform for ADS students to showcase, discover and collaborate on academic projects.**

</div>

---

## 📋 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Tech Stack](#️-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Database Setup](#-database-setup)
- [Deploy](#-deploy)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 About

**Portal ADS** is a student project portal built for the *Análise e Desenvolvimento de Sistemas* (Systems Analysis & Development) program. It provides a centralized space where students can:

- **Publish** and document their academic projects
- **Discover** work from other students and semesters
- **Connect** with peers and potential collaborators

The platform was built as a real-world exercise in fullstack development — from database modeling with Prisma to authenticated routes with Auth.js and server-side rendering with Next.js App Router.

---

## ✨ Features

- 🔐 **Authentication** — Secure sign-in via Auth.js (NextAuth v5)
- 📁 **Project Publishing** — Students can post and manage their own projects
- 🔍 **Project Discovery** — Browse projects from the entire cohort
- 📱 **Responsive Design** — Mobile-first layout with Tailwind CSS
- ⚡ **Server Components** — Leverages Next.js 15 App Router for fast SSR
- 🗄️ **Database ORM** — Type-safe database queries via Prisma
- 🌐 **Production Deploy** — Live on Vercel with automatic CI from `main`

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Framework** | Next.js 15 (App Router) | Fullstack React framework with SSR/SSG |
| **Language** | TypeScript | Type safety across the entire codebase |
| **Styling** | Tailwind CSS | Utility-first CSS framework |
| **ORM** | Prisma | Type-safe database access and migrations |
| **Auth** | Auth.js (NextAuth v5) | Session management and authentication |
| **Linting** | ESLint | Code quality and consistency |
| **Deploy** | Vercel | Hosting with preview deployments per PR |

---

## 📁 Project Structure

```
portal-ads/
├── prisma/
│   └── schema.prisma        # Database schema & Prisma models
├── public/                  # Static assets (images, icons)
├── src/
│   ├── app/                 # Next.js App Router pages & layouts
│   │   ├── layout.tsx       # Root layout
│   │   ├── page.tsx         # Home page
│   │   └── (routes)/        # Application routes
│   ├── components/          # Reusable UI components
│   ├── lib/                 # Shared utilities and helpers
│   └── types/               # TypeScript type definitions
├── auth.ts                  # Auth.js configuration
├── next.config.ts           # Next.js configuration
├── tailwind.config.ts       # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js 18+](https://nodejs.org/)
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/)
- A database (PostgreSQL recommended for production)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/ChristopherDond/portal-ads.git

# 2. Navigate into the project
cd portal-ads

# 3. Install dependencies
npm install

# 4. Set up your environment variables
cp .env.example .env.local
# Fill in the required values (see Environment Variables section)

# 5. Run Prisma migrations
npx prisma migrate dev

# 6. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Environment Variables

Create a `.env.local` file at the root of the project with the following variables:

```env
# Database
DATABASE_URL="your_database_connection_string"

# Auth.js
AUTH_SECRET="your_auth_secret"           # Generate with: openssl rand -base64 32
AUTH_URL="http://localhost:3000"          # Your app URL

# OAuth Provider (example: GitHub)
AUTH_GITHUB_ID="your_github_oauth_app_id"
AUTH_GITHUB_SECRET="your_github_oauth_app_secret"
```

> ⚠️ **Never commit `.env.local` to version control.** The `.gitignore` already excludes it.

---

## 🗄️ Database Setup

This project uses **Prisma ORM**. After setting your `DATABASE_URL`:

```bash
# Run all pending migrations
npx prisma migrate dev

# Visualize the database with Prisma Studio
npx prisma studio

# Reset the database (caution: deletes all data)
npx prisma migrate reset
```

---

## 📦 Available Scripts

```bash
npm run dev        # Start development server (with Turbopack)
npm run build      # Create production build
npm run start      # Start production server
npm run lint       # Run ESLint
```

---

## 🌐 Deploy

This project is deployed on **Vercel** with automatic deployments triggered by pushes to `main`.

**To deploy your own instance:**

1. Fork this repository
2. Import it into [Vercel](https://vercel.com/new)
3. Add all required [environment variables](#-environment-variables) in the Vercel dashboard
4. Deploy — Vercel handles the build and CDN automatically

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ChristopherDond/portal-ads)

---

## 🤝 Contributing

Contributions, issues and feature requests are welcome!

```bash
# 1. Fork the project
# 2. Create your feature branch
git checkout -b feature/your-feature-name

# 3. Commit your changes
git commit -m "feat: add your feature description"

# 4. Push to your branch
git push origin feature/your-feature-name

# 5. Open a Pull Request
```

Please follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](./LICENSE) file for details.

---

<div align="center">

Made with 💙 by [Christopher Dondici](https://github.com/ChristopherDond)

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:6366F1,100:0F172A&height=100&section=footer" width="100%"/>

</div>

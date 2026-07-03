<div align="center">
  <br />
    <a href="" target="_blank">
      <img src="" alt="Project Banner">
    </a>
  <br />

  <div>
    <img src="https://img.shields.io/badge/-Next_JS-black?style=for-the-badge&logoColor=white&logo=nextdotjs&color=000000" alt="nextdotjs" />
    <img src="https://img.shields.io/badge/-TypeScript-black?style=for-the-badge&logoColor=white&logo=typescript&color=3178C6" alt="typescript" />
    <img src="https://img.shields.io/badge/-Tailwind_CSS-black?style=for-the-badge&logoColor=white&logo=tailwindcss&color=06B6D4" alt="tailwindcss" />
    <img src="https://img.shields.io/badge/-PostgreSQL-black?style=for-the-badge&logoColor=white&logo=postgresql&color=4169E1" alt="postgresql" />
    <img src="https://img.shields.io/badge/-Drizzle-black?style=for-the-badge&logoColor=white&logo=drizzle&color=C5F74F" alt="drizzle" />
    <img src="https://img.shields.io/badge/-Paystack-black?style=for-the-badge&logoColor=white&logo=paystack&color=0BA95B" alt="paystack" />
  </div>

  <h3 align="center">A Fintech Bank Application</h3>
</div>

## 📋 <a name="table">Table of Contents</a>

1. 🤖 [Introduction](#introduction)
2. ⚙️ [Tech Stack](#tech-stack)
3. 🔋 [Features](#features)
4. 🤸 [Quick Start](#quick-start)
5. 🕸️ [Environment Variables](#environment-variables)

## <a name="introduction">🤖 Introduction</a>

Built with Next.js, this e-banking platform allows users to manage their finances, view transactions, transfer funds, and link external bank accounts via Paystack. It features secure JWT authentication, a responsive dashboard, and real-time transaction tracking.

## <a name="tech-stack">⚙️ Tech Stack</a>

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- Drizzle ORM + Neon (PostgreSQL)
- Paystack
- React Hook Form + Zod
- Chart.js
- react-day-picker
- date-fns
- lucide-react

## <a name="features">🔋 Features</a>

👉 **Authentication**: Secure JWT-based authentication with proper validation and authorization using bcryptjs and jose

👉 **Dashboard**: Comprehensive overview of account balances, recent transactions, and spending categories with interactive charts

👉 **Transaction History**: Paginated and filterable transaction history with detailed views

👉 **Funds Transfer**: Transfer funds between accounts with validation and confirmation

👉 **Paystack Integration**: Link external bank accounts via Paystack for deposits and account management

👉 **Responsive Design**: Fully responsive layout that works seamlessly across desktop, tablet, and mobile devices

👉 **Server Actions**: Leverages Next.js Server Actions for secure server-side data handling

## <a name="quick-start">🤸 Quick Start</a>

Follow these steps to set up the project locally on your machine.

**Prerequisites**

Make sure you have the following installed on your machine:

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/en)
- [npm](https://www.npmjs.com/) (Node Package Manager)

**Cloning the Repository**

```bash
git clone https://github.com/hollali/e-banking.git
cd e-banking
```

**Installation**

Install the project dependencies using npm:

```bash
npm install
```

**Set Up Environment Variables**

Create a new file named `.env` in the root of your project and add the following content:

```env
#NEXT
NEXT_PUBLIC_SITE_URL=http://localhost:3000

#DATABASE (NeonDB)
DATABASE_URL=

#AUTH
JWT_SECRET=

#PAYSTACK
PAYSTACK_SECRET_KEY=
PAYSTACK_PUBLIC_KEY=
```

Replace the placeholder values with your actual respective account credentials. You can obtain these by signing up on [Neon](https://neon.tech/) and [Paystack](https://paystack.com/).

**Running the Project**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the project.

**Database Setup**

```bash
npm run db:generate
npm run db:push
```

## <a name="environment-variables">🕸️ Environment Variables</a>

<details>
<summary><code>.env.example</code></summary>

```env
#NEXT
NEXT_PUBLIC_SITE_URL=http://localhost:3000

#DATABASE (NeonDB)
DATABASE_URL=

#AUTH
JWT_SECRET=

#PAYSTACK
PAYSTACK_SECRET_KEY=
PAYSTACK_PUBLIC_KEY=
```

</details>

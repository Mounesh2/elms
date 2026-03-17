# LearnHub — Premium E-Learning Marketplace

LearnHub is a professional, Udemy-inspired online course marketplace built with **Next.js 14**, **Supabase**, and a robust suite of free-tier tools. It provides a seamless experience for students to learn and instructors to teach and earn.

## 🛠 Tech Stack (100% Free Tools)

- **Framework**: [Next.js 14 (App Router)](https://nextjs.org/) + TypeScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (Purple Primary Theme: `#7C3AED`)
- **Database & Auth**: [Supabase](https://supabase.com/) (PostgreSQL + Auth Helpers)
- **Video Storage**: [Cloudflare R2](https://www.cloudflare.com/products/r2/) (S3-compatible)
- **Video Delivery**: [Cloudflare Stream](https://www.cloudflare.com/products/cloudflare-stream/)
- **Payments**: [Stripe](https://stripe.com/) (Express Accounts for Instructors)
- **Email**: [Resend](https://resend.com/) + [React Email](https://react.email/)
- **Search**: [MeiliSearch](https://www.meilisearch.com/)
- **AI Features**: [Groq API](https://groq.com/) (Llama 3 Powered)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)

## 📂 Project Structure

```text
/app
  /(public)       - Landing, catalog, course pages
  /(auth)         - Login, register, password recovery
  /(student)      - Student dashboard, learning area, certificates
  /(instructor)   - Instructor suite (courses, revenue, analytics)
  /(admin)        - Platform management (users, courses, reports)
  /api            - Full backend API suite
/components
  /ui             - Atomic UI elements (Buttons, Cards, Modals)
  /course         - Course cards, players, curriculum builders
  /layout         - Headers, footers, and sidebars
/lib              - Service clients (Supabase, Stripe, AI, etc.)
/hooks            - Custom React hooks (useAuth, useCourse)
/types            - Shared TypeScript definitions
```

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18+
- Supabase Project
- Cloudflare R2 Bucket
- Stripe Account (Test Mode)
- Groq API Key

### 2. Installation
```bash
npm install
```

### 3. Environment Setup
Copy the placeholders in `.env.local` and fill them with your credentials. **Crucial**: Ensure `DATABASE_URL` is set to your Supabase PostgreSQL connection string to resolve "Internal Server Errors".

### 4. Database Setup
Run the migration/seed scripts (if applicable) or use the Supabase SQL editor to create the required tables defined in `lib/db/schema.ts`.

### 5. Start Developing
```bash
npm run dev
```

## 📄 License
MIT © LearnHub

# Hackathon Control (HC) Admin Dashboard

## Overview
A modern admin dashboard for managing hackathon participants, applications, and event logistics. Provides real-time analytics, user management, and communication tools for organizers.

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS with CSS Variables
- **UI Components**: Shadcn/ui + Radix Primitives
- **Authentication**: NextAuth.js
- **Database**: PostgreSQL + Drizzle ORM
- **Charts**: Recharts
- **Deployment**: Vercel

## Design System
### Colors
**Core Palette (HSL Values):**
- Primary: `hsl(210 100% 56%)` (#0084FF) - Vibrant blue for primary actions
- Secondary: `hsl(33 100% 57%)` (#FF8A00) - Orange for secondary elements
- Destructive: `hsl(0 68% 58%)` (#E53E3E) - Red for errors/destructive actions
- Accent: `hsl(199 84% 55%)` (#1DA1F2) - Twitter-like blue for highlights

**Theme Variables:**
```css
/* Light Mode */
--background: 0 0% 100% (White)
--foreground: 215 28% 17% (Dark slate)
--muted: 220 14% 96% (Light gray)
--border: 220 13% 91% (Medium gray)

/* Dark Mode */
--background: 215 28% 17% (Dark slate)
--foreground: 210 40% 98% (Off white)
--muted: 215 28% 25% (Dark gray)
--border: 215 28% 25% (Medium slate)
```

**Chart Colors:**
- Light Mode: Earth tones (Terracotta, Forest Green, Navy, Mustard, Clay)
- Dark Mode: Vibrant palette (Royal Blue, Emerald, Amber, Violet, Coral)

### Typography
**Font Stack:**
- **Primary Font**: `Fredoka`
- **Secondary Font**: `Rubik`
- Optimal readability for dashboard interfaces with x-height balance

### Animations
- Built-in tailwindcss-animate plugin

## Project Structure
```
hc-admin/
├── app/               # Next.js app router
│   ├── (auth)/        # Authentication routes
│   ├── (dashboard)/   # Protected admin routes
│   └── api/           # API endpoints
├── components/        # Reusable components
│   ├── ui/            # Shadcn/ui primitives
│   ├── Charts/        # Data visualization
├── lib/               # Utilities/config
│   ├── db/            # Database config
│   └── validations/   # Form validations
├── actions/           # Server actions
└── types/             # TypeScript definitions
```

## Getting Started
1. Install dependencies:
```bash
pnpm install
```

2. Configure environment variables:
```bash
cp .env.example .env.local
```

3. Run development server:
```bash
pnpm dev
```

## Environment Variables
```env
DATABASE_URL="postgres://..."
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="http://localhost:3000"
AWS_SES_REGION="..."
AWS_SES_ACCESS_KEY="..."
AWS_SES_SECRET_ACCESS_KEY="..."
```

> Note: Actual color values are defined in CSS variables via `app/globals.css`

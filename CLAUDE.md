# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
npm run dev              # Start dev server with Turbo bundler

# Production
npm run build           # prisma generate && next build
npm start               # Start production server

# Database
npm run migrate         # Run Prisma migrations
npm run studio          # Open Prisma Studio
npm run seed            # Seed database
npm run clean-db        # Clean database

# Linting
npm run lint            # Run ESLint

# Cron/Sync
npm run sync            # Run cron jobs
npm run sync:dev        # Development cron with NODE_ENV=development
```

## Architecture

### Tech Stack
- **Framework:** Next.js 14 (App Router) with TypeScript
- **Database:** PostgreSQL with Prisma ORM (multi-schema: base, dataCarFR, dataCarEN)
- **Auth:** NextAuth.js 5 beta (Google OAuth + Credentials, JWT sessions)
- **UI:** Tailwind CSS + Shadcn/ui + Radix UI
- **State:** React Query (TanStack)
- **i18n:** next-intl (French default, English supported)

### Route Structure
```
/[locale]/(main)/(auth)/      # Auth pages (login, register)
/[locale]/(main)/(content)/   # Public content (search, listings, user settings)
/[locale]/(protected)/        # Protected routes requiring authentication
```

### Key Directories
- `src/lib/actions/` - Server actions
- `src/app/api/` - REST API routes
- `src/components/ui/` - Shadcn/ui base components
- `src/i18n/` - Internationalization config
- `prisma/schema.prisma` - Database schema
- `messages/` - Translation files (fr.json, en.json)

### Authentication Flow
1. Auth providers configured in `auth.config.ts`
2. Prisma adapter and callbacks in `src/lib/auth.ts`
3. Route protection via `src/middleware.ts`
4. Server actions in `src/lib/actions/auth.action.ts`

### Database Schema
- Multi-schema PostgreSQL: `base` (app data), `dataCarFR` (French car data), `dataCarEN` (English car data)
- User roles: ADMIN, USER, PRO
- Complex car reference hierarchy: Type > Make > Model > Generation > Series > Trim > Equipment

### Environment Variables
Required variables include:
- `DATABASE_URL` - PostgreSQL connection
- `AUTH_SECRET` - NextAuth secret
- `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` - Google OAuth
- `S3_*` - AWS S3 configuration for file storage

## Conventions

- Path alias: `@/*` maps to `./src/*`
- Prisma client singleton pattern in `src/prisma.ts`
- Form validation uses React Hook Form + Zod schemas
- All routes are locale-prefixed (e.g., `/fr/search`, `/en/profile`)

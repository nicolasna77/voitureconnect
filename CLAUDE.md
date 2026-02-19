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

# Tests
npm test                # Run all tests (vitest run)
npm run test:watch      # Watch mode
npm run test:coverage   # With coverage report

# Cron/Sync
npm run sync            # Run cron jobs
npm run sync:dev        # Development cron with NODE_ENV=development
```

## Git Workflow

### Branch strategy

Every feature or bug fix gets its own branch. Never commit directly to `master` or `dev`.

| Type | Branch name | Example |
|------|-------------|---------|
| New feature | `feat/short-description` | `feat/profile-avatar-upload` |
| Bug fix | `fix/short-description` | `fix/favorites-delete` |
| Chore / refactor | `chore/short-description` | `chore/cleanup-api-routes` |

### Before starting any work

1. Create the branch from `dev`:
   ```bash
   git checkout dev && git pull
   git checkout -b feat/my-feature
   ```

2. List the planned changes as a comment or in the commit message body — what files will be touched, what the change achieves.

### Completing a feature

When the feature is done, always run the three quality skills on the new/modified files:

1. `/vercel-react-best-practices` — check for performance issues (waterfalls, bundle size, re-renders)
2. `/vercel-composition-patterns` — check component design and composition patterns
3. `/web-design-guidelines` — check accessibility, UX, and web interface standards

Fix every issue reported by the skills before moving on.

Then run the four checks in order:

```bash
npm run lint        # Must pass with 0 errors
npx tsc --noEmit    # Must pass with 0 errors
npm run build       # Must succeed
npm test            # Must pass with 0 failures
```

Only after the skills review and all four checks pass:
```bash
git add <specific files>
git commit -m "feat(scope): description"
git push origin feat/my-feature
# Then open a PR to merge into dev
```

### Merging to dev

`dev` receives completed, tested features via PR or direct merge only after build + tests pass.
`master` is only updated from `dev` when the app is ready for production.

## Tests

### Framework: Vitest + Testing Library

- Test files live in `src/test/` or co-located as `*.test.tsx` next to the file they test
- Example pattern: `src/test/examples/pricing-cards.test.tsx`
- Setup file: `src/test/setup.ts` (imports `@testing-library/jest-dom`)

### What to test at the end of each feature

| Type | What to cover |
|------|---------------|
| UI component | Renders correctly, user interactions, conditional rendering |
| Server action / util | Input validation, expected output, error cases |
| API route logic | Auth guard present, correct response shape |

### Mocking conventions

```ts
// Mock Next.js navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

// Mock auth session
vi.mock("@/lib/auth-client", () => ({
  useSession: () => ({ data: { user: { id: "1", name: "Test", email: "t@t.com" } } }),
  updateUser: vi.fn().mockResolvedValue({}),
}));
```

## Architecture

### Tech Stack
- **Framework:** Next.js 14 (App Router) with TypeScript
- **Database:** PostgreSQL with Prisma ORM (multi-schema: base, dataCarFR, dataCarEN)
- **Auth:** Better Auth (Google OAuth + Credentials, JWT sessions)
- **UI:** Tailwind CSS + Shadcn/ui + Radix UI
- **State:** React Query (TanStack)
- **Storage:** Vercel Blob (`@vercel/blob`) — avatars, logos
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
- `src/test/` - Vitest test files and setup
- `prisma/schema.prisma` - Database schema
- `messages/` - Translation files (fr.json, en.json)

### Authentication Flow
1. Better Auth configured in `src/lib/auth.ts`
2. Client helpers exported from `src/lib/auth-client.ts`
3. Route protection via `src/middleware.ts`
4. Per-request session deduplication via `src/lib/cached-session.ts`

### Database Schema
- Multi-schema PostgreSQL: `base` (app data), `dataCarFR` (French car data), `dataCarEN` (English car data)
- User roles: ADMIN, USER, PRO
- Complex car reference hierarchy: Type > Make > Model > Generation > Series > Trim > Equipment

### Environment Variables
Required variables include:
- `DATABASE_URL` - PostgreSQL connection
- `BETTER_AUTH_SECRET` - Better Auth secret
- `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` - Google OAuth
- `BLOB_READ_WRITE_TOKEN` - Vercel Blob storage
- `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` - Stripe payments
- `RESEND_API_KEY` - Transactional emails

## Conventions

- Path alias: `@/*` maps to `./src/*`
- Prisma client singleton pattern in `src/prisma.ts`
- Form validation uses React Hook Form + Zod schemas
- All routes are locale-prefixed (e.g., `/fr/search`, `/en/profile`)
- Use `getCachedSession()` from `src/lib/cached-session.ts` in all API routes (not `auth.api.getSession` directly)

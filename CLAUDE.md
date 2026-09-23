# CLAUDE.md

## Project

Ant Design Pro — React enterprise boilerplate on Vite, antd v6, ProComponents v3, React Router.

## Commands

`npm start` / `npm run dev` (dev + mock), `npm run build`, `npm run preview`, `npm run lint` (Biome+tsc), `npm run test` (Vitest), `npx antd lint ./src` (antd-specific checks).

Other: `npm run biome` (auto-fix), `npm run tsc` (type-check only).

## Critical Rules

- **Biome only** — no ESLint, no Prettier. Both `npm run lint` and `npx antd lint ./src` must pass before commit
- **Always `npx antd info <Component>` before writing antd code** — don't guess APIs from memory
- **Conventional commits** required (commitlint enforced)
- **TypeScript strict** · **Node ≥ 22** · **`package-lock.json`** (not yarn/pnpm)

## Architecture Essentials

**Config**: `vite.config.ts` (Vite + Tailwind + API mock), `config/defaultSettings.ts` (ProLayout defaults).

**Entry**: `index.html` → `src/main.tsx` → `RouterProvider` + `LocaleProvider`.

**Auth**: `AuthProvider` (`src/contexts/AuthContext.tsx`) → `GET /api/currentUser`; 401 → redirect login. `access.ts`: `canAdmin = currentUser.access === 'admin'`. Mock creds: `admin`/`ant.design` or `user`/`ant.design`.

**Layout**: `src/layouts/BasicLayout.tsx` with ProLayout. Routes in `src/routes/index.tsx`.

**State**: `useAuth()` for currentUser/settings. `@tanstack/react-query` for complex server state.

**Styling priority**: Tailwind CSS v4 (layout) → antd-style v4 / `createStyles` (theme tokens) → Less (global fonts).

**Request**: `src/utils/request.ts` (axios). APIs in `src/services/api.ts`.

**i18n**: `zh-CN` / `en-US` in `src/locales/`. `react-intl` `useIntl().formatMessage({ id, defaultMessage })`.

**Mock**: `mock/vite-mock.ts` via Vite middleware (dev only).

**Cloudflare Worker**: `cloudflare-worker/` — separate Hono app, own `package.json`, not an npm workspace.

## Page Co-location

Each page dir: `index.tsx`, optional `service.ts`, style files. Keep page-specific code with the page.

# CLAUDE.md

Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.

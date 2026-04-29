# cleanup plan: move runnable web app into web/

## goal
- Keep project-level guidance and docs at repository root.
- Move all runnable Next.js web app files into `web/`.
- Preserve current behavior.

## move scope
- Move runtime/config/dependency files into `web/`.
- Keep `AGENTS.md`, `skills.md`, `docs/`, and the original prototype HTML at root.

## files to move
- `app/`
- `components/`
- `hooks/`
- `lib/`
- `public/`
- `test/`
- `package.json`
- `package-lock.json`
- `tsconfig.json`
- `next.config.ts`
- `next-env.d.ts`
- `eslint.config.mjs`
- `postcss.config.mjs`
- `vitest.config.ts`
- `node_modules/`

## verification
- Run lint in `web/`
- Run typecheck in `web/`
- Run tests in `web/`
- Run production build in `web/`

# Changelog

All notable changes to this project will be documented in this file.

---

## [1.1.1] - 2026-08-07

### 🐛 Bug Fixes

- **SSR + Cache conflict resolved** — Fixed a critical bug where enabling both SSR and IndexedDB caching at the same time caused data to not render correctly. Previously, the cache response would interfere with the SSR hydration payload, leading to empty or stale data on first load. Now both features work seamlessly together: the server fetches fresh data for SSR, while the client uses cached data for instant feedback and revalidates in the background.

---

## [1.1.0] - 2026-08-07

### ✨ New Features

- **Auto-Generated Convention Types** — The module now automatically scans `*.convention.ts` files and generates global TypeScript types for `useHttp` and `request`. Full auto-complete for URLs, query parameters, and response types out of the box.
- `**autoGenerateConventions` option** — New config option (`true` by default). Set to `false` to disable the auto-generation system and use manual global declarations instead.
- `**conventionsDir` option** — Configure which directory to scan for convention files (default: `conventions/`). Supports DDD-style architectures (e.g., `domains/**/entities/`).
- `**conventionsDepth` option** — Control how deep the module searches for `*.convention.ts` files (default: `1`).
- **Default export convention syntax** — Convention files now use `export default interface` for cleaner, simpler type definitions.

### 📝 Documentation

- Complete rewrite of the **TypeScript & Type Declarations** section in README.
- Added **Manual Global Declaration** guide as an alternative to auto-generation.
- Added **Typing & Auto-complete** section to the Live Demo page with interactive code examples.
- Added npm badges (version, downloads, license, GitHub stars) to README.
- Added `keywords`, `repository`, `homepage`, and `bugs` fields to `package.json` for better npm discoverability.
- Localized all new documentation sections (English & Ukrainian).

### 🔧 Fixes

- Fixed `addImports` paths — all auto-imports now correctly resolve through `./runtime/exports`.
- Added `@types/node` to `devDependencies` to resolve `Cannot find module 'node:fs'` error.

### 🏗️ CI/CD

- Added GitHub Actions workflow for automatic publishing to both **NPM** and **GitHub Packages** on tag push or manual dispatch.

---

## [1.0.0] - 2026-08-05

### 🎉 Initial Release

- `**useHttp` composable** — Reactive HTTP client with full TypeScript support.
- **SSR support** — Server-side data fetching with automatic client hydration, no double-fetching.
- **IndexedDB caching** — Stale-while-revalidate strategy for instant UI feedback.
- **Lazy loading** — `lazy: true` option for manual control over request timing.
- `**reFetch` method** — Re-trigger requests with new parameters on demand.
- `**request` function** — Standalone typed fetch without Vue reactivity, for use in services/utilities.
- **Global interceptors** — `initAweasomeHttp` for global headers, base URL, request/response interceptors.
- `**clearCache` utility** — Programmatic IndexedDB cache clearing.
- **Convention-based URL format** — `'METHOD: /url'` string pattern for strict endpoint typing.
- **Dynamic route params** — Support for `:param` placeholders in URLs with type-safe `params` option.
- **Live Demo page** — Interactive documentation site with i18n (English & Ukrainian).


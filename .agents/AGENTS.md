# AGENTS.md — EnvVault Project

This file provides instructions and context for any AI agent (or developer) working on this codebase. Read this before making any changes.

---

## 🗺️ Project Overview

**EnvVault** is a browser-based `.env` file encryption/decryption tool. All cryptography runs 100% client-side using the native **Web Crypto API**. There is no backend, no database, and no user accounts.

- **Live URL**: https://vaultool.vercel.app
- **GitHub**: https://github.com/CodeWithAmruth/vault
- **Tech stack**: React 19, TypeScript, Tailwind CSS v4, Vite 7, React Router v7
- **Package manager**: `pnpm` (do not use npm or yarn)
- **Node version**: ≥ 18

---

## 📁 Project Structure

```
vault/
├── src/
│   ├── App.tsx                  # Root component — routing only, no logic
│   ├── main.tsx                 # React entry point
│   ├── components/
│   │   └── Nav.tsx              # Top navigation bar with active-link highlighting
│   ├── pages/
│   │   ├── EncryptPage.tsx      # Encrypt .env → download .envvault
│   │   └── DecryptPage.tsx      # Upload .envvault → decrypt → download .env
│   └── crypto/
│       ├── constants.ts         # Single source of truth for all crypto parameters
│       ├── types.ts             # TypeScript interface for the .envvault file schema
│       ├── deriveKey.ts         # PBKDF2 key derivation (Web Crypto API)
│       ├── encryptEnv.ts        # Encrypt plaintext env → EnvVaultFileV1
│       ├── decryptEnv.ts        # Decrypt EnvVaultFileV1 → plaintext env
│       └── testCrypto.ts        # Manual round-trip test function
├── public/
│   ├── logo.jpg                 # Project logo (used in README and meta tags)
│   ├── sitemap.xml              # XML sitemap for search engines
│   └── robots.txt               # Web crawler directives
├── vercel.json                  # Vercel deployment + security headers
├── index.html                   # Entry HTML with full SEO meta tags
├── CHANGELOG.md                 # Version history — MUST be updated on every change
└── AGENTS.md                    # This file
```

---

## 🔐 Cryptographic Architecture

**Do not change the crypto module without understanding these constraints:**

| Parameter | Value | Reason |
|---|---|---|
| KDF | PBKDF2 | Built into Web Crypto API |
| Hash | SHA-256 | Required by PBKDF2 |
| Iterations | 250,000 | OWASP recommended minimum |
| Salt | 16 bytes random | Prevents rainbow table attacks |
| Cipher | AES-GCM | Authenticated encryption (AEAD) |
| Key length | 256 bits | Maximum AES key size |
| IV | 12 bytes random | Recommended for AES-GCM |

All constants live in [`src/crypto/constants.ts`](src/crypto/constants.ts). **Never hardcode crypto values elsewhere.**

The vault file format is defined in [`src/crypto/types.ts`](src/crypto/types.ts) as `EnvVaultFileV1`. Any breaking changes to the format must:
1. Increment the version number (e.g., `EnvVaultFileV2`)
2. Maintain backward compatibility for decryption of v1 files
3. Be documented in `CHANGELOG.md`

---

## 📋 CHANGELOG Rules — CRITICAL

> **Every change to this project MUST be logged in `CHANGELOG.md`.**

Follow this format exactly:

```markdown
## [version] — YYYY-MM-DD

### Added
- Description of new feature or file

### Changed
- Description of modification to existing behaviour

### Fixed
- Description of bug fix

### Removed
- Description of removed feature or file
```

- Use **[Unreleased]** for changes not yet given a version number
- Date format: `YYYY-MM-DD`
- Use semantic versioning: `MAJOR.MINOR.PATCH`
  - PATCH: bug fixes only
  - MINOR: new features, backward-compatible
  - MAJOR: breaking changes to vault format or API
- Omit sections that have no entries (e.g., skip "Removed" if nothing was removed)

---

## 🛡️ Security Rules

1. **Never send user data to any external service.** The CSP in `vercel.json` enforces `connect-src 'none'` — do not loosen this.
2. **Never log passwords or plaintext env values** — not even in `console.log` in dev.
3. **Never store decrypted content in `localStorage` or `sessionStorage`.**
4. **Always zeroize sensitive `TypedArray` buffers** (`.fill(0)`) after use in crypto functions.
5. **Always clear the password state** from React state after a successful encrypt/decrypt operation.
6. If adding a new crypto algorithm or KDF, it must be an additional option (not a replacement) to preserve backward compatibility.
7. The decrypted content auto-clear timer (currently 60 seconds) must never be increased. It may be decreased.

---

## 🎨 UI/UX Rules

1. **Tailwind CSS v4** is used for styling. Do not add inline styles except for dynamic values (e.g., `style={{ color: strength.color }}`).
2. All interactive elements must have:
   - Unique `id` attributes (for testing)
   - `aria-label` if the label is not visible text
   - `focus:ring-*` focus styles
3. Error messages must use `role="alert"` and `aria-live="polite"`.
4. Loading states must disable the triggering button and show a spinner.
5. Do not add third-party UI component libraries. Keep the UI dependency-free.

---

## 🏗️ Development Commands

```bash
pnpm install       # Install dependencies
pnpm dev           # Start dev server at http://localhost:5173
pnpm build         # Production build (output: dist/)
pnpm preview       # Preview the production build
pnpm lint          # Run ESLint
```

---

## 📦 Dependency Rules

- **No new runtime dependencies** without explicit discussion. The crypto layer intentionally uses zero dependencies (Web Crypto API only).
- Dev dependencies (TypeScript types, linting tools) are fine to add.
- If adding a new dependency, document the reason in `CHANGELOG.md`.
- Do not add: `axios`, `lodash`, `moment`, `jquery`, or any backend framework.

---

## 🚀 Deployment

The project deploys automatically to Vercel on every push to `main`.

- Build command: `pnpm build`
- Output directory: `dist/`
- Security headers: defined in `vercel.json` — do not modify without security review
- The `public/` directory is served at the root: e.g., `/public/logo.jpg` → `https://vaultool.vercel.app/logo.jpg`

---

## 🔄 Versioning

Use [Semantic Versioning](https://semver.org/):
- Current version: **1.1.0**
- Version is tracked in `package.json` and `CHANGELOG.md`
- Update both files when releasing a new version
- The `softwareVersion` in `index.html` JSON-LD must also be kept in sync

---

## 🧪 Testing

There are currently no automated tests. When adding tests:
- Use **Vitest** (compatible with the Vite ecosystem, no extra config needed)
- Test file location: `src/crypto/*.test.ts`
- Always test the round-trip: `encryptEnv` → `decryptEnv` should return the original string
- Always test that a wrong password causes `decryptEnv` to throw

---

## ❌ What NOT to Do

- Do not add a backend or API routes
- Do not add user authentication
- Do not add analytics (no Google Analytics, Sentry, Mixpanel, etc.)
- Do not add a database
- Do not change the `connect-src 'none'` CSP directive
- Do not store secrets in `localStorage`
- Do not commit `.env` files to the repository

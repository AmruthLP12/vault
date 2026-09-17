# Changelog

All notable changes to **EnvVault** are documented in this file.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
Versions follow [Semantic Versioning](https://semver.org/).

---

## [Unreleased]

---

## [1.1.1] — 2026-09-17

### Fixed
- **404 on page refresh** — added `rewrites` rule in `vercel.json` so Vercel serves `index.html` for all SPA routes (`/encrypt`, `/decrypt`) instead of returning 404
- **CSP font-src** — updated Content-Security-Policy to allow `https://fonts.googleapis.com` (stylesheet) and `https://fonts.gstatic.com` (font files) so Inter loads correctly in production

---

## [1.1.0] — 2026-09-17

### Added
- **Password strength meter** on `EncryptPage` — 4-segment visual bar (Weak / Fair / Good / Strong) with real-time feedback messages
- **Password show/hide toggle** on both `EncryptPage` and `DecryptPage` — eye icon button with `aria-label`
- **Loading spinner** on both Encrypt and Decrypt buttons — button disabled and shows animated spinner during PBKDF2 derivation
- **Success notification** on `EncryptPage` — green alert shown after successful download
- **Variable count badge** on `EncryptPage` — shows number of non-comment env lines as you type
- **Drag-and-drop file upload** on `DecryptPage` — full drop zone with visual feedback states (idle / dragging / valid / invalid)
- **Vault metadata preview card** on `DecryptPage` — shows filename, created date, variable count, cipher, KDF iterations before decryption
- **Auto-clear countdown** on `DecryptPage` — decrypted content and password state cleared after 60 seconds with visible timer
- **"Clear now" button** on `DecryptPage` — manual trigger to clear decrypted content immediately
- **Copy-to-clipboard** button on `DecryptPage` — copies decrypted content; clipboard is auto-cleared after 30 seconds
- **Enter key support** — pressing Enter in password fields triggers encrypt/decrypt
- **`vercel.json`** — Vercel deployment configuration with strict security headers:
  - `Content-Security-Policy` with `connect-src 'none'`
  - `X-Frame-Options: DENY`
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: no-referrer`
  - `Strict-Transport-Security` with preload
  - `Cross-Origin-Opener-Policy: same-origin`
  - `Permissions-Policy` restricting camera, mic, geolocation
- **`public/sitemap.xml`** — XML sitemap for search engine crawlers
- **`public/robots.txt`** — web crawler directives with sitemap reference
- **`AGENTS.md`** (`.agents/AGENTS.md`) — comprehensive project context file for AI agents and developers
- **`CHANGELOG.md`** — this file; version history tracking

### Changed
- `index.html` — full SEO overhaul:
  - Descriptive `<title>` tag
  - `<meta name="description">` and `<meta name="keywords">`
  - Open Graph tags (`og:title`, `og:description`, `og:image`, `og:url`, `og:type`)
  - Twitter Card tags (`twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`)
  - `<link rel="canonical">` and `<link rel="sitemap">`
  - `<meta name="theme-color">` and `<meta name="color-scheme">`
  - JSON-LD structured data (`WebApplication` schema)
  - Favicon updated to `logo.jpg`
- `EncryptPage.tsx` — password field is zeroized from React state 100ms after successful encryption
- `DecryptPage.tsx` — original filename from vault `meta.filename` is now used when downloading the `.env` file
- `README.md` — updated with pitch, project description, markets, and logo sections

### Fixed
- Password state no longer persists in component memory after a successful encryption operation

---

## [1.0.0] — 2026-09-07

### Added
- Initial release of EnvVault
- `EncryptPage` — paste `.env` content + password → download `.envvault` JSON file
- `DecryptPage` — upload `.envvault` + password → view/download plaintext `.env`
- `Nav` component with active-link highlighting for `/encrypt` and `/decrypt` routes
- Crypto module (`src/crypto/`):
  - `constants.ts` — PBKDF2 / AES-GCM parameter constants
  - `types.ts` — `EnvVaultFileV1` TypeScript interface
  - `deriveKey.ts` — PBKDF2 key derivation via Web Crypto API
  - `encryptEnv.ts` — encrypt plaintext → `EnvVaultFileV1`
  - `decryptEnv.ts` — decrypt `EnvVaultFileV1` → plaintext
  - `testCrypto.ts` — manual round-trip test function
- Self-describing `.envvault` file format (JSON) with embedded crypto parameters:
  - KDF: PBKDF2, SHA-256, 250,000 iterations, 16-byte random salt
  - Cipher: AES-GCM, 256-bit key, 12-byte random IV
  - Meta: `createdAt`, `filename`, `lineCount`
- `README.md` with feature list, setup instructions, and file format documentation
- `public/logo.jpg` — project logo

---

[Unreleased]: https://github.com/CodeWithAmruth/vault/compare/v1.1.0...HEAD
[1.1.0]: https://github.com/CodeWithAmruth/vault/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/CodeWithAmruth/vault/releases/tag/v1.0.0

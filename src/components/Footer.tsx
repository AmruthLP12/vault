// ── Social / brand link constants ─────────────────────────────────────────────
const AUTHOR = {
  name:      'Amruth LP',
  portfolio: 'https://amruthlp.vercel.app/',
  github:    'https://github.com/AmruthLP12',
  blog:      'https://technodrishti.vercel.app/',
}
const PROJECT = {
  github:  'https://github.com/CodeWithAmruth/vault',
  live:    'https://vaultool.vercel.app',
  sitemap: 'https://vaultool.vercel.app/sitemap.xml',
}

// ── Icons ─────────────────────────────────────────────────────────────────────
function GitHubIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  )
}

function ExternalLinkIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  )
}

function BlogIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16v16H4z" rx="2" />
      <path d="M8 9h8M8 13h6M8 17h4" />
    </svg>
  )
}

function PortfolioIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  )
}

// ── Footer link helper ────────────────────────────────────────────────────────
function FooterLink({
  href, children, subtle = false,
}: {
  href: string
  children: React.ReactNode
  subtle?: boolean
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display:    'inline-flex',
        alignItems: 'center',
        gap:        '0.3rem',
        color:      subtle ? 'var(--text-muted)' : 'var(--text-secondary)',
        fontSize:   '0.8rem',
        textDecoration: 'none',
        transition: 'color 0.2s ease',
        padding:    '0.1rem 0',
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#7c9aff' }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = subtle ? 'var(--text-muted)' : 'var(--text-secondary)' }}
    >
      {children}
    </a>
  )
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer style={{
      borderTop:  '1px solid rgba(99, 130, 255, 0.10)',
      background: 'rgba(8, 11, 20, 0.85)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      padding: '2.5rem 1.5rem 2rem',
      marginTop: 'auto',
    }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        {/* ── Main grid ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '2.5rem',
          marginBottom: '2rem',
        }}>

          {/* Col 1 — Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <div style={{
                width: '26px', height: '26px',
                background: 'linear-gradient(135deg, #6382ff, #4a63d9)',
                borderRadius: '6px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 10px rgba(99,130,255,0.35)',
                flexShrink: 0,
              }}>
                🔐
              </div>
              <span style={{
                fontWeight: 700,
                fontSize: '1rem',
                letterSpacing: '-0.02em',
                background: 'linear-gradient(120deg, #e0e8ff 30%, #6382ff 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                Vaultool
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', lineHeight: 1.65, margin: '0 0 1rem', maxWidth: '220px' }}>
              Encrypt &amp; decrypt <code style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--accent-bright)' }}>.env</code> files entirely in your browser. No server, no uploads.
            </p>
            {/* Project GitHub */}
            <FooterLink href={PROJECT.github}>
              <GitHubIcon size={14} />
              CodeWithAmruth/vault
              <ExternalLinkIcon />
            </FooterLink>
          </div>

          {/* Col 2 — Pages */}
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 0.75rem' }}>
              Pages
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
              <FooterLink href={`${PROJECT.live}/encrypt`}>🔒 Encrypt .env</FooterLink>
              <FooterLink href={`${PROJECT.live}/decrypt`}>🔓 Decrypt .envvault</FooterLink>
              <FooterLink href={PROJECT.sitemap} subtle>Sitemap</FooterLink>
            </div>
          </div>

          {/* Col 3 — Author */}
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 0.75rem' }}>
              Author
            </p>

            {/* Author card */}
            <div style={{
              background: 'rgba(99, 130, 255, 0.06)',
              border: '1px solid rgba(99, 130, 255, 0.15)',
              borderRadius: '10px',
              padding: '0.85rem',
              marginBottom: '0.75rem',
            }}>
              <p style={{ margin: '0 0 0.15rem', fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                {AUTHOR.name}
              </p>
              <p style={{ margin: '0 0 0.75rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Full-stack developer &amp; creator
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <FooterLink href={AUTHOR.portfolio}>
                  <PortfolioIcon /> Portfolio <ExternalLinkIcon />
                </FooterLink>
                <FooterLink href={AUTHOR.github}>
                  <GitHubIcon size={13} /> GitHub <ExternalLinkIcon />
                </FooterLink>
                <FooterLink href={AUTHOR.blog}>
                  <BlogIcon /> Blog — Techno Drishti <ExternalLinkIcon />
                </FooterLink>
              </div>
            </div>
          </div>

        </div>

        {/* ── Bottom bar ── */}
        <div style={{
          borderTop: '1px solid rgba(99,130,255,0.08)',
          paddingTop: '1.25rem',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '0.5rem',
        }}>
          <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            © {year} Vaultool · MIT License · Built with ❤️ by{' '}
            <a
              href={AUTHOR.portfolio}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--accent-bright)', textDecoration: 'none', fontWeight: 500 }}
            >
              {AUTHOR.name}
            </a>
          </p>
          <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            AES-256-GCM · PBKDF2 · 100% client-side
          </p>
        </div>

      </div>
    </footer>
  )
}

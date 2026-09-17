import { Link, useLocation } from 'react-router-dom'

const PROJECT_GITHUB = 'https://github.com/CodeWithAmruth/vault'

function LockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"
      strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  )
}

function EncryptIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  )
}

function DecryptIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
    </svg>
  )
}

function GitHubIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  )
}

export default function Nav() {
  const { pathname } = useLocation()

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      height: '64px',
      display: 'flex',
      alignItems: 'center',
      background: 'rgba(8, 11, 20, 0.75)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(99, 130, 255, 0.10)',
      boxShadow: '0 1px 0 rgba(99, 130, 255, 0.08)',
    }}>
      <div style={{ maxWidth: '1100px', width: '100%', margin: '0 auto', padding: '0 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

        {/* ── Brand ── */}
        <Link to="/encrypt" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          {/* Logo mark */}
          <div style={{
            width: '32px', height: '32px',
            background: 'linear-gradient(135deg, #6382ff 0%, #4a63d9 100%)',
            borderRadius: '8px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 0 14px rgba(99, 130, 255, 0.40)',
            flexShrink: 0,
          }}>
            <LockIcon />
          </div>

          {/* Brand name */}
          <span style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 700,
            fontSize: '1.15rem',
            letterSpacing: '-0.02em',
            background: 'linear-gradient(120deg, #e0e8ff 30%, #6382ff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Vaultool
          </span>
        </Link>

        {/* ── Nav links + GitHub ── */}
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <NavLink to="/encrypt" active={pathname === '/encrypt'} icon={<EncryptIcon />} label="Encrypt" />
          <NavLink to="/decrypt" active={pathname === '/decrypt'} icon={<DecryptIcon />} label="Decrypt" />

          {/* Divider */}
          <div style={{ width: '1px', height: '20px', background: 'rgba(99,130,255,0.15)', margin: '0 0.25rem' }} />

          {/* GitHub link */}
          <a
            id="nav-github"
            href={PROJECT_GITHUB}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View project on GitHub"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '34px',
              height: '34px',
              borderRadius: '8px',
              border: '1px solid rgba(99,130,255,0.18)',
              color: 'rgba(180,190,220,0.7)',
              textDecoration: 'none',
              transition: 'all 0.2s ease',
              background: 'transparent',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement
              el.style.background = 'rgba(99,130,255,0.12)'
              el.style.borderColor = 'rgba(99,130,255,0.40)'
              el.style.color = '#7c9aff'
              el.style.boxShadow = '0 0 10px rgba(99,130,255,0.2)'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement
              el.style.background = 'transparent'
              el.style.borderColor = 'rgba(99,130,255,0.18)'
              el.style.color = 'rgba(180,190,220,0.7)'
              el.style.boxShadow = 'none'
            }}
          >
            <GitHubIcon />
          </a>
        </div>

      </div>
    </nav>
  )
}

function NavLink({ to, active, icon, label }: {
  to: string
  active: boolean
  icon: React.ReactNode
  label: string
}) {
  return (
    <Link
      to={to}
      id={`nav-${label.toLowerCase()}`}
      aria-current={active ? 'page' : undefined}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.35rem',
        padding: '0.45rem 0.9rem',
        borderRadius: '8px',
        fontSize: '0.85rem',
        fontWeight: 500,
        textDecoration: 'none',
        transition: 'all 0.2s ease',
        ...(active ? {
          background: 'rgba(99, 130, 255, 0.15)',
          color: '#7c9aff',
          border: '1px solid rgba(99, 130, 255, 0.30)',
          boxShadow: '0 0 12px rgba(99, 130, 255, 0.15)',
        } : {
          background: 'transparent',
          color: 'rgba(180, 190, 220, 0.75)',
          border: '1px solid transparent',
        }),
      }}
    >
      {icon}
      {label}
    </Link>
  )
}
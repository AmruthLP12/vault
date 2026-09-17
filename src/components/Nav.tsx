import { Link, useLocation } from 'react-router-dom'

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

        {/* ── Nav links ── */}
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <NavLink to="/encrypt" active={pathname === '/encrypt'} icon={<EncryptIcon />} label="Encrypt" />
          <NavLink to="/decrypt" active={pathname === '/decrypt'} icon={<DecryptIcon />} label="Decrypt" />
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
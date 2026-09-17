import { useState } from 'react'
import { encryptEnv } from '../crypto/encryptEnv'

// ── Password strength ─────────────────────────────────────────────────────────
interface StrengthResult { score: 0|1|2|3|4; label: string; color: string; feedback: string[] }

function getPasswordStrength(password: string): StrengthResult {
  if (!password) return { score: 0, label: '', color: '', feedback: [] }
  const feedback: string[] = []
  let score = 0
  if (password.length >= 8)  score++; else feedback.push('At least 8 characters')
  if (password.length >= 16) score++
  if (/[A-Z]/.test(password)) score++; else feedback.push('Add uppercase letters')
  if (/[0-9]/.test(password)) score++; else feedback.push('Add numbers')
  if (/[^A-Za-z0-9]/.test(password)) score++; else feedback.push('Add special chars (!@#$…)')
  const s = Math.min(4, score) as 0|1|2|3|4
  const labels  = ['', 'Weak', 'Fair', 'Good', 'Strong']
  const colors  = ['', '#ef4444', '#f59e0b', '#3b82f6', '#22c55e']
  const classes = ['', 'strength-1', 'strength-2', 'strength-3', 'strength-4']
  return { score: s, label: labels[s], color: colors[s], feedback }
  void classes
}

function segClass(score: number): string {
  return ['', 'strength-1', 'strength-2', 'strength-3', 'strength-4'][score] ?? ''
}

// ── Icons ─────────────────────────────────────────────────────────────────────
function EyeIcon() {
  return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
}
function EyeOffIcon() {
  return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 4.411m0 0L21 21"/></svg>
}
function SpinnerIcon() {
  return <svg className="vt-spinner w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function EncryptPage() {
  const [envText, setEnvText]     = useState('')
  const [password, setPassword]   = useState('')
  const [showPwd, setShowPwd]     = useState(false)
  const [error, setError]         = useState('')
  const [success, setSuccess]     = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const strength  = getPasswordStrength(password)
  const lineCount = envText ? envText.split('\n').filter(l => l.trim() && !l.startsWith('#')).length : 0

  async function handleEncrypt() {
    setError(''); setSuccess(false)
    if (!envText || !password) { setError('Please enter env content and a password.'); return }
    if (strength.score < 2)    { setError('Password is too weak — ' + (strength.feedback[0] ?? 'use a stronger password.')); return }
    setIsLoading(true)
    try {
      const encrypted = await encryptEnv(envText, password)
      download(encrypted, 'secrets.envvault')
      setSuccess(true)
      setTimeout(() => setPassword(''), 100)
    } catch {
      setError('Encryption failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  function download(data: object, filename: string) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href = url; a.download = filename; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="vt-page">
      <div className="vt-page-inner">

        {/* ── Page heading ── */}
        <div style={{ marginBottom: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🔒</span>
            <h2 className="vt-heading">Encrypt .env</h2>
          </div>
          <p className="vt-subheading">
            Paste your environment variables, set a strong password, and download an encrypted vault.
          </p>
        </div>

        {/* ── Alerts ── */}
        {error && (
          <div className="vt-alert-error" role="alert" aria-live="polite">
            <span>❌</span><span>{error}</span>
          </div>
        )}
        {success && (
          <div className="vt-alert-success" role="status" aria-live="polite">
            <span>✅</span>
            <span><strong>secrets.envvault</strong> downloaded. Share the file and password separately.</span>
          </div>
        )}

        {/* ── Card ── */}
        <div className="glass-card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          {/* Env textarea */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label htmlFor="env-input" className="vt-label">Environment variables</label>
              {lineCount > 0 && (
                <span className="vt-badge">{lineCount} variable{lineCount !== 1 ? 's' : ''}</span>
              )}
            </div>
            <textarea
              id="env-input"
              rows={9}
              placeholder={"# Paste your .env content\nDATABASE_URL=postgres://user:pass@host/db\nAPI_KEY=sk-abc123\nSECRET_TOKEN=xyz789"}
              value={envText}
              onChange={e => setEnvText(e.target.value)}
              className="vt-input mono"
              style={{ resize: 'none', lineHeight: '1.6' }}
            />
          </div>

          <div className="vt-divider" />

          {/* Password field */}
          <div>
            <label htmlFor="password-input" className="vt-label">Encryption password</label>
            <div style={{ position: 'relative' }}>
              <input
                id="password-input"
                type={showPwd ? 'text' : 'password'}
                placeholder="Enter a strong password…"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleEncrypt()}
                className="vt-input"
                style={{ paddingRight: '2.75rem' }}
              />
              <button
                type="button"
                aria-label={showPwd ? 'Hide password' : 'Show password'}
                onClick={() => setShowPwd(p => !p)}
                style={{
                  position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--text-muted)', padding: '0.25rem',
                  display: 'flex', alignItems: 'center',
                  transition: 'color 0.2s',
                }}
              >
                {showPwd ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>

            {/* Strength bar */}
            {password && (
              <div style={{ marginTop: '0.6rem' }}>
                <div style={{ display: 'flex', gap: '4px', marginBottom: '0.35rem' }}>
                  {[1,2,3,4].map(i => (
                    <div key={i} className={i <= strength.score ? segClass(strength.score) : ''}
                      style={{
                        height: '4px', flex: 1, borderRadius: '999px',
                        background: i <= strength.score ? undefined : 'rgba(99,130,255,0.10)',
                        transition: 'background 0.3s ease',
                      }}
                    />
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {strength.feedback[0] ?? ''}
                  </span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: strength.color || 'var(--text-muted)' }}>
                    {strength.label}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Encrypt button */}
          <button
            id="encrypt-btn"
            className="vt-btn-primary"
            onClick={handleEncrypt}
            disabled={isLoading}
          >
            {isLoading ? <><SpinnerIcon /> Encrypting…</> : '🔒 Encrypt & Download'}
          </button>

        </div>

        {/* ── How it works hint ── */}
        <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '1.25rem', lineHeight: 1.6 }}>
          AES-256-GCM · PBKDF2 / 250k iterations · All crypto runs in your browser
        </p>

      </div>
    </div>
  )
}
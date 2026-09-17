import { useState, useEffect, useRef } from 'react'
import { decryptEnv } from '../crypto/decryptEnv'
import type { EnvVaultFileV1 } from '../crypto/types'

const AUTO_CLEAR = 60

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
export default function DecryptPage() {
  const [file, setFile]           = useState<File | null>(null)
  const [vaultMeta, setVaultMeta] = useState<EnvVaultFileV1 | null>(null)
  const [password, setPassword]   = useState('')
  const [showPwd, setShowPwd]     = useState(false)
  const [decrypted, setDecrypted] = useState('')
  const [error, setError]         = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [copied, setCopied]       = useState(false)
  const [dragging, setDragging]   = useState(false)
  const [seconds, setSeconds]     = useState(AUTO_CLEAR)

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // ── Auto-clear ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (!decrypted) return
    setSeconds(AUTO_CLEAR)
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => {
      setSeconds(s => {
        if (s <= 1) { clearDecrypted(); return AUTO_CLEAR }
        return s - 1
      })
    }, 1000)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [decrypted]) // eslint-disable-line react-hooks/exhaustive-deps

  function clearDecrypted() {
    if (intervalRef.current) clearInterval(intervalRef.current)
    setDecrypted(''); setPassword('')
  }

  // ── File load ────────────────────────────────────────────────────────────
  async function loadFile(f: File) {
    setFile(f); setDecrypted(''); setError(''); setVaultMeta(null)
    try {
      const parsed = JSON.parse(await f.text()) as EnvVaultFileV1
      if (parsed.format !== 'env-vault') throw new Error()
      setVaultMeta(parsed)
    } catch {
      setError('Invalid or corrupted .envvault file.')
    }
  }

  // ── Decrypt ──────────────────────────────────────────────────────────────
  async function handleDecrypt() {
    if (!file || !password) { setError('Upload a file and enter the password.'); return }
    if (!vaultMeta)          { setError('Invalid vault file.'); return }
    setError(''); setIsLoading(true)
    try {
      setDecrypted(await decryptEnv(vaultMeta, password))
    } catch {
      setError('Wrong password or corrupted file.')
    } finally {
      setIsLoading(false)
    }
  }

  // ── Copy ─────────────────────────────────────────────────────────────────
  async function copyToClipboard() {
    await navigator.clipboard.writeText(decrypted)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    setTimeout(() => navigator.clipboard.writeText(''), 30_000)
  }

  // ── Download .env ────────────────────────────────────────────────────────
  function downloadEnv() {
    const blob = new Blob([decrypted], { type: 'text/plain' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href = url; a.download = vaultMeta?.meta?.filename ?? '.env'; a.click()
    URL.revokeObjectURL(url)
  }

  // ── Drop zone class ──────────────────────────────────────────────────────
  function dzClass() {
    if (dragging) return 'vt-dropzone dragging'
    if (file && vaultMeta)  return 'vt-dropzone valid'
    if (file && !vaultMeta) return 'vt-dropzone invalid'
    return 'vt-dropzone'
  }

  return (
    <div className="vt-page">
      <div className="vt-page-inner">

        {/* ── Page heading ── */}
        <div style={{ marginBottom: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🔓</span>
            <h2 className="vt-heading">Decrypt .envvault</h2>
          </div>
          <p className="vt-subheading">
            Upload your encrypted vault file and enter the password to recover your secrets.
          </p>
        </div>

        {/* ── Error ── */}
        {error && (
          <div className="vt-alert-error" role="alert" aria-live="polite">
            <span>❌</span><span>{error}</span>
          </div>
        )}

        {/* ── Card ── */}
        <div className="glass-card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          {/* Drop zone */}
          <div>
            <label className="vt-label">Vault file</label>
            <div
              className={dzClass()}
              role="button"
              tabIndex={0}
              aria-label="Drop zone for .envvault file"
              onDragOver={e => { e.preventDefault(); setDragging(true) }}
              onDragLeave={() => setDragging(false)}
              onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) loadFile(f) }}
              onClick={() => document.getElementById('file-input')?.click()}
              onKeyDown={e => e.key === 'Enter' && document.getElementById('file-input')?.click()}
            >
              {file && vaultMeta ? (
                <>
                  <div style={{ fontSize: '1.75rem', marginBottom: '0.4rem' }}>✅</div>
                  <p style={{ margin: 0, fontWeight: 600, fontSize: '0.875rem', color: '#86efac' }}>{file.name}</p>
                  <p style={{ margin: '0.2rem 0 0', fontSize: '0.75rem', color: 'var(--text-muted)' }}>Click or drop to replace</p>
                </>
              ) : file && !vaultMeta ? (
                <>
                  <div style={{ fontSize: '1.75rem', marginBottom: '0.4rem' }}>⚠️</div>
                  <p style={{ margin: 0, fontWeight: 600, fontSize: '0.875rem', color: '#fca5a5' }}>{file.name}</p>
                  <p style={{ margin: '0.2rem 0 0', fontSize: '0.75rem', color: 'var(--text-muted)' }}>Not a valid vault file</p>
                </>
              ) : (
                <>
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem', opacity: 0.7 }}>🗂️</div>
                  <p style={{ margin: 0, fontWeight: 500, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    Drop your <code style={{ fontFamily: 'monospace', color: 'var(--accent-bright)' }}>.envvault</code> file here
                  </p>
                  <p style={{ margin: '0.3rem 0 0', fontSize: '0.75rem', color: 'var(--text-muted)' }}>or click to browse</p>
                </>
              )}
              <input id="file-input" type="file" accept=".envvault,application/json" className="hidden"
                onChange={e => { const f = e.target.files?.[0]; if (f) loadFile(f) }} />
            </div>
          </div>

          {/* Vault metadata preview */}
          {vaultMeta && (
            <div className="vt-meta-card">
              <p style={{ margin: '0 0 0.6rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                📄 Vault Info
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                {(
                  [
                    vaultMeta.meta?.filename  ? ['Filename',  vaultMeta.meta.filename]  : null,
                    vaultMeta.meta?.createdAt ? ['Created',   new Date(vaultMeta.meta.createdAt).toLocaleString()] : null,
                    vaultMeta.meta?.lineCount ? ['Variables', String(vaultMeta.meta.lineCount)] : null,
                    ['Cipher', `${vaultMeta.cipher.algorithm} · ${vaultMeta.cipher.keyLength}-bit`],
                    ['KDF',    `${vaultMeta.crypto.kdf} · ${vaultMeta.crypto.iterations.toLocaleString()} iterations`],
                  ] as ([string, string] | null)[]
                ).filter((r): r is [string, string] => r !== null).map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>{k}</span>
                    <span style={{ color: 'var(--text-secondary)', fontFamily: 'monospace', fontSize: '0.78rem' }}>{v}</span>
                  </div>
                ))}

              </div>
            </div>
          )}

          <div className="vt-divider" />

          {/* Password */}
          <div>
            <label htmlFor="decrypt-password" className="vt-label">Decryption password</label>
            <div style={{ position: 'relative' }}>
              <input
                id="decrypt-password"
                type={showPwd ? 'text' : 'password'}
                placeholder="Enter your password…"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleDecrypt()}
                className="vt-input"
                style={{ paddingRight: '2.75rem' }}
              />
              <button type="button" aria-label={showPwd ? 'Hide password' : 'Show password'}
                onClick={() => setShowPwd(p => !p)}
                style={{
                  position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)',
                  padding: '0.25rem', display: 'flex', alignItems: 'center', transition: 'color 0.2s',
                }}>
                {showPwd ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          {/* Decrypt button */}
          <button id="decrypt-btn" className="vt-btn-primary" onClick={handleDecrypt} disabled={isLoading}>
            {isLoading ? <><SpinnerIcon /> Decrypting…</> : '🔓 Decrypt'}
          </button>

        </div>

        {/* ── Decrypted result ── */}
        {decrypted && (
          <div className="glass-card" style={{ padding: '1.5rem', marginTop: '1.25rem' }}>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <label className="vt-label" style={{ margin: 0 }}>Decrypted content</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span className="vt-timer">⏱ {seconds}s</span>
                <button onClick={clearDecrypted}
                  aria-label="Clear decrypted content"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.72rem', color: 'var(--text-muted)', textDecoration: 'underline', padding: 0 }}>
                  Clear
                </button>
              </div>
            </div>

            {/* Progress ring via inline bar */}
            <div style={{ height: '2px', background: 'rgba(99,130,255,0.1)', borderRadius: '999px', marginBottom: '0.75rem', overflow: 'hidden' }}>
              <div style={{ height: '100%', borderRadius: '999px', background: 'var(--accent)', transition: 'width 1s linear', width: `${(seconds / AUTO_CLEAR) * 100}%` }} />
            </div>

            <textarea
              rows={8}
              value={decrypted}
              readOnly
              aria-label="Decrypted environment variables"
              className="vt-input mono"
              style={{ resize: 'none', lineHeight: '1.65', marginBottom: '0.875rem' }}
            />

            <div style={{ display: 'flex', gap: '0.625rem' }}>
              <button id="copy-btn" className="vt-btn-secondary" onClick={copyToClipboard}>
                {copied ? '✅ Copied!' : '📋 Copy'}
              </button>
              <button id="download-env-btn" className="vt-btn-success" onClick={downloadEnv}>
                ⬇ Download .env
              </button>
            </div>

            <p style={{ margin: '0.6rem 0 0', textAlign: 'center', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Clipboard auto-clears 30 seconds after copying
            </p>
          </div>
        )}

        <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '1.25rem' }}>
          All cryptography runs locally — your secrets never leave the browser
        </p>

      </div>
    </div>
  )
}
import { useState } from 'react'
import { encryptEnv } from '../crypto/encryptEnv'

// ── Password strength ─────────────────────────────────────────────────────────
interface StrengthResult {
  score: 0 | 1 | 2 | 3 | 4
  label: string
  color: string
  feedback: string[]
}

function getPasswordStrength(password: string): StrengthResult {
  if (!password) return { score: 0, label: '', color: '', feedback: [] }

  const feedback: string[] = []
  let score = 0

  if (password.length >= 8) score++
  else feedback.push('Use at least 8 characters')

  if (password.length >= 16) score++

  if (/[A-Z]/.test(password)) score++
  else feedback.push('Add uppercase letters')

  if (/[0-9]/.test(password)) score++
  else feedback.push('Add numbers')

  if (/[^A-Za-z0-9]/.test(password)) score++
  else feedback.push('Add special characters (!@#$…)')

  const capped = Math.min(4, score) as 0 | 1 | 2 | 3 | 4
  const labels: Record<number, string> = { 0: '', 1: 'Weak', 2: 'Fair', 3: 'Good', 4: 'Strong' }
  const colors: Record<number, string> = { 0: '', 1: '#ef4444', 2: '#f59e0b', 3: '#3b82f6', 4: '#22c55e' }

  return { score: capped, label: labels[capped], color: colors[capped], feedback }
}

function segmentColor(score: number): string {
  if (score === 1) return 'bg-red-500'
  if (score === 2) return 'bg-amber-400'
  if (score === 3) return 'bg-blue-500'
  return 'bg-green-500'
}

// ── SVG icons ─────────────────────────────────────────────────────────────────
function EyeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  )
}

function EyeOffIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 4.411m0 0L21 21" />
    </svg>
  )
}

function Spinner() {
  return (
    <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  )
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function EncryptPage() {
  const [envText, setEnvText]       = useState('')
  const [password, setPassword]     = useState('')
  const [showPassword, setShow]     = useState(false)
  const [error, setError]           = useState('')
  const [success, setSuccess]       = useState(false)
  const [isLoading, setIsLoading]   = useState(false)

  const strength   = getPasswordStrength(password)
  const lineCount  = envText ? envText.split('\n').filter(l => l.trim() && !l.startsWith('#')).length : 0

  async function handleEncrypt() {
    setError('')
    setSuccess(false)

    if (!envText || !password) {
      setError('Please enter env content and a password.')
      return
    }
    if (strength.score < 2) {
      setError('Password is too weak — ' + (strength.feedback[0] ?? 'use a stronger password.'))
      return
    }

    setIsLoading(true)
    try {
      const encrypted = await encryptEnv(envText, password)
      download(encrypted, 'secrets.envvault')
      setSuccess(true)
      // Zeroize password from state after successful encryption
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
    a.href     = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-8">

        <h2 className="text-3xl font-bold text-gray-900 mb-1">Encrypt .env</h2>
        <p className="text-gray-500 text-sm mb-6">
          Paste your environment variables, set a strong password, and download an encrypted vault.
        </p>

        {/* ── Alerts ── */}
        {error && (
          <div role="alert" aria-live="polite"
            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-5 text-sm flex items-start gap-2">
            <span>❌</span> <span>{error}</span>
          </div>
        )}
        {success && (
          <div role="status" aria-live="polite"
            className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-5 text-sm flex items-start gap-2">
            <span>✅</span>
            <span><strong>secrets.envvault</strong> has been downloaded. Store it safely and share the password separately.</span>
          </div>
        )}

        <div className="space-y-5">

          {/* ── Env textarea ── */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="env-input" className="text-sm font-medium text-gray-700">
                Environment variables
              </label>
              {lineCount > 0 && (
                <span className="text-xs text-gray-400">{lineCount} variable{lineCount !== 1 ? 's' : ''}</span>
              )}
            </div>
            <textarea
              id="env-input"
              rows={8}
              placeholder={"Paste .env content here\n\nExample:\nDATABASE_URL=postgres://...\nAPI_KEY=abc123\nSECRET_TOKEN=xyz789"}
              value={envText}
              onChange={e => setEnvText(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg font-mono text-sm
                focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none transition-colors"
            />
          </div>

          {/* ── Password field ── */}
          <div>
            <label htmlFor="password-input" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                id="password-input"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter a strong encryption password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleEncrypt()}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg
                  focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              />
              <button
                type="button"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                onClick={() => setShow(p => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>

            {/* ── Strength bar ── */}
            {password && (
              <div className="mt-2">
                <div className="flex gap-1 mb-1">
                  {[1, 2, 3, 4].map(i => (
                    <div
                      key={i}
                      className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                        i <= strength.score ? segmentColor(strength.score) : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">{strength.feedback[0] ?? ''}</span>
                  <span className="text-xs font-medium" style={{ color: strength.color || '#9ca3af' }}>
                    {strength.label}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* ── Encrypt button ── */}
          <button
            id="encrypt-btn"
            onClick={handleEncrypt}
            disabled={isLoading}
            className="w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg
              hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
              transition-all disabled:opacity-60 disabled:cursor-not-allowed
              flex items-center justify-center gap-2"
          >
            {isLoading ? <><Spinner /> Encrypting…</> : '🔒 Encrypt & Download'}
          </button>

        </div>
      </div>
    </div>
  )
}
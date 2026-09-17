import { useState, useEffect, useRef } from 'react'
import { decryptEnv } from '../crypto/decryptEnv'
import type { EnvVaultFileV1 } from '../crypto/types'

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
const AUTO_CLEAR_SECONDS = 60

export default function DecryptPage() {
  const [file, setFile]             = useState<File | null>(null)
  const [vaultMeta, setVaultMeta]   = useState<EnvVaultFileV1 | null>(null)
  const [password, setPassword]     = useState('')
  const [showPassword, setShow]     = useState(false)
  const [decrypted, setDecrypted]   = useState('')
  const [error, setError]           = useState('')
  const [isLoading, setIsLoading]   = useState(false)
  const [copied, setCopied]         = useState(false)
  const [dragging, setDragging]     = useState(false)
  const [secondsLeft, setSeconds]   = useState(AUTO_CLEAR_SECONDS)

  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // ── Auto-clear countdown ─────────────────────────────────────────────────
  useEffect(() => {
    if (!decrypted) return

    setSeconds(AUTO_CLEAR_SECONDS)
    if (countdownRef.current) clearInterval(countdownRef.current)

    countdownRef.current = setInterval(() => {
      setSeconds(s => {
        if (s <= 1) {
          clearDecrypted()
          return AUTO_CLEAR_SECONDS
        }
        return s - 1
      })
    }, 1000)

    return () => { if (countdownRef.current) clearInterval(countdownRef.current) }
  }, [decrypted]) // eslint-disable-line react-hooks/exhaustive-deps

  function clearDecrypted() {
    if (countdownRef.current) clearInterval(countdownRef.current)
    setDecrypted('')
    setPassword('')
  }

  // ── File loading ─────────────────────────────────────────────────────────
  async function loadFile(f: File) {
    setFile(f)
    setDecrypted('')
    setError('')
    setVaultMeta(null)

    try {
      const text   = await f.text()
      const parsed = JSON.parse(text) as EnvVaultFileV1
      if (parsed.format !== 'env-vault') throw new Error('Invalid format')
      setVaultMeta(parsed)
    } catch {
      setError('Invalid or corrupted .envvault file.')
    }
  }

  // ── Drag-and-drop ────────────────────────────────────────────────────────
  function handleDragOver(e: React.DragEvent) {
    e.preventDefault()
    setDragging(true)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) loadFile(f)
  }

  // ── Decrypt ──────────────────────────────────────────────────────────────
  async function handleDecrypt() {
    if (!file || !password) { setError('Upload a file and enter the password.'); return }
    if (!vaultMeta)         { setError('Invalid vault file.'); return }

    setError('')
    setIsLoading(true)
    try {
      const result = await decryptEnv(vaultMeta, password)
      setDecrypted(result)
    } catch {
      setError('Wrong password or corrupted file. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // ── Copy to clipboard ────────────────────────────────────────────────────
  async function copyToClipboard() {
    await navigator.clipboard.writeText(decrypted)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    // Auto-clear clipboard after 30 seconds
    setTimeout(() => navigator.clipboard.writeText(''), 30_000)
  }

  // ── Download .env ────────────────────────────────────────────────────────
  function downloadEnv() {
    const blob = new Blob([decrypted], { type: 'text/plain' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = vaultMeta?.meta?.filename ?? '.env'
    a.click()
    URL.revokeObjectURL(url)
  }

  // ── Drop zone appearance ─────────────────────────────────────────────────
  function dropZoneClass() {
    if (dragging) return 'border-blue-500 bg-blue-50'
    if (file && vaultMeta) return 'border-green-400 bg-green-50'
    if (file && !vaultMeta) return 'border-red-400 bg-red-50'
    return 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-8">

        <h2 className="text-3xl font-bold text-gray-900 mb-1">Decrypt .envvault</h2>
        <p className="text-gray-500 text-sm mb-6">
          Upload your encrypted vault and enter the password to recover your secrets.
        </p>

        {/* ── Error alert ── */}
        {error && (
          <div role="alert" aria-live="polite"
            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-5 text-sm flex items-start gap-2">
            <span>❌</span><span>{error}</span>
          </div>
        )}

        <div className="space-y-5">

          {/* ── Drag-and-drop zone ── */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload .envvault file
            </label>
            <div
              role="button"
              tabIndex={0}
              aria-label="Drop zone for .envvault file"
              onDragOver={handleDragOver}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => document.getElementById('file-input')?.click()}
              onKeyDown={e => e.key === 'Enter' && document.getElementById('file-input')?.click()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${dropZoneClass()}`}
            >
              {file && vaultMeta ? (
                <div>
                  <p className="text-green-700 font-medium text-sm">✅ {file.name}</p>
                  <p className="text-gray-400 text-xs mt-1">Click or drop to replace</p>
                </div>
              ) : file && !vaultMeta ? (
                <div>
                  <p className="text-red-600 font-medium text-sm">⚠️ {file.name}</p>
                  <p className="text-gray-400 text-xs mt-1">Not a valid vault file</p>
                </div>
              ) : (
                <div>
                  <div className="text-3xl mb-2">🗂️</div>
                  <p className="text-gray-600 text-sm font-medium">Drop your <span className="font-mono">.envvault</span> file here</p>
                  <p className="text-gray-400 text-xs mt-1">or click to browse</p>
                </div>
              )}
            </div>
            <input
              id="file-input"
              type="file"
              accept=".envvault,application/json"
              className="hidden"
              onChange={e => { const f = e.target.files?.[0]; if (f) loadFile(f) }}
            />
          </div>

          {/* ── Vault metadata preview ── */}
          {vaultMeta && (
            <div className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm space-y-1.5">
              <p className="font-semibold text-slate-700 mb-2">📄 Vault Information</p>
              {vaultMeta.meta?.filename && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Filename</span>
                  <span className="font-mono text-slate-800 text-xs">{vaultMeta.meta.filename}</span>
                </div>
              )}
              {vaultMeta.meta?.createdAt && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Created</span>
                  <span className="text-slate-800 text-xs">{new Date(vaultMeta.meta.createdAt).toLocaleString()}</span>
                </div>
              )}
              {vaultMeta.meta?.lineCount && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Variables</span>
                  <span className="text-slate-800">{vaultMeta.meta.lineCount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-500">Cipher</span>
                <span className="text-slate-800 text-xs">{vaultMeta.cipher.algorithm} · {vaultMeta.cipher.keyLength}-bit</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">KDF</span>
                <span className="text-slate-800 text-xs">{vaultMeta.crypto.kdf} · {vaultMeta.crypto.iterations.toLocaleString()} iterations</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Format version</span>
                <span className="text-slate-800">{vaultMeta.version}</span>
              </div>
            </div>
          )}

          {/* ── Password field ── */}
          <div>
            <label htmlFor="decrypt-password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                id="decrypt-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter decryption password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleDecrypt()}
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
          </div>

          {/* ── Decrypt button ── */}
          <button
            id="decrypt-btn"
            onClick={handleDecrypt}
            disabled={isLoading}
            className="w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg
              hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
              transition-all disabled:opacity-60 disabled:cursor-not-allowed
              flex items-center justify-center gap-2"
          >
            {isLoading ? <><Spinner /> Decrypting…</> : '🔓 Decrypt'}
          </button>

        </div>

        {/* ── Decrypted result ── */}
        {decrypted && (
          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Decrypted content</label>
              <div className="flex items-center gap-3">
                <span className="text-xs text-amber-600 font-medium">
                  ⏱ Auto-clearing in {secondsLeft}s
                </span>
                <button
                  onClick={clearDecrypted}
                  aria-label="Clear decrypted content now"
                  className="text-xs text-gray-400 hover:text-red-500 transition-colors underline"
                >
                  Clear now
                </button>
              </div>
            </div>

            <textarea
              rows={8}
              value={decrypted}
              readOnly
              aria-label="Decrypted environment variables"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm
                focus:ring-2 focus:ring-blue-500 outline-none resize-none"
            />

            <div className="flex gap-3">
              <button
                id="copy-btn"
                onClick={copyToClipboard}
                className="flex-1 bg-slate-100 text-slate-700 font-semibold py-2.5 px-4 rounded-lg
                  hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-400
                  transition-all text-sm flex items-center justify-center gap-2"
              >
                {copied ? '✅ Copied!' : '📋 Copy'}
              </button>
              <button
                id="download-env-btn"
                onClick={downloadEnv}
                className="flex-1 bg-green-600 text-white font-semibold py-2.5 px-4 rounded-lg
                  hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500
                  transition-all text-sm flex items-center justify-center gap-2"
              >
                ⬇ Download .env
              </button>
            </div>

            <p className="text-xs text-gray-400 text-center">
              Clipboard is auto-cleared 30 seconds after copying.
            </p>
          </div>
        )}

      </div>
    </div>
  )
}
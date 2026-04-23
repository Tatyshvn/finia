'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

type Mode = 'login' | 'signup'

export default function LoginPage() {
  const router = useRouter()
  const [mode, setMode] = useState<Mode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    const supabase = createClient()

    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setError(
          error.message === 'Invalid login credentials'
            ? 'Correo o contraseña incorrectos'
            : error.message
        )
        setLoading(false)
        return
      }
      router.push('/')
      router.refresh()
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }
      setMessage('Revisa tu correo para confirmar tu cuenta.')
      setLoading(false)
    }
  }

  function switchMode(next: Mode) {
    setMode(next)
    setError(null)
    setMessage(null)
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <span className="text-4xl font-bold tracking-tight text-violet-700">finia</span>
          <p className="mt-2 text-sm text-neutral-400">Tu asesor financiero personal</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-8">
          <div className="flex bg-neutral-100 rounded-xl p-1 mb-6">
            <button
              type="button"
              onClick={() => switchMode('login')}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors ${
                mode === 'login'
                  ? 'bg-white text-violet-700 shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-600'
              }`}
            >
              Iniciar sesión
            </button>
            <button
              type="button"
              onClick={() => switchMode('signup')}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors ${
                mode === 'signup'
                  ? 'bg-white text-violet-700 shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-600'
              }`}
            >
              Crear cuenta
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-neutral-700">
                Correo electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="tu@correo.com"
                required
                className="px-4 py-3 rounded-xl border border-neutral-200 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-transparent transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-neutral-700">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="px-4 py-3 rounded-xl border border-neutral-200 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-transparent transition-all"
              />
            </div>

            {error && (
              <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {message && (
              <div className="px-4 py-3 rounded-xl bg-menta-light border border-menta">
                <p className="text-sm text-menta">{message}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="py-3 bg-violet-700 text-white text-sm font-semibold rounded-xl hover:bg-violet-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? 'Cargando...'
                : mode === 'signup'
                ? 'Crear cuenta'
                : 'Iniciar sesión'}
            </button>
          </form>

          {mode === 'signup' && !message && (
            <p className="mt-4 text-xs text-neutral-400 text-center">
              Al crear tu cuenta recibes 2 análisis gratuitos 🎉
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

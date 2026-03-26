import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button, Card } from '@/components/ui'

export function AuthScreen() {
  const [email,   setEmail]   = useState('')
  const [sent,    setSent]    = useState(false)
  const [error,   setError]   = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim() || !supabase) return
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { shouldCreateUser: true },
    })
    if (error) {
      setError(error.message)
    } else {
      setSent(true)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-parchment flex items-center justify-center p-6">
      <Card className="w-full max-w-sm text-center">
        <h1 className="font-heading text-3xl font-bold italic text-ink mb-2">
          Mundo Interior
        </h1>

        {sent ? (
          <div className="flex flex-col gap-3">
            <p className="text-ink/60 text-sm">
              Link enviado para <strong className="text-ink">{email}</strong>.
            </p>
            <p className="text-ink/40 text-xs">
              Verifique sua caixa de entrada e clique no link para entrar.
            </p>
            <button
              className="text-xs text-ink/40 underline hover:text-ink/60 mt-2"
              onClick={() => { setSent(false); setError(null) }}
            >
              Usar outro e-mail
            </button>
          </div>
        ) : (
          <>
            <p className="text-ink/60 text-sm mb-6">
              Entre com seu e-mail para continuar a aventura.
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                autoFocus
                className="w-full px-3 py-2 rounded-card border border-parchment-dark
                           bg-parchment text-ink placeholder:text-ink/30
                           focus:outline-none focus:ring-2 focus:ring-gold"
              />
              {error && (
                <p className="text-red-500 text-xs text-left">{error}</p>
              )}
              <Button
                type="submit"
                variant="gold"
                className="w-full"
                disabled={!email.trim() || loading}
              >
                {loading ? 'Enviando...' : 'Enviar link mágico'}
              </Button>
            </form>
          </>
        )}
      </Card>
    </div>
  )
}

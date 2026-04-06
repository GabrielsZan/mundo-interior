import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button, Card } from '@/components/ui'

type Step = 'email' | 'code'

export function AuthScreen() {
  const [email,   setEmail]   = useState('')
  const [code,    setCode]    = useState('')
  const [step,    setStep]    = useState<Step>('email')
  const [error,   setError]   = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSendCode(e: React.FormEvent) {
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
      setStep('code')
    }
    setLoading(false)
  }

  async function handleVerifyCode(e: React.FormEvent) {
    e.preventDefault()
    if (!code.trim() || !supabase) return
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.verifyOtp({
      email: email.trim(),
      token: code.trim(),
      type: 'email',
    })
    if (error) {
      setError('Código inválido ou expirado. Tente novamente.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-parchment flex items-center justify-center p-6">
      <Card className="w-full max-w-sm text-center">
        <h1 className="font-heading text-3xl font-bold italic text-ink mb-2">
          Mundo Interior
        </h1>

        {step === 'email' ? (
          <>
            <p className="text-ink/60 text-sm mb-6">
              Entre com seu e-mail para continuar a aventura.
            </p>
            <form onSubmit={handleSendCode} className="flex flex-col gap-3">
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
                {loading ? 'Enviando...' : 'Enviar código'}
              </Button>
            </form>
          </>
        ) : (
          <>
            <p className="text-ink/60 text-sm mb-1">
              Código enviado para <strong className="text-ink">{email}</strong>.
            </p>
            <p className="text-ink/40 text-xs mb-6">
              Verifique sua caixa de entrada e digite o código de 6 dígitos.
            </p>
            <form onSubmit={handleVerifyCode} className="flex flex-col gap-3">
              <input
                type="text"
                inputMode="numeric"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                autoFocus
                maxLength={6}
                className="w-full px-3 py-3 rounded-card border border-parchment-dark
                           bg-parchment text-ink placeholder:text-ink/30 text-center
                           text-2xl tracking-widest font-mono
                           focus:outline-none focus:ring-2 focus:ring-gold"
              />
              {error && (
                <p className="text-red-500 text-xs text-left">{error}</p>
              )}
              <Button
                type="submit"
                variant="gold"
                className="w-full"
                disabled={code.length < 6 || loading}
              >
                {loading ? 'Verificando...' : 'Entrar'}
              </Button>
              <button
                type="button"
                className="text-xs text-ink/40 underline hover:text-ink/60"
                onClick={() => { setStep('email'); setCode(''); setError(null) }}
              >
                Usar outro e-mail
              </button>
            </form>
          </>
        )}
      </Card>
    </div>
  )
}

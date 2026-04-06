import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button, Card } from '@/components/ui'

type Mode = 'login' | 'register'

export function AuthScreen() {
  const [mode,     setMode]     = useState<Mode>('login')
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState<string | null>(null)
  const [loading,  setLoading]  = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim() || !password.trim() || !supabase) return
    setLoading(true)
    setError(null)

    if (mode === 'register') {
      const { error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password.trim(),
        options: { emailRedirectTo: undefined },
      })
      if (error) setError(translateError(error.message))
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      })
      if (error) setError(translateError(error.message))
    }

    setLoading(false)
  }

  function translateError(msg: string): string {
    if (msg.includes('Invalid login credentials')) return 'E-mail ou senha incorretos.'
    if (msg.includes('User already registered')) return 'E-mail já cadastrado. Faça login.'
    if (msg.includes('Password should be at least')) return 'A senha precisa ter pelo menos 6 caracteres.'
    if (msg.includes('rate limit')) return 'Muitas tentativas. Aguarde alguns minutos.'
    return msg
  }

  return (
    <div className="min-h-screen bg-parchment flex items-center justify-center p-6">
      <Card className="w-full max-w-sm text-center">
        <h1 className="font-heading text-3xl font-bold italic text-ink mb-2">
          Mundo Interior
        </h1>
        <p className="text-ink/60 text-sm mb-6">
          {mode === 'login' ? 'Entre para continuar sua aventura.' : 'Crie sua conta para começar.'}
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
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Senha (mín. 6 caracteres)"
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
            disabled={!email.trim() || password.length < 6 || loading}
          >
            {loading ? 'Aguarde...' : mode === 'login' ? 'Entrar' : 'Criar conta'}
          </Button>
        </form>

        <button
          type="button"
          className="text-xs text-ink/40 underline hover:text-ink/60 mt-4"
          onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(null) }}
        >
          {mode === 'login' ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Faça login'}
        </button>
      </Card>
    </div>
  )
}

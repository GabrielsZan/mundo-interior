import { usePlayerStore } from '@/stores/playerStore'
import { Button, Card, XPBar, DomainBadge } from '@/components/ui'
import { useXP } from '@/hooks/useXP'

function SetupScreen() {
  const initPlayer = usePlayerStore((s) => s.initPlayer)

  function handleStart() {
    const name = (document.getElementById('player-name') as HTMLInputElement)?.value.trim()
    if (name) initPlayer(name)
  }

  return (
    <div className="min-h-screen bg-parchment flex items-center justify-center p-6">
      <Card className="w-full max-w-sm text-center">
        <h1 className="font-heading text-3xl font-bold italic text-ink mb-2">
          Mundo Interior
        </h1>
        <p className="text-ink/60 text-sm mb-6">
          Sua jornada de desenvolvimento pessoal começa aqui.
        </p>
        <input
          id="player-name"
          type="text"
          placeholder="Seu nome de aventureiro"
          className="w-full px-3 py-2 rounded-card border border-parchment-dark
                     bg-parchment text-ink placeholder:text-ink/30
                     focus:outline-none focus:ring-2 focus:ring-gold mb-4"
        />
        <Button variant="gold" className="w-full" onClick={handleStart}>
          Começar Aventura
        </Button>
      </Card>
    </div>
  )
}

function Dashboard() {
  const player = usePlayerStore((s) => s.player)!
  const xp     = useXP()!

  return (
    <div className="min-h-screen bg-parchment p-6">
      <header className="max-w-2xl mx-auto mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-2xl italic font-bold text-ink">
              Olá, {player.name}
            </h1>
            <p className="text-ink/50 text-sm font-mono">Nível {player.level}</p>
          </div>
          <span className="xp-chip">+{xp.current} XP</span>
        </div>

        <div className="mt-4">
          <XPBar current={xp.current} needed={xp.needed} percent={xp.percent} />
        </div>
      </header>

      <main className="max-w-2xl mx-auto">
        <section className="mb-6">
          <h2 className="font-heading text-lg italic font-semibold text-ink mb-3">
            Domínios
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {(['mind', 'body', 'soul', 'creation'] as const).map((d) => (
              <Card key={d} hoverable className="flex items-center justify-between">
                <DomainBadge domain={d} />
                <span className="font-mono text-xs text-ink/50">
                  {player.domainXP[d]} XP
                </span>
              </Card>
            ))}
          </div>
        </section>

        <Card className="text-center text-ink/40 py-10 text-sm">
          Missões, habilidades e mapa serão implementados na Fase 1. ✨
        </Card>
      </main>
    </div>
  )
}

export default function App() {
  const player = usePlayerStore((s) => s.player)
  return player ? <Dashboard /> : <SetupScreen />
}

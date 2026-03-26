import { useState, useEffect, useRef } from 'react'
import { usePlayerStore } from '@/stores/playerStore'
import { useMissionStore } from '@/stores/missionStore'
import { Button, Card, XPBar, DomainBadge } from '@/components/ui'
import { MissionList } from '@/features/missions'
import { AuthScreen } from '@/features/auth/AuthScreen'
import { useXP } from '@/hooks/useXP'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import styles from '@/features/missions/missions.module.css'

// ── Setup ─────────────────────────────────────────────────────────────────────

function SetupScreen({ userId }: { userId?: string }) {
  const initPlayer = usePlayerStore((s) => s.initPlayer)
  const [name, setName] = useState('')

  function handleStart(e: React.FormEvent) {
    e.preventDefault()
    if (name.trim()) initPlayer(name.trim(), userId)
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
        <form onSubmit={handleStart} className="flex flex-col gap-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Seu nome de aventureiro"
            autoFocus
            className="w-full px-3 py-2 rounded-card border border-parchment-dark
                       bg-parchment text-ink placeholder:text-ink/30
                       focus:outline-none focus:ring-2 focus:ring-gold"
          />
          <Button type="submit" variant="gold" className="w-full" disabled={!name.trim()}>
            Começar Aventura
          </Button>
        </form>
      </Card>
    </div>
  )
}

// ── Dashboard ─────────────────────────────────────────────────────────────────

function Dashboard() {
  const player          = usePlayerStore((s) => s.player)!
  const xp              = useXP()!
  const checkDailyReset = useMissionStore((s) => s.checkDailyReset)
  const setPlayerId     = useMissionStore((s) => s.setPlayerId)

  const prevLevel       = useRef(player.level)
  const [levelUp, setLevelUp] = useState(false)

  // Ensure mission store knows the player id (needed for new players after setup)
  useEffect(() => { setPlayerId(player.id) }, [player.id, setPlayerId])

  // Auto-reset dailies if it's a new day
  useEffect(() => { checkDailyReset() }, [checkDailyReset])

  useEffect(() => {
    if (player.level > prevLevel.current) {
      setLevelUp(true)
      prevLevel.current = player.level
      setTimeout(() => setLevelUp(false), 600)
    }
  }, [player.level])

  return (
    <div className="min-h-screen bg-parchment pb-12">
      {/* Header */}
      <header className="bg-white border-b border-parchment-dark px-6 py-4 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-xl italic font-bold text-ink leading-tight">
              {player.name}
            </h1>
            <p className={`text-ink/50 text-xs font-mono ${levelUp ? styles.levelUpBurst : ''}`}>
              Nível {player.level}
            </p>
          </div>

          <div className="flex-1 max-w-[200px]">
            <XPBar current={xp.current} needed={xp.needed} percent={xp.percent} />
          </div>

          <span className="xp-chip shrink-0">{xp.current}/{xp.needed}</span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 pt-6 flex flex-col gap-6">
        {/* Domain XP grid */}
        <section>
          <h2 className="font-heading text-lg italic font-semibold text-ink mb-3">Domínios</h2>
          <div className="grid grid-cols-2 gap-3">
            {(['mind', 'body', 'soul', 'creation'] as const).map((d) => (
              <Card key={d} hoverable className="flex items-center justify-between !py-3">
                <DomainBadge domain={d} />
                <span className="font-mono text-xs text-ink/50">
                  {player.domainXP[d]} XP
                </span>
              </Card>
            ))}
          </div>
        </section>

        {/* Missions */}
        <MissionList />
      </main>
    </div>
  )
}

// ── Root ──────────────────────────────────────────────────────────────────────

type AuthStatus = 'loading' | 'unauthenticated' | 'authenticated'

export default function App() {
  const player       = usePlayerStore((s) => s.player)
  const loadFromDb   = usePlayerStore((s) => s.loadFromDb)
  const loadMissions = useMissionStore((s) => s.loadFromDb)

  const [authStatus, setAuthStatus] = useState<AuthStatus>(
    isSupabaseConfigured ? 'loading' : 'authenticated'
  )
  const [userId, setUserId] = useState<string | undefined>()

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return

    async function handleSession(uid: string) {
      setUserId(uid)
      const result = await loadFromDb(uid)
      if (result === 'loaded') {
        const playerId = usePlayerStore.getState().player?.id
        if (playerId) await loadMissions(playerId)
      }
      setAuthStatus('authenticated')
    }

    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        handleSession(data.session.user.id)
      } else {
        setAuthStatus('unauthenticated')
      }
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        handleSession(session.user.id)
      } else {
        setAuthStatus('unauthenticated')
      }
    })

    return () => listener.subscription.unsubscribe()
  }, [loadFromDb, loadMissions])

  if (authStatus === 'loading') {
    return (
      <div className="min-h-screen bg-parchment flex items-center justify-center">
        <p className="text-ink/30 font-body text-sm">Carregando...</p>
      </div>
    )
  }

  if (authStatus === 'unauthenticated') return <AuthScreen />

  return player ? <Dashboard /> : <SetupScreen userId={userId} />
}

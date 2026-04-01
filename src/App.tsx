import { useState, useEffect, useRef } from 'react'
import { usePlayerStore } from '@/stores/playerStore'
import { useMissionStore } from '@/stores/missionStore'
import { useSkillStore } from '@/stores/skillStore'
import { Button, Card, XPBar, DomainBadge } from '@/components/ui'
import { MissionList } from '@/features/missions'
import { SkillTreePage } from '@/features/skill-tree'
import { MapPage } from '@/features/map'
import { InventoryPage } from '@/features/inventory'
import { JournalPage } from '@/features/journal'
import { CitadelPage } from '@/features/citadel'
import { OnboardingFlow } from '@/features/onboarding'
import { AuthScreen } from '@/features/auth/AuthScreen'
import { useXP } from '@/hooks/useXP'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { useEventStore } from '@/stores/eventStore'
import { useInventoryStore } from '@/stores/inventoryStore'
import { useJournalStore } from '@/stores/journalStore'
import { useMapStore } from '@/stores/mapStore'
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

interface DashboardProps {
  onOpenCitadel: () => void
}

function Dashboard({ onOpenCitadel }: DashboardProps) {
  const player                  = usePlayerStore((s) => s.player)!
  const xp                      = useXP()!
  const checkDailyReset         = useMissionStore((s) => s.checkDailyReset)
  const setMissionPlayerId      = useMissionStore((s) => s.setPlayerId)
  const setInventoryPlayerId    = useInventoryStore((s) => s.setPlayerId)
  const setJournalPlayerId      = useJournalStore((s) => s.setPlayerId)
  const checkNewWeek            = useEventStore((s) => s.checkNewWeek)

  const prevLevel       = useRef(player.level)
  const [levelUp, setLevelUp] = useState(false)

  useEffect(() => {
    setMissionPlayerId(player.id)
    setInventoryPlayerId(player.id)
    setJournalPlayerId(player.id)
  }, [player.id, setMissionPlayerId, setInventoryPlayerId, setJournalPlayerId])
  useEffect(() => { checkDailyReset() }, [checkDailyReset])
  useEffect(() => { checkNewWeek() }, [checkNewWeek])

  useEffect(() => {
    if (player.level > prevLevel.current) {
      setLevelUp(true)
      prevLevel.current = player.level
      setTimeout(() => setLevelUp(false), 600)
    }
  }, [player.level])

  return (
    <div className="min-h-screen bg-parchment pb-24">
      {/* Header */}
      <header className="bg-white border-b border-parchment-dark px-6 py-4 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
          <button
            onClick={onOpenCitadel}
            className="text-left hover:opacity-70 transition-opacity"
          >
            <h1 className="font-heading text-xl italic font-bold text-ink leading-tight">
              {player.name}
            </h1>
            <p className={`text-ink/50 text-xs font-mono ${levelUp ? styles.levelUpBurst : ''}`}>
              Nível {player.level}
            </p>
          </button>

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

// ── Bottom Nav ────────────────────────────────────────────────────────────────

type View = 'dashboard' | 'skills' | 'map' | 'inventory' | 'journal' | 'citadel'

const NAV_ITEMS: { view: View; label: string; icon: string }[] = [
  { view: 'dashboard', label: 'Missões',      icon: '📋' },
  { view: 'skills',    label: 'Habilidades',  icon: '🌳' },
  { view: 'map',       label: 'Mapa',         icon: '🗺️' },
  { view: 'inventory', label: 'Inventário',   icon: '🎒' },
  { view: 'journal',   label: 'Diário',       icon: '📖' },
]

function BottomNav({ view, setView }: { view: View; setView: (v: View) => void }) {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-20 bg-white border-t border-parchment-dark">
      <div className="max-w-2xl mx-auto flex">
        {NAV_ITEMS.map(({ view: v, label, icon }) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`
              flex-1 flex flex-col items-center gap-0.5 py-3 text-xs font-semibold transition-colors
              ${view === v ? 'text-ink' : 'text-ink/30 hover:text-ink/60'}
            `}
          >
            <span className="text-lg leading-none">{icon}</span>
            <span>{label}</span>
          </button>
        ))}
      </div>
    </nav>
  )
}

// ── Root ──────────────────────────────────────────────────────────────────────

type AuthStatus = 'loading' | 'unauthenticated' | 'authenticated'

export default function App() {
  const player          = usePlayerStore((s) => s.player)
  const loadFromDb      = usePlayerStore((s) => s.loadFromDb)
  const loadMissions    = useMissionStore((s) => s.loadFromDb)
  const loadSkills      = useSkillStore((s) => s.loadFromDb)
  const initSkills      = useSkillStore((s) => s.initSkills)
  const loadInventory   = useInventoryStore((s) => s.loadFromDb)
  const loadJournal     = useJournalStore((s) => s.loadFromDb)
  const loadMapState    = useMapStore((s) => s.loadFromDb)
  const loadEventState  = useEventStore((s) => s.loadFromDb)

  const [authStatus, setAuthStatus] = useState<AuthStatus>(
    isSupabaseConfigured ? 'loading' : 'authenticated'
  )
  const [userId,    setUserId]    = useState<string | undefined>()
  const [view,      setView]      = useState<View>('dashboard')
  const [prevView,  setPrevView]  = useState<View>('dashboard')

  function openCitadel(from: View) {
    setPrevView(from)
    setView('citadel')
  }

  async function handleLogout() {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut()
    } else {
      // local mode: just reset player so setup screen appears
      usePlayerStore.getState().resetPlayer()
    }
  }

  async function handleDeleteData() {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut()
    }
    localStorage.clear()
    window.location.reload()
  }

  // Init skills from seed on local mode (runs once)
  useEffect(() => {
    if (!isSupabaseConfigured) initSkills()
  }, [initSkills])

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return

    async function handleSession(uid: string) {
      setUserId(uid)
      const result = await loadFromDb(uid)
      if (result === 'loaded') {
        const playerId = usePlayerStore.getState().player?.id
        if (playerId) {
          await Promise.all([
            loadMissions(playerId),
            loadSkills(playerId),
            loadInventory(playerId),
            loadJournal(playerId),
            loadMapState(playerId),
            loadEventState(playerId),
          ])
        }
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
  }, [loadFromDb, loadMissions, loadSkills, loadInventory, loadJournal, loadMapState, loadEventState])

  if (authStatus === 'loading') {
    return (
      <div className="min-h-screen bg-parchment flex items-center justify-center">
        <p className="text-ink/30 font-body text-sm">Carregando...</p>
      </div>
    )
  }

  if (authStatus === 'unauthenticated') return <AuthScreen />

  if (!player) return <SetupScreen userId={userId} />

  if (!player.hasCompletedOnboarding) return <OnboardingFlow />

  return (
    <>
      {view === 'dashboard' && <Dashboard onOpenCitadel={() => openCitadel('dashboard')} />}
      {view === 'skills'    && <SkillTreePage />}
      {view === 'map'       && <MapPage onOpenCitadel={() => openCitadel('map')} />}
      {view === 'inventory' && <InventoryPage />}
      {view === 'journal'   && <JournalPage />}
      {view === 'citadel'   && (
        <CitadelPage
          onBack={() => setView(prevView)}
          onLogout={handleLogout}
          onDeleteData={handleDeleteData}
        />
      )}
      {view !== 'citadel' && <BottomNav view={view} setView={setView} />}
    </>
  )
}

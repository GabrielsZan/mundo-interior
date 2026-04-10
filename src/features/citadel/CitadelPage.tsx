import { useState } from 'react'
import { usePlayerStore } from '@/stores/playerStore'
import { useMissionStore } from '@/stores/missionStore'
import { useSkillStore } from '@/stores/skillStore'
import { useInventoryStore } from '@/stores/inventoryStore'
import { useMapStore } from '@/stores/mapStore'
import { useEventStore } from '@/stores/eventStore'
import { getCurrentWeekEvent } from '@/lib/weeklyEvents'

// ── NPC data ──────────────────────────────────────────────────────────────────

interface NPC {
  domain:   'mente' | 'corpo' | 'alma' | 'criacao'
  name:     string
  title:    string
  avatar:   string
  color:    string
  dialogues: { low: string; mid: string; high: string }
}

const NPCS: NPC[] = [
  {
    domain: 'mente',
    name: 'Mestra Lyra',
    title: 'Guardiã do Conhecimento',
    avatar: '🦉',
    color: '#5B8C5A',
    dialogues: {
      low:  'O conhecimento começa com uma única pergunta, jovem explorador.',
      mid:  'Sua mente já atravessou muitos labirintos. Continue questionando.',
      high: 'Raramente vejo tal clareza mental. Você transcende o ordinário.',
    },
  },
  {
    domain: 'corpo',
    name: 'Guerreiro Kaito',
    title: 'Mestre da Forja Interior',
    avatar: '⚔️',
    color: '#C67B5C',
    dialogues: {
      low:  'Cada passo, por menor que seja, fortalece o guerreiro que você está se tornando.',
      mid:  'Seu corpo é um templo em construção. Os alicerces já estão firmes.',
      high: 'Poucos alcançam tal disciplina. Você é a própria força que buscava.',
    },
  },
  {
    domain: 'alma',
    name: 'Oráculo Serafim',
    title: 'Voz dos Mundos Ocultos',
    avatar: '🌙',
    color: '#6BA3B7',
    dialogues: {
      low:  'A alma sussurra antes de gritar. Aprenda a ouvir o silêncio entre os pensamentos.',
      mid:  'Seu espírito cresceu além das fronteiras do que você conhecia de si mesmo.',
      high: 'A harmonia que você carrega ilumina tudo ao seu redor, mesmo sem perceber.',
    },
  },
  {
    domain: 'criacao',
    name: 'Artesã Phaedra',
    title: 'Tecelã de Possibilidades',
    avatar: '🎨',
    color: '#B8976A',
    dialogues: {
      low:  'Todo mestre foi um dia aprendiz. A primeira criação já reside dentro de você.',
      mid:  'Suas mãos moldam realidades. A criatividade flui sem hesitar.',
      high: 'O que você cria transforma não só a matéria, mas as almas ao redor.',
    },
  },
]

function getNPCDialogue(npc: NPC, domainXP: number): string {
  if (domainXP >= 500) return npc.dialogues.high
  if (domainXP >= 150) return npc.dialogues.mid
  return npc.dialogues.low
}

// ── Sub-components ────────────────────────────────────────────────────────────

function NPCCard({ npc, domainXP }: { npc: NPC; domainXP: number }) {
  const dialogue = getNPCDialogue(npc, domainXP)
  const [expanded, setExpanded] = useState(false)

  return (
    <button
      onClick={() => setExpanded((v) => !v)}
      className="w-full text-left p-4 rounded-2xl transition-all"
      style={{
        background: `${npc.color}12`,
        border: `1.5px solid ${npc.color}30`,
      }}
    >
      <div className="flex items-center gap-3 mb-2">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-xl shrink-0"
          style={{ background: `${npc.color}22`, border: `2px solid ${npc.color}50` }}
        >
          {npc.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-heading font-semibold italic text-ink text-sm leading-tight">{npc.name}</p>
          <p className="text-xs font-body" style={{ color: npc.color }}>{npc.title}</p>
        </div>
        <span className="text-ink/25 text-xs">{expanded ? '▲' : '▼'}</span>
      </div>
      {expanded && (
        <p className="text-sm font-body italic text-ink/60 leading-relaxed border-t pt-2 mt-1" style={{ borderColor: `${npc.color}25` }}>
          "{dialogue}"
        </p>
      )}
    </button>
  )
}

function WeeklyEventCard() {
  const progress      = useEventStore((s) => s.progress)
  const rewardClaimed = useEventStore((s) => s.rewardClaimed)
  const claimReward   = useEventStore((s) => s.claimReward)

  const event    = getCurrentWeekEvent()
  const pct      = Math.min(100, Math.round((progress / event.requirement) * 100))
  const done     = progress >= event.requirement
  const [flash, setFlash] = useState(false)

  const DOMAIN_COLOR: Record<string, string> = {
    mente:   '#5B8C5A',
    corpo:   '#C67B5C',
    alma:    '#6BA3B7',
    criacao: '#B8976A',
    todas:   '#D4A843',
  }
  const color = DOMAIN_COLOR[event.domain] ?? '#D4A843'

  function handleClaim() {
    const item = claimReward()
    if (item) {
      setFlash(true)
      setTimeout(() => setFlash(false), 1500)
    }
  }

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ border: `1.5px solid ${color}40`, background: `${color}0D` }}
    >
      {/* Header bar */}
      <div className="h-1" style={{ background: color }} />

      <div className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-2xl">{event.icon}</span>
          <div>
            <p className="font-heading font-bold italic text-ink text-sm">{event.name}</p>
            <p className="text-xs font-body text-ink/50">
              Semana atual · {progress}/{event.requirement} missões
            </p>
          </div>
        </div>

        <p className="text-sm font-body text-ink/60 leading-relaxed mb-3">
          {event.description}
        </p>

        {/* Progress bar */}
        <div className="h-2 rounded-full mb-3" style={{ background: `${color}25` }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${pct}%`, background: color }}
          />
        </div>

        {/* Reward preview */}
        <div
          className="flex items-center gap-2 p-2 rounded-xl mb-3"
          style={{ background: `${color}15`, border: `1px solid ${color}25` }}
        >
          <span className="text-xl">{event.rewardIcon}</span>
          <div>
            <p className="text-xs font-semibold text-ink">{event.rewardName}</p>
            <p className="text-xs font-body text-ink/40">{event.rewardDesc}</p>
          </div>
          <span className="ml-auto font-mono text-xs" style={{ color }}>
            +{event.xpBonus} XP
          </span>
        </div>

        {/* Claim button */}
        {!rewardClaimed ? (
          <button
            disabled={!done}
            onClick={handleClaim}
            className="w-full py-2 rounded-xl text-sm font-semibold transition-opacity"
            style={{
              background: done ? color : `${color}40`,
              color: done ? '#FBF6F0' : `${color}80`,
              cursor: done ? 'pointer' : 'default',
              opacity: flash ? 0.6 : 1,
            }}
          >
            {flash ? '✨ Recompensa recebida!' : done ? '🎁 Reivindicar Recompensa' : `${pct}% concluído`}
          </button>
        ) : (
          <div
            className="w-full py-2 rounded-xl text-sm font-semibold text-center"
            style={{ background: `${color}20`, color }}
          >
            ✓ Recompensa reivindicada esta semana
          </div>
        )}
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────

interface CitadelPageProps {
  onBack:        () => void
  onLogout:      () => void
  onDeleteData:  () => void
}

export function CitadelPage({ onBack, onLogout, onDeleteData }: CitadelPageProps) {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const player       = usePlayerStore((s) => s.player)!
  const missions     = useMissionStore((s) => s.missions)
  const skills       = useSkillStore((s) => s.skills)
  const items        = useInventoryStore((s) => s.items)
  const revealedPois = useMapStore((s) => s.revealedPois)

  const completedMissions = missions.filter((m) => m.isCompleted).length
  const unlockedSkills    = skills.filter((sk) => sk.isUnlocked).length
  const exploredPOIs      = revealedPois.length

  const domainXP = {
    mente:   player.domainXP.mind,
    corpo:   player.domainXP.body,
    alma:    player.domainXP.soul,
    criacao: player.domainXP.creation,
  }

  const totalXP = player.totalXPEarned ?? Object.values(player.domainXP).reduce((a, b) => a + b, 0)

  return (
    <div className="min-h-screen bg-parchment pb-8">
      {/* Header */}
      <header className="bg-white border-b border-parchment-dark px-4 py-4 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-full flex items-center justify-center text-ink/40 hover:text-ink hover:bg-parchment transition-colors"
          >
            ←
          </button>
          <div>
            <h1 className="font-heading text-xl italic font-bold text-ink leading-tight">
              🏰 A Cidadela Interior
            </h1>
            <p className="text-ink/40 text-xs font-body">Sua fortaleza de desenvolvimento pessoal</p>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 pt-5 flex flex-col gap-5">

        {/* Player Profile */}
        <div
          className="rounded-2xl p-5"
          style={{ background: 'linear-gradient(135deg, #FBF6F0 0%, #F0E8D8 100%)', border: '1.5px solid #D4A84340' }}
        >
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
              style={{ background: '#D4A84320', border: '2px solid #D4A84360' }}
            >
              🧭
            </div>
            <div>
              <h2 className="font-heading text-xl italic font-bold text-ink">{player.name}</h2>
              <p className="text-ink/50 text-sm font-body">Nível {player.level} Explorador</p>
              <p className="font-mono text-xs text-gold mt-0.5">{totalXP} XP acumulado</p>
            </div>
          </div>
        </div>

        {/* Weekly Event */}
        <section>
          <h2 className="font-heading text-base italic font-semibold text-ink mb-3">
            📅 Desafio da Semana
          </h2>
          <WeeklyEventCard />
        </section>

        {/* NPC Council */}
        <section>
          <h2 className="font-heading text-base italic font-semibold text-ink mb-3">
            👥 Conselho dos Domínios
          </h2>
          <p className="text-xs text-ink/40 font-body mb-3">
            Toque em um guardião para ouvir sua sabedoria.
          </p>
          <div className="grid grid-cols-2 gap-3">
            {NPCS.map((npc) => (
              <NPCCard
                key={npc.domain}
                npc={npc}
                domainXP={domainXP[npc.domain]}
              />
            ))}
          </div>
        </section>

        {/* Journey Stats */}
        <section>
          <h2 className="font-heading text-base italic font-semibold text-ink mb-3">
            📊 Sua Jornada
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: '📋', label: 'Missões concluídas', value: completedMissions },
              { icon: '🌳', label: 'Habilidades desbloqueadas', value: unlockedSkills },
              { icon: '🗺️', label: 'Locais explorados', value: exploredPOIs },
              { icon: '🎒', label: 'Itens coletados', value: items.length },
            ].map(({ icon, label, value }) => (
              <div
                key={label}
                className="rounded-xl p-4"
                style={{ background: 'rgba(42,33,24,0.04)', border: '1px solid rgba(42,33,24,0.08)' }}
              >
                <p className="text-2xl mb-1">{icon}</p>
                <p className="font-mono text-2xl font-bold text-ink leading-none">{value}</p>
                <p className="text-xs text-ink/40 font-body mt-1">{label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Domain XP Breakdown */}
        <section>
          <h2 className="font-heading text-base italic font-semibold text-ink mb-3">
            ⚡ XP por Domínio
          </h2>
          <div className="flex flex-col gap-2">
            {NPCS.map((npc) => {
              const xp = domainXP[npc.domain]
              const maxXP = Math.max(...Object.values(domainXP), 1)
              const pct = Math.round((xp / maxXP) * 100)
              return (
                <div key={npc.domain} className="flex items-center gap-3">
                  <span className="text-base w-6">{npc.avatar}</span>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-xs font-semibold text-ink/60">{npc.name.split(' ')[0]}</span>
                      <span className="font-mono text-xs" style={{ color: npc.color }}>{xp} XP</span>
                    </div>
                    <div className="h-1.5 rounded-full" style={{ background: `${npc.color}25` }}>
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${pct}%`, background: npc.color }}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Account actions */}
        <section className="flex flex-col gap-3 pt-2">
          <button
            onClick={onLogout}
            className="w-full py-3 rounded-xl text-sm font-semibold font-body transition-colors"
            style={{ background: 'rgba(42,33,24,0.06)', color: 'rgba(42,33,24,0.55)', border: '1px solid rgba(42,33,24,0.12)' }}
          >
            Sair da conta
          </button>

          {!confirmDelete ? (
            <button
              onClick={() => setConfirmDelete(true)}
              className="w-full py-3 rounded-xl text-sm font-semibold font-body transition-colors"
              style={{ background: 'rgba(180,40,30,0.06)', color: 'rgba(180,40,30,0.55)', border: '1px solid rgba(180,40,30,0.15)' }}
            >
              Apagar meus dados
            </button>
          ) : (
            <div
              className="rounded-xl p-4 flex flex-col gap-3"
              style={{ background: 'rgba(180,40,30,0.06)', border: '1px solid rgba(180,40,30,0.20)' }}
            >
              <p className="text-sm font-body text-center" style={{ color: 'rgba(180,40,30,0.8)' }}>
                ⚠️ Isso apagará <strong>todos</strong> os seus dados permanentemente. Tem certeza?
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="flex-1 py-2 rounded-xl text-sm font-semibold font-body"
                  style={{ background: 'rgba(42,33,24,0.08)', color: 'rgba(42,33,24,0.55)' }}
                >
                  Cancelar
                </button>
                <button
                  onClick={onDeleteData}
                  className="flex-1 py-2 rounded-xl text-sm font-semibold font-body"
                  style={{ background: 'rgba(180,40,30,0.15)', color: 'rgba(180,40,30,0.9)' }}
                >
                  Sim, apagar tudo
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Flavor footer */}
        <p className="text-center text-xs italic text-ink/25 font-body pb-2">
          "A Cidadela cresce com cada passo da sua jornada."
        </p>
      </main>
    </div>
  )
}

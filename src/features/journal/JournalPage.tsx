import { useState } from 'react'
import { useJournalStore } from '@/stores/journalStore'
import { useInventoryStore } from '@/stores/inventoryStore'
import { DOMAIN_LABELS, MISSION_TYPE_LABELS, DOMAIN_COLORS } from '@/types'

function relativeDate(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const days = Math.floor(diff / 86_400_000)
  if (days === 0) return 'Hoje'
  if (days === 1) return 'Ontem'
  if (days < 7)  return `${days} dias atrás`
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' })
}

export function JournalPage() {
  const entries    = useJournalStore((s) => s.entries)
  const updateNote = useJournalStore((s) => s.updateNote)
  const allItems   = useInventoryStore((s) => s.items)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [noteText,   setNoteText]   = useState<Record<string, string>>({})

  function getNote(id: string): string {
    return noteText[id] ?? entries.find((e) => e.id === id)?.note ?? ''
  }

  function handleSaveNote(id: string) {
    updateNote(id, getNote(id))
    setExpandedId(null)
  }

  return (
    <div className="min-h-screen bg-parchment pb-24">
      {/* Header */}
      <header className="bg-white border-b border-parchment-dark px-6 py-4 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <h1 className="font-heading text-xl italic font-bold text-ink">Diário</h1>
          <span className="font-mono text-xs text-ink/40">{entries.length} registros</span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 pt-5 flex flex-col gap-3">
        {/* Empty state */}
        {entries.length === 0 && (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">📖</p>
            <p className="font-heading italic text-ink/40 text-lg">Diário vazio</p>
            <p className="text-ink/30 text-sm mt-1">
              Complete missões para registrar sua jornada.
            </p>
          </div>
        )}

        {/* Entries */}
        {entries.map((entry) => {
          const isExpanded   = expandedId === entry.id
          const entryItems   = allItems.filter((i) => entry.itemIds.includes(i.id))
          const currentNote  = getNote(entry.id)
          const domainColor  = DOMAIN_COLORS[entry.domain]

          return (
            <div
              key={entry.id}
              className="card p-4 flex flex-col gap-3"
              style={{ borderLeft: `4px solid ${domainColor}` }}
            >
              {/* Top row: date + type */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-ink/40">{relativeDate(entry.completedAt)}</span>
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={{ color: domainColor, backgroundColor: domainColor + '18' }}
                >
                  {MISSION_TYPE_LABELS[entry.type]}
                </span>
              </div>

              {/* Mission title */}
              <p className="font-body font-semibold text-ink text-sm leading-snug">
                {entry.missionTitle}
              </p>

              {/* XP + domain */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="xp-chip">+{entry.xpGeneral} XP Geral</span>
                <span
                  className="xp-chip"
                  style={{ color: domainColor, borderColor: domainColor + '40', backgroundColor: domainColor + '10' }}
                >
                  +{entry.xpDomain} XP {DOMAIN_LABELS[entry.domain]}
                </span>
              </div>

              {/* Loot icons */}
              {entryItems.length > 0 && (
                <div className="flex items-center gap-1">
                  <span className="text-xs text-ink/30 font-body mr-1">Obtido:</span>
                  {entryItems.map((item) => (
                    <span key={item.id} title={item.name} className="text-lg leading-none">
                      {item.icon}
                    </span>
                  ))}
                </div>
              )}

              {/* Note section */}
              {isExpanded ? (
                <div className="flex flex-col gap-2">
                  <textarea
                    autoFocus
                    rows={3}
                    value={currentNote}
                    onChange={(e) =>
                      setNoteText((prev) => ({ ...prev, [entry.id]: e.target.value }))
                    }
                    placeholder="Escreva uma reflexão sobre esta missão..."
                    className="w-full px-3 py-2 rounded-card border border-parchment-dark
                               bg-parchment text-ink text-xs placeholder:text-ink/30
                               focus:outline-none focus:ring-2 focus:ring-gold resize-none"
                  />
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => setExpandedId(null)}
                      className="text-xs text-ink/40 hover:text-ink/70 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={() => handleSaveNote(entry.id)}
                      className="btn-primary text-xs px-3 py-1"
                    >
                      Salvar
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setExpandedId(entry.id)}
                  className="text-left text-xs text-ink/40 hover:text-ink/70 transition-colors italic"
                >
                  {entry.note ? `"${entry.note}"` : '+ Adicionar reflexão...'}
                </button>
              )}
            </div>
          )
        })}
      </main>
    </div>
  )
}

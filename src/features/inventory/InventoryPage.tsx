import { useState } from 'react'
import { useInventoryStore } from '@/stores/inventoryStore'
import { DOMAIN_LABELS, RARITY_LABELS, RARITY_COLORS } from '@/types'
import type { Domain } from '@/types'

const DOMAIN_FILTERS: { label: string; value: Domain | 'all' }[] = [
  { label: 'Todos',   value: 'all' },
  { label: 'Mente',   value: 'mind' },
  { label: 'Corpo',   value: 'body' },
  { label: 'Alma',    value: 'soul' },
  { label: 'Criação', value: 'creation' },
]

const DOMAIN_DOT: Record<Domain, string> = {
  mind:     'bg-[#5B8C5A]',
  body:     'bg-[#C67B5C]',
  soul:     'bg-[#6BA3B7]',
  creation: 'bg-[#B8976A]',
}

export function InventoryPage() {
  const items  = useInventoryStore((s) => s.items)
  const [filter, setFilter] = useState<Domain | 'all'>('all')

  const visible = filter === 'all' ? items : items.filter((i) => i.domain === filter)

  return (
    <div className="min-h-screen bg-parchment pb-24">
      {/* Header */}
      <header className="bg-white border-b border-parchment-dark px-6 py-4 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <h1 className="font-heading text-xl italic font-bold text-ink">Inventário</h1>
          <span className="font-mono text-xs text-ink/40">{items.length} itens</span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 pt-5 flex flex-col gap-5">
        {/* Domain filter */}
        <div className="flex gap-2 flex-wrap">
          {DOMAIN_FILTERS.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={`
                px-3 py-1 rounded-full text-xs font-semibold font-body transition-colors
                ${filter === value
                  ? 'bg-ink text-parchment'
                  : 'bg-white border border-parchment-dark text-ink/50 hover:text-ink'}
              `}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Empty state */}
        {visible.length === 0 && (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">🎒</p>
            <p className="font-heading italic text-ink/40 text-lg">
              {filter === 'all' ? 'Nenhum item ainda' : 'Nenhum item neste domínio'}
            </p>
            <p className="text-ink/30 text-sm mt-1">
              Complete missões para obter recompensas.
            </p>
          </div>
        )}

        {/* Item grid */}
        {visible.length > 0 && (
          <div className="grid grid-cols-2 gap-3">
            {[...visible].reverse().map((item) => (
              <div
                key={item.id}
                className="card p-4 flex flex-col gap-2"
                style={{ borderTop: `3px solid ${RARITY_COLORS[item.rarity]}` }}
              >
                {/* Icon + rarity */}
                <div className="flex items-center justify-between">
                  <span className="text-3xl leading-none">{item.icon}</span>
                  <span
                    className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded"
                    style={{
                      color:           RARITY_COLORS[item.rarity],
                      backgroundColor: RARITY_COLORS[item.rarity] + '20',
                    }}
                  >
                    {RARITY_LABELS[item.rarity].toUpperCase()}
                  </span>
                </div>

                {/* Name */}
                <p className="font-body font-semibold text-ink text-sm leading-snug">
                  {item.name}
                </p>

                {/* Description */}
                <p className="text-ink/50 text-xs leading-snug">{item.description}</p>

                {/* Domain + date */}
                <div className="flex items-center justify-between mt-auto pt-1">
                  <span className="flex items-center gap-1 text-xs text-ink/40">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${DOMAIN_DOT[item.domain]}`} />
                    {DOMAIN_LABELS[item.domain]}
                  </span>
                  <span className="text-[10px] text-ink/30 font-mono">
                    {new Date(item.obtainedAt).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

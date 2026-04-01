import { useState } from 'react'
import { STARTER_MISSIONS } from '@/lib/onboardingData'
import { DOMAIN_COLORS, DOMAIN_LABELS } from '@/types'
import type { Domain } from '@/types'
import type { IStarterMission } from '@/lib/onboardingData'

const DOMAIN_ORDER: Domain[] = ['mind', 'body', 'soul', 'creation']
const DOMAIN_ICONS: Record<Domain, string> = {
  mind:     '🧠',
  body:     '💪',
  soul:     '✨',
  creation: '🎨',
}
const MIN_PICKS = 3

interface Props {
  domainOrder: Domain[]  // sorted by priority (weakest first)
  onConfirm:   (missions: IStarterMission[]) => void
}

export function MissionPickerStep({ domainOrder, onConfirm }: Props) {
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const orderedDomains = domainOrder.length > 0 ? domainOrder : DOMAIN_ORDER

  function toggle(title: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(title)) next.delete(title)
      else next.add(title)
      return next
    })
  }

  function handleConfirm() {
    const picks = STARTER_MISSIONS.filter((m) => selected.has(m.title))
    onConfirm(picks)
  }

  const count = selected.size
  const ready = count >= MIN_PICKS

  return (
    <div className="min-h-screen bg-parchment flex flex-col pb-28">
      {/* Header */}
      <div className="px-6 pt-8 pb-4 sticky top-0 bg-parchment z-10 border-b border-parchment-dark">
        <h1 className="font-heading text-2xl italic font-bold text-ink mb-1">
          Escolha suas missões
        </h1>
        <p className="text-ink/50 text-sm">
          Selecione pelo menos {MIN_PICKS} missões diárias para começar.
          Os domínios mais importantes para você aparecem primeiro.
        </p>
      </div>

      {/* Mission groups */}
      <div className="px-6 pt-4 flex flex-col gap-8">
        {orderedDomains.map((domain) => {
          const missions = STARTER_MISSIONS.filter((m) => m.domain === domain)
          const color    = DOMAIN_COLORS[domain]

          return (
            <section key={domain}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">{DOMAIN_ICONS[domain]}</span>
                <h2
                  className="font-heading italic font-semibold text-base"
                  style={{ color }}
                >
                  {DOMAIN_LABELS[domain]}
                </h2>
              </div>

              <div className="flex flex-col gap-2">
                {missions.map((mission) => {
                  const isSelected = selected.has(mission.title)
                  return (
                    <button
                      key={mission.title}
                      onClick={() => toggle(mission.title)}
                      className="w-full text-left rounded-xl border-2 p-4 bg-white transition-all active:scale-[0.99]"
                      style={{
                        borderColor: isSelected ? color : 'transparent',
                        boxShadow:   isSelected ? `0 0 0 1px ${color}40` : '0 1px 3px rgba(0,0,0,0.06)',
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className="mt-0.5 w-5 h-5 rounded shrink-0 border-2 flex items-center justify-center transition-colors"
                          style={{
                            borderColor:     isSelected ? color : '#D1C9BE',
                            backgroundColor: isSelected ? color : 'transparent',
                          }}
                        >
                          {isSelected && (
                            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                              <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </div>
                        <div>
                          <p className="font-body font-semibold text-sm text-ink leading-snug">
                            {mission.title}
                          </p>
                          <p className="font-body text-xs text-ink/50 mt-0.5 leading-relaxed">
                            {mission.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </section>
          )
        })}
      </div>

      {/* Sticky confirm bar */}
      <div className="fixed bottom-0 inset-x-0 bg-white border-t border-parchment-dark px-6 py-4">
        <div className="max-w-sm mx-auto flex items-center gap-4">
          <span className="font-mono text-sm text-ink/50 shrink-0">
            {count} selecionada{count !== 1 ? 's' : ''}
          </span>
          <button
            onClick={handleConfirm}
            disabled={!ready}
            className="flex-1 btn-gold py-3 text-base font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Começar Jornada ✦
          </button>
        </div>
      </div>
    </div>
  )
}

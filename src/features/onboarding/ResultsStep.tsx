import { DOMAIN_COLORS, DOMAIN_LABELS } from '@/types'
import type { Domain } from '@/types'

const DOMAIN_ICONS: Record<Domain, string> = {
  mind:     '🧠',
  body:     '💪',
  soul:     '✨',
  creation: '🎨',
}

const DOMAIN_ORDER: Domain[] = ['mind', 'body', 'soul', 'creation']

const FOCUS_MESSAGES: Record<Domain, string> = {
  mind:     'Sua mente pede mais atenção e estímulo.',
  body:     'Seu corpo está pedindo mais cuidado.',
  soul:     'Sua alma quer mais conexão e presença.',
  creation: 'Sua criatividade está esperando ser liberada.',
}

interface Props {
  scores:     Record<Domain, number>
  onContinue: () => void
}

export function ResultsStep({ scores, onContinue }: Props) {
  const maxScore  = 9
  const weakest   = DOMAIN_ORDER.reduce((a, b) => scores[a] <= scores[b] ? a : b)
  const sorted    = [...DOMAIN_ORDER].sort((a, b) => scores[a] - scores[b])

  return (
    <div className="min-h-screen bg-parchment flex flex-col items-center justify-center px-6 py-10">
      <div className="w-full max-w-sm">
        {/* Title */}
        <h1 className="font-heading text-2xl italic font-bold text-ink text-center mb-2">
          Seu ponto de partida
        </h1>
        <p className="text-ink/50 text-sm text-center mb-8">
          Veja como está cada domínio da sua vida agora.
        </p>

        {/* Domain bars — sorted weakest first */}
        <div className="flex flex-col gap-4 mb-8">
          {sorted.map((domain) => {
            const score   = scores[domain]
            const percent = (score / maxScore) * 100
            const color   = DOMAIN_COLORS[domain]
            const isWeak  = domain === weakest

            return (
              <div key={domain}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span>{DOMAIN_ICONS[domain]}</span>
                    <span className="font-body font-semibold text-sm text-ink">
                      {DOMAIN_LABELS[domain]}
                    </span>
                    {isWeak && (
                      <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                        style={{ backgroundColor: color + '20', color }}>
                        Prioridade
                      </span>
                    )}
                  </div>
                  <span className="font-mono text-xs text-ink/40">{score}/9</span>
                </div>
                <div className="h-3 bg-parchment-dark rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${percent}%`, backgroundColor: color }}
                  />
                </div>
              </div>
            )
          })}
        </div>

        {/* Focus highlight */}
        <div
          className="rounded-xl p-4 mb-8 border"
          style={{
            backgroundColor: DOMAIN_COLORS[weakest] + '12',
            borderColor:     DOMAIN_COLORS[weakest] + '40',
          }}
        >
          <p className="font-body text-sm text-ink leading-relaxed">
            <span className="font-semibold">{DOMAIN_ICONS[weakest]} {DOMAIN_LABELS[weakest]}</span>
            {' — '}
            {FOCUS_MESSAGES[weakest]}
            {' Vamos começar por aqui.'}
          </p>
        </div>

        <button
          onClick={onContinue}
          className="btn-gold w-full py-4 text-base font-semibold"
        >
          Ver missões recomendadas →
        </button>
      </div>
    </div>
  )
}

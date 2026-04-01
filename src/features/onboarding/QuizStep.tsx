import { useState } from 'react'
import { ONBOARDING_QUESTIONS } from '@/lib/onboardingData'
import { DOMAIN_COLORS, DOMAIN_LABELS } from '@/types'
import type { Domain } from '@/types'

const DOMAIN_ICONS: Record<Domain, string> = {
  mind:     '🧠',
  body:     '💪',
  soul:     '✨',
  creation: '🎨',
}

interface Props {
  onComplete: (scores: Record<Domain, number>) => void
}

export function QuizStep({ onComplete }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})

  const question = ONBOARDING_QUESTIONS[currentIndex]
  const total    = ONBOARDING_QUESTIONS.length
  const progress = ((currentIndex) / total) * 100
  const color    = DOMAIN_COLORS[question.domain]

  function handleOption(score: number) {
    const next = { ...answers, [question.id]: score }
    setAnswers(next)

    if (currentIndex < total - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      // Compute per-domain scores
      const scores: Record<Domain, number> = { mind: 0, body: 0, soul: 0, creation: 0 }
      for (const q of ONBOARDING_QUESTIONS) {
        scores[q.domain] += next[q.id] ?? 0
      }
      onComplete(scores)
    }
  }

  function handleBack() {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1)
  }

  return (
    <div className="min-h-screen bg-parchment flex flex-col">
      {/* Progress bar */}
      <div className="h-1 bg-parchment-dark">
        <div
          className="h-full transition-all duration-300"
          style={{ width: `${progress}%`, backgroundColor: color }}
        />
      </div>

      {/* Domain header */}
      <div
        className="px-6 py-3 flex items-center gap-2"
        style={{ backgroundColor: color + '18' }}
      >
        <span className="text-lg">{DOMAIN_ICONS[question.domain]}</span>
        <span className="font-heading italic font-semibold text-sm" style={{ color }}>
          {DOMAIN_LABELS[question.domain]}
        </span>
        <span className="ml-auto font-mono text-xs text-ink/40">
          {currentIndex + 1} / {total}
        </span>
      </div>

      {/* Question */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        <div
          className="w-full max-w-sm rounded-2xl border-2 p-6 bg-white shadow-sm mb-8"
          style={{ borderColor: color + '60' }}
        >
          <p className="font-body text-ink text-lg leading-snug text-center">
            {question.text}
          </p>
        </div>

        {/* Options */}
        <div className="w-full max-w-sm flex flex-col gap-3">
          {question.options.map((option, i) => (
            <button
              key={option}
              onClick={() => handleOption(i + 1)}
              className="w-full text-left px-5 py-4 rounded-xl border-2 border-parchment-dark
                         bg-white font-body text-ink text-base transition-all
                         active:scale-[0.98] hover:border-opacity-100"
              style={{
                borderColor: answers[question.id] === i + 1 ? color : undefined,
              }}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Back button */}
      {currentIndex > 0 && (
        <div className="px-6 pb-8 flex justify-start">
          <button
            onClick={handleBack}
            className="text-ink/40 font-body text-sm flex items-center gap-1 hover:text-ink/60"
          >
            ← Voltar
          </button>
        </div>
      )}
    </div>
  )
}

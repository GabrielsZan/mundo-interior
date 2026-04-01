import { useState } from 'react'
import { QuizStep } from './QuizStep'
import { ResultsStep } from './ResultsStep'
import { MissionPickerStep } from './MissionPickerStep'
import { usePlayerStore } from '@/stores/playerStore'
import { useMissionStore } from '@/stores/missionStore'
import type { Domain } from '@/types'
import type { IStarterMission } from '@/lib/onboardingData'

const DOMAIN_ORDER: Domain[] = ['mind', 'body', 'soul', 'creation']

type Step = 'quiz' | 'results' | 'picker' | 'done'

export function OnboardingFlow() {
  const player             = usePlayerStore((s) => s.player)
  const completeOnboarding = usePlayerStore((s) => s.completeOnboarding)
  const addBulkMissions    = useMissionStore((s) => s.addBulkMissions)
  const setPlayerId        = useMissionStore((s) => s.setPlayerId)

  const [step,         setStep]         = useState<Step>('quiz')
  const [scores,       setScores]       = useState<Record<Domain, number>>({ mind: 0, body: 0, soul: 0, creation: 0 })
  const [domainOrder,  setDomainOrder]  = useState<Domain[]>(DOMAIN_ORDER)

  function handleQuizComplete(result: Record<Domain, number>) {
    setScores(result)
    // Sort domains weakest first for mission picker ordering
    const sorted = [...DOMAIN_ORDER].sort((a, b) => result[a] - result[b])
    setDomainOrder(sorted)
    setStep('results')
  }

  function handlePickerConfirm(missions: IStarterMission[]) {
    // Ensure playerId is set so missions sync to Supabase
    if (player?.id) setPlayerId(player.id)

    addBulkMissions(
      missions.map((m) => ({
        title:       m.title,
        description: m.description,
        domain:      m.domain,
        type:        'daily' as const,
      }))
    )
    completeOnboarding()
    // App.tsx will re-render to Dashboard once hasCompletedOnboarding is true
  }

  if (step === 'quiz') {
    return <QuizStep onComplete={handleQuizComplete} />
  }

  if (step === 'results') {
    return (
      <ResultsStep
        scores={scores}
        onContinue={() => setStep('picker')}
      />
    )
  }

  if (step === 'picker') {
    return (
      <MissionPickerStep
        domainOrder={domainOrder}
        onConfirm={handlePickerConfirm}
      />
    )
  }

  // 'done' state — completeOnboarding() triggers re-render to Dashboard
  return null
}

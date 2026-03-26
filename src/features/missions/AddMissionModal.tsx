import { useState } from 'react'
import { useMissionStore } from '@/stores/missionStore'
import { Button } from '@/components/ui'
import { DOMAIN_LABELS, MISSION_TYPE_LABELS } from '@/types'
import type { Domain, MissionType } from '@/types'

interface AddMissionModalProps {
  onClose: () => void
}

const DOMAINS  = Object.keys(DOMAIN_LABELS)  as Domain[]
const TYPES    = Object.keys(MISSION_TYPE_LABELS) as MissionType[]

export function AddMissionModal({ onClose }: AddMissionModalProps) {
  const addMission = useMissionStore((s) => s.addMission)

  const [title,       setTitle]       = useState('')
  const [description, setDescription] = useState('')
  const [domain,      setDomain]      = useState<Domain>('mind')
  const [type,        setType]        = useState<MissionType>('daily')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    addMission({ title: title.trim(), description: description.trim(), domain, type })
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" />

      {/* Sheet */}
      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-md bg-parchment rounded-card shadow-card-hover p-6 flex flex-col gap-4"
      >
        <h2 className="font-heading text-xl italic font-bold text-ink">Nova Missão</h2>

        {/* Title */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-ink/60 uppercase tracking-wide">Título</label>
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="O que você vai fazer?"
            className="px-3 py-2 rounded-card border border-parchment-dark bg-white
                       text-ink placeholder:text-ink/30 text-sm
                       focus:outline-none focus:ring-2 focus:ring-gold"
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-ink/60 uppercase tracking-wide">
            Descrição <span className="normal-case font-normal">(opcional)</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Detalhes da missão..."
            rows={2}
            className="px-3 py-2 rounded-card border border-parchment-dark bg-white
                       text-ink placeholder:text-ink/30 text-sm resize-none
                       focus:outline-none focus:ring-2 focus:ring-gold"
          />
        </div>

        {/* Domain */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-ink/60 uppercase tracking-wide">Domínio</label>
          <div className="grid grid-cols-2 gap-2">
            {DOMAINS.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDomain(d)}
                className={`
                  py-2 rounded-card text-sm font-semibold border transition-all
                  ${domain === d
                    ? 'border-ink bg-ink text-parchment'
                    : 'border-parchment-dark bg-white text-ink/60 hover:border-ink/30'}
                `}
              >
                {DOMAIN_LABELS[d]}
              </button>
            ))}
          </div>
        </div>

        {/* Type */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-ink/60 uppercase tracking-wide">Tipo</label>
          <div className="grid grid-cols-3 gap-2">
            {TYPES.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`
                  py-2 rounded-card text-sm font-semibold border transition-all
                  ${type === t
                    ? 'border-gold bg-gold/10 text-gold-dark'
                    : 'border-parchment-dark bg-white text-ink/60 hover:border-ink/30'}
                `}
              >
                {MISSION_TYPE_LABELS[t]}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          <Button type="button" variant="ghost" className="flex-1" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="gold" className="flex-1" disabled={!title.trim()}>
            Criar Missão
          </Button>
        </div>
      </form>
    </div>
  )
}

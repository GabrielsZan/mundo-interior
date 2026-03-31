import { useMapStore } from '@/stores/mapStore'
import { mapPOIs } from './mapData'

interface NyxosInvasionModalProps {
  onClose: () => void
}

export function NyxosInvasionModal({ onClose }: NyxosInvasionModalProps) {
  const pendingInvasions    = useMapStore((s) => s.pendingInvasions)
  const clearPendingInvasions = useMapStore((s) => s.clearPendingInvasions)

  if (pendingInvasions.length === 0) return null

  function handleClose() {
    clearPendingInvasions()
    onClose()
  }

  // Show all invasions that happened
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(10,5,20,0.80)' }}
    >
      <div
        className="w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: '#1a1020', border: '1.5px solid #8B7332' }}
      >
        {/* Top accent */}
        <div style={{ background: 'linear-gradient(90deg, #8B7332 0%, #3D2B5A 100%)', height: 3 }} />

        <div className="p-6 flex flex-col items-center text-center">
          {/* Symbol */}
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-4"
            style={{
              background: 'rgba(61,43,90,0.35)',
              border: '2px solid #8B7332',
              boxShadow: '0 0 20px rgba(61,43,90,0.6)',
            }}
          >
            ⚔️
          </div>

          {/* Title */}
          <h2
            className="font-heading text-2xl font-bold italic mb-1"
            style={{ color: '#D4A843' }}
          >
            Nyxos Atacou!
          </h2>

          {/* Invasions list */}
          <div className="w-full flex flex-col gap-3 mt-4">
            {pendingInvasions.map((invasion, idx) => {
              const poi = mapPOIs.find((p) => p.id === invasion.poiId)
              const poiName = poi?.name ?? invasion.poiId

              return (
                <div
                  key={idx}
                  className="rounded-xl p-4 text-left"
                  style={{
                    background: 'rgba(61,43,90,0.25)',
                    border: '1px solid rgba(139,115,50,0.3)',
                  }}
                >
                  <p className="text-sm font-semibold" style={{ color: '#D4A843' }}>
                    {invasion.tentacao} corrompeu{' '}
                    <span style={{ color: '#F5E6C8' }}>{poiName}</span>!
                  </p>
                  <p className="text-xs italic mt-2" style={{ color: 'rgba(245,230,200,0.55)' }}>
                    "{invasion.frase}"
                  </p>
                </div>
              )
            })}
          </div>

          {/* Instruction */}
          <p className="mt-4 text-xs font-body" style={{ color: 'rgba(245,230,200,0.4)' }}>
            Reconquiste completando as missões novamente.
          </p>

          {/* CTA */}
          <button
            onClick={handleClose}
            className="mt-5 w-full py-3 rounded-xl text-sm font-semibold transition-opacity hover:opacity-85"
            style={{
              background: 'linear-gradient(135deg, #8B7332 0%, #6B4F8A 100%)',
              color: '#FBF6F0',
              border: 'none',
            }}
          >
            Ver no Mapa
          </button>
        </div>
      </div>
    </div>
  )
}

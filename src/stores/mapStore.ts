import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface MapState {
  visitedPOIs: string[]
  visitPOI: (id: string) => void
}

export const useMapStore = create<MapState>()(
  persist(
    (set) => ({
      visitedPOIs: [],
      visitPOI: (id) =>
        set((s) =>
          s.visitedPOIs.includes(id)
            ? s
            : { visitedPOIs: [...s.visitedPOIs, id] }
        ),
    }),
    { name: 'map-store' }
  )
)

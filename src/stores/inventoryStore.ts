import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { IItem } from '@/types'
import { dbFetchInventory, dbInsertInventoryItems, dbDeleteInventoryItem } from '@/lib/db'

interface InventoryState {
  items:    IItem[]
  playerId: string | null

  setPlayerId: (id: string | null) => void
  loadFromDb:  (playerId: string) => Promise<void>
  addItems:    (newItems: IItem[]) => void
  removeItem:  (id: string) => void
}

export const useInventoryStore = create<InventoryState>()(
  persist(
    (set, get) => ({
      items:    [],
      playerId: null,

      setPlayerId: (id) => set({ playerId: id }),

      loadFromDb: async (playerId) => {
        const items = await dbFetchInventory(playerId)
        set({ items, playerId })
      },

      addItems: (newItems) => {
        set((s) => ({ items: [...s.items, ...newItems] }))
        const { playerId } = get()
        if (playerId) dbInsertInventoryItems(newItems, playerId)
      },

      removeItem: (id) => {
        set((s) => ({ items: s.items.filter((i) => i.id !== id) }))
        dbDeleteInventoryItem(id)
      },
    }),
    { name: 'mundo-interior-inventory' }
  )
)

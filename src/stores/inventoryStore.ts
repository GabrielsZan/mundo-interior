import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { IItem } from '@/types'

interface InventoryState {
  items: IItem[]
  addItems:   (newItems: IItem[]) => void
  removeItem: (id: string) => void
}

export const useInventoryStore = create<InventoryState>()(
  persist(
    (set) => ({
      items: [],

      addItems: (newItems) =>
        set((s) => ({ items: [...s.items, ...newItems] })),

      removeItem: (id) =>
        set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
    }),
    { name: 'mundo-interior-inventory' }
  )
)

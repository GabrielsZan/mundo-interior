import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { IJournalEntry } from '@/types'

interface JournalState {
  entries:    IJournalEntry[]
  addEntry:   (entry: IJournalEntry) => void
  updateNote: (id: string, note: string) => void
}

export const useJournalStore = create<JournalState>()(
  persist(
    (set) => ({
      entries: [],

      addEntry: (entry) =>
        set((s) => ({ entries: [entry, ...s.entries] })),

      updateNote: (id, note) =>
        set((s) => ({
          entries: s.entries.map((e) => (e.id === id ? { ...e, note } : e)),
        })),
    }),
    { name: 'mundo-interior-journal' }
  )
)

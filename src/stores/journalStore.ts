import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { IJournalEntry } from '@/types'
import { dbFetchJournal, dbInsertJournalEntry, dbUpdateJournalNote } from '@/lib/db'

interface JournalState {
  entries:  IJournalEntry[]
  playerId: string | null

  setPlayerId: (id: string | null) => void
  loadFromDb:  (playerId: string) => Promise<void>
  addEntry:    (entry: IJournalEntry) => void
  updateNote:  (id: string, note: string) => void
}

export const useJournalStore = create<JournalState>()(
  persist(
    (set, get) => ({
      entries:  [],
      playerId: null,

      setPlayerId: (id) => set({ playerId: id }),

      loadFromDb: async (playerId) => {
        const entries = await dbFetchJournal(playerId)
        set({ entries, playerId })
      },

      addEntry: (entry) => {
        set((s) => ({ entries: [entry, ...s.entries] }))
        const { playerId } = get()
        if (playerId) dbInsertJournalEntry(entry, playerId)
      },

      updateNote: (id, note) => {
        set((s) => ({
          entries: s.entries.map((e) => (e.id === id ? { ...e, note } : e)),
        }))
        dbUpdateJournalNote(id, note)
      },
    }),
    { name: 'mundo-interior-journal' }
  )
)

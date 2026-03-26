import { useMissionStore } from '@/stores/missionStore'
import type { IMission, Domain, MissionType } from '@/types'

export interface MissionFilters {
  domain?: Domain
  type?:   MissionType
  completed?: boolean
}

/** Filtered view of missions. */
export function useMissions(filters: MissionFilters = {}): IMission[] {
  const missions = useMissionStore((s) => s.missions)

  return missions.filter((m) => {
    if (filters.domain    !== undefined && m.domain      !== filters.domain)    return false
    if (filters.type      !== undefined && m.type        !== filters.type)      return false
    if (filters.completed !== undefined && m.isCompleted !== filters.completed) return false
    return true
  })
}

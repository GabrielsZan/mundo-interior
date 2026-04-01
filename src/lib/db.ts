import { supabase } from './supabase'
import type { IPlayer, IMission, IItem, IJournalEntry } from '@/types'
import type { PendingInvasion } from '@/stores/mapStore'

// ── Shared snapshot types ─────────────────────────────────────────────────────

export interface MapStateSnapshot {
  revealedPois:         string[]
  completedPois:        string[]
  invadedPois:          string[]
  completedMapMissions: string[]
  lastActivityDate:     string | null
  lastInvasionCheck:    string | null
  daysInactive:         number
  pendingInvasions:     PendingInvasion[]
}

export interface EventStateSnapshot {
  weekKey:       string
  progress:      number
  rewardClaimed: boolean
}

// ── Player ───────────────────────────────────────────────────────────────────

export async function dbFetchPlayer(userId: string): Promise<IPlayer | null> {
  if (!supabase) return null
  try {
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .eq('user_id', userId)
      .single()
    if (error || !data) return null
    return rowToPlayer(data)
  } catch {
    return null
  }
}

export async function dbUpsertPlayer(player: IPlayer, userId: string): Promise<void> {
  if (!supabase) return
  try {
    await supabase.from('players').upsert(
      {
        id:                        player.id,
        user_id:                   userId,
        name:                      player.name,
        level:                     player.level,
        xp_general:                player.xpGeneral,
        xp_to_next_level:          player.xpToNextLevel,
        domain_xp:                 player.domainXP,
        has_completed_onboarding:  player.hasCompletedOnboarding,
      },
      { onConflict: 'user_id' }
    )
  } catch { /* fire-and-forget; local state is source of truth */ }
}

function rowToPlayer(row: Record<string, unknown>): IPlayer {
  return {
    id:                     row.id as string,
    name:                   row.name as string,
    level:                  row.level as number,
    xpGeneral:              row.xp_general as number,
    xpToNextLevel:          row.xp_to_next_level as number,
    domainXP:               row.domain_xp as IPlayer['domainXP'],
    createdAt:              row.created_at as string,
    hasCompletedOnboarding: (row.has_completed_onboarding as boolean) ?? false,
  }
}

// ── Missions ─────────────────────────────────────────────────────────────────

export async function dbFetchMissions(playerId: string): Promise<IMission[]> {
  if (!supabase) return []
  try {
    const { data, error } = await supabase
      .from('missions')
      .select('*')
      .eq('player_id', playerId)
      .order('created_at', { ascending: true })
    if (error || !data) return []
    return data.map(rowToMission)
  } catch {
    return []
  }
}

export async function dbInsertMission(mission: IMission, playerId: string): Promise<void> {
  if (!supabase) return
  try {
    await supabase.from('missions').insert({
      id:           mission.id,
      player_id:    playerId,
      title:        mission.title,
      description:  mission.description,
      domain:       mission.domain,
      type:         mission.type,
      xp_general:   mission.xpGeneral,
      xp_domain:    mission.xpDomain,
      is_completed: mission.isCompleted,
      completed_at: mission.completedAt,
      streak:       mission.streak,
      created_at:   mission.createdAt,
    })
  } catch { /* fire-and-forget */ }
}

export async function dbUpdateMission(
  id: string,
  patch: { isCompleted?: boolean; completedAt?: string | null; streak?: number }
): Promise<void> {
  if (!supabase) return
  try {
    const dbPatch: Record<string, unknown> = {}
    if (patch.isCompleted !== undefined) dbPatch.is_completed = patch.isCompleted
    if (patch.completedAt !== undefined) dbPatch.completed_at = patch.completedAt
    if (patch.streak      !== undefined) dbPatch.streak       = patch.streak
    await supabase.from('missions').update(dbPatch).eq('id', id)
  } catch { /* fire-and-forget */ }
}

export async function dbDeleteMission(id: string): Promise<void> {
  if (!supabase) return
  try {
    await supabase.from('missions').delete().eq('id', id)
  } catch { /* fire-and-forget */ }
}

export async function dbResetDailyMissions(playerId: string): Promise<void> {
  if (!supabase) return
  try {
    await supabase
      .from('missions')
      .update({ is_completed: false, completed_at: null })
      .eq('player_id', playerId)
      .eq('type', 'daily')
  } catch { /* fire-and-forget */ }
}

// ── Player Skills ────────────────────────────────────────────────────────────

export async function dbFetchUnlockedSkills(playerId: string): Promise<string[]> {
  if (!supabase) return []
  try {
    const { data, error } = await supabase
      .from('player_skills')
      .select('skill_id')
      .eq('player_id', playerId)
    if (error || !data) return []
    return data.map((r: Record<string, unknown>) => r.skill_id as string)
  } catch {
    return []
  }
}

export async function dbUnlockSkill(playerId: string, skillId: string): Promise<void> {
  if (!supabase) return
  try {
    await supabase.from('player_skills').insert({ player_id: playerId, skill_id: skillId })
  } catch { /* fire-and-forget */ }
}

function rowToMission(row: Record<string, unknown>): IMission {
  return {
    id:          row.id as string,
    title:       row.title as string,
    description: row.description as string,
    domain:      row.domain as IMission['domain'],
    type:        row.type as IMission['type'],
    xpGeneral:   row.xp_general as number,
    xpDomain:    row.xp_domain as number,
    isCompleted: row.is_completed as boolean,
    completedAt: row.completed_at as string | null,
    streak:      row.streak as number,
    createdAt:   row.created_at as string,
  }
}

// ── Inventory ────────────────────────────────────────────────────────────────

export async function dbFetchInventory(playerId: string): Promise<IItem[]> {
  if (!supabase) return []
  try {
    const { data, error } = await supabase
      .from('inventory_items')
      .select('*')
      .eq('player_id', playerId)
      .order('created_at', { ascending: true })
    if (error || !data) return []
    return data.map((row: Record<string, unknown>) => ({
      id:          row.id as string,
      name:        row.name as string,
      description: row.description as string,
      domain:      row.domain as IItem['domain'],
      rarity:      row.rarity as IItem['rarity'],
      icon:        row.icon as string,
      obtainedAt:  row.obtained_at as string,
      fromMission: row.from_mission as string,
    }))
  } catch {
    return []
  }
}

export async function dbInsertInventoryItems(items: IItem[], playerId: string): Promise<void> {
  if (!supabase || items.length === 0) return
  try {
    await supabase.from('inventory_items').insert(
      items.map((item) => ({
        id:           item.id,
        player_id:    playerId,
        name:         item.name,
        description:  item.description,
        domain:       item.domain,
        rarity:       item.rarity,
        icon:         item.icon,
        obtained_at:  item.obtainedAt,
        from_mission: item.fromMission,
      }))
    )
  } catch { /* fire-and-forget */ }
}

export async function dbDeleteInventoryItem(id: string): Promise<void> {
  if (!supabase) return
  try {
    await supabase.from('inventory_items').delete().eq('id', id)
  } catch { /* fire-and-forget */ }
}

// ── Journal ───────────────────────────────────────────────────────────────────

export async function dbFetchJournal(playerId: string): Promise<IJournalEntry[]> {
  if (!supabase) return []
  try {
    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('player_id', playerId)
      .order('completed_at', { ascending: false })
    if (error || !data) return []
    return data.map((row: Record<string, unknown>) => ({
      id:           row.id as string,
      missionId:    row.mission_id as string,
      missionTitle: row.mission_title as string,
      domain:       row.domain as IJournalEntry['domain'],
      type:         row.type as IJournalEntry['type'],
      xpGeneral:    row.xp_general as number,
      xpDomain:     row.xp_domain as number,
      completedAt:  row.completed_at as string,
      itemIds:      row.item_ids as string[],
      note:         row.note as string,
    }))
  } catch {
    return []
  }
}

export async function dbInsertJournalEntry(entry: IJournalEntry, playerId: string): Promise<void> {
  if (!supabase) return
  try {
    await supabase.from('journal_entries').insert({
      id:            entry.id,
      player_id:     playerId,
      mission_id:    entry.missionId,
      mission_title: entry.missionTitle,
      domain:        entry.domain,
      type:          entry.type,
      xp_general:    entry.xpGeneral,
      xp_domain:     entry.xpDomain,
      completed_at:  entry.completedAt,
      item_ids:      entry.itemIds,
      note:          entry.note,
    })
  } catch { /* fire-and-forget */ }
}

export async function dbUpdateJournalNote(id: string, note: string): Promise<void> {
  if (!supabase) return
  try {
    await supabase.from('journal_entries').update({ note }).eq('id', id)
  } catch { /* fire-and-forget */ }
}

// ── Map State ─────────────────────────────────────────────────────────────────

export async function dbFetchMapState(playerId: string): Promise<MapStateSnapshot | null> {
  if (!supabase) return null
  try {
    const { data, error } = await supabase
      .from('players')
      .select('map_state')
      .eq('id', playerId)
      .single()
    if (error || !data || !data.map_state) return null
    return data.map_state as MapStateSnapshot
  } catch {
    return null
  }
}

export async function dbUpsertMapState(playerId: string, state: MapStateSnapshot): Promise<void> {
  if (!supabase) return
  try {
    await supabase
      .from('players')
      .update({ map_state: state })
      .eq('id', playerId)
  } catch { /* fire-and-forget */ }
}

// ── Event State ───────────────────────────────────────────────────────────────

export async function dbFetchEventState(playerId: string): Promise<EventStateSnapshot | null> {
  if (!supabase) return null
  try {
    const { data, error } = await supabase
      .from('players')
      .select('event_state')
      .eq('id', playerId)
      .single()
    if (error || !data || !data.event_state) return null
    return data.event_state as EventStateSnapshot
  } catch {
    return null
  }
}

export async function dbUpsertEventState(playerId: string, state: EventStateSnapshot): Promise<void> {
  if (!supabase) return
  try {
    await supabase
      .from('players')
      .update({ event_state: state })
      .eq('id', playerId)
  } catch { /* fire-and-forget */ }
}

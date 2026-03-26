import { supabase } from './supabase'
import type { IPlayer, IMission } from '@/types'

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
        id:               player.id,
        user_id:          userId,
        name:             player.name,
        level:            player.level,
        xp_general:       player.xpGeneral,
        xp_to_next_level: player.xpToNextLevel,
        domain_xp:        player.domainXP,
      },
      { onConflict: 'user_id' }
    )
  } catch { /* fire-and-forget; local state is source of truth */ }
}

function rowToPlayer(row: Record<string, unknown>): IPlayer {
  return {
    id:            row.id as string,
    name:          row.name as string,
    level:         row.level as number,
    xpGeneral:     row.xp_general as number,
    xpToNextLevel: row.xp_to_next_level as number,
    domainXP:      row.domain_xp as IPlayer['domainXP'],
    createdAt:     row.created_at as string,
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

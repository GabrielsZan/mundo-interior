// ── Domain ──────────────────────────────────────────────────────────────────

export type Domain = 'mind' | 'body' | 'soul' | 'creation'

export const DOMAIN_LABELS: Record<Domain, string> = {
  mind:     'Mente',
  body:     'Corpo',
  soul:     'Alma',
  creation: 'Criação',
}

export const DOMAIN_COLORS: Record<Domain, string> = {
  mind:     '#5B8C5A',
  body:     '#C67B5C',
  soul:     '#6BA3B7',
  creation: '#B8976A',
}

// ── Mission ─────────────────────────────────────────────────────────────────

export type MissionType = 'daily' | 'main' | 'epic'

export const MISSION_TYPE_LABELS: Record<MissionType, string> = {
  daily: 'Diária',
  main:  'Principal',
  epic:  'Épica',
}

export interface IMission {
  id:          string
  title:       string
  description: string
  domain:      Domain
  type:        MissionType
  xpGeneral:   number   // XP Geral rewarded on completion
  xpDomain:    number   // XP de Domínio rewarded on completion
  isCompleted: boolean
  completedAt: string | null
  streak:      number   // for daily missions
  createdAt:   string
}

// ── Player ───────────────────────────────────────────────────────────────────

export interface IDomainXP {
  mind:     number
  body:     number
  soul:     number
  creation: number
}

export interface IPlayer {
  id:          string
  name:        string
  level:       number
  xpGeneral:   number   // total XP Geral accumulated
  xpToNextLevel: number // XP needed to reach next level
  domainXP:    IDomainXP
  createdAt:   string
}

// ── Skill ────────────────────────────────────────────────────────────────────

export type SkillTier = 1 | 2 | 3

export interface ISkill {
  id:           string
  name:         string
  description:  string
  domain:       Domain
  tier:         SkillTier
  xpCost:       number   // domain XP required to unlock
  isUnlocked:   boolean
  prerequisiteIds: string[]
}

// ── Utility ──────────────────────────────────────────────────────────────────

export interface IXPGain {
  general: number
  domain:  number
  domainType: Domain
}

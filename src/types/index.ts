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

// ── Item / Inventory ─────────────────────────────────────────────────────────

export type ItemRarity = 'common' | 'uncommon' | 'rare' | 'legendary'

export const RARITY_LABELS: Record<ItemRarity, string> = {
  common:    'Comum',
  uncommon:  'Incomum',
  rare:      'Raro',
  legendary: 'Lendário',
}

export const RARITY_COLORS: Record<ItemRarity, string> = {
  common:    '#9CA3AF',
  uncommon:  '#5B8C5A',
  rare:      '#6BA3B7',
  legendary: '#D4A843',
}

export interface IItem {
  id:          string
  name:        string
  description: string
  domain:      Domain
  rarity:      ItemRarity
  icon:        string        // emoji
  obtainedAt:  string
  fromMission: string
}

// ── Journal ───────────────────────────────────────────────────────────────────

export interface IJournalEntry {
  id:           string
  missionId:    string
  missionTitle: string
  domain:       Domain
  type:         MissionType
  xpGeneral:    number
  xpDomain:     number
  completedAt:  string
  itemIds:      string[]
  note:         string
}

// ── Utility ──────────────────────────────────────────────────────────────────

export interface IXPGain {
  general: number
  domain:  number
  domainType: Domain
}

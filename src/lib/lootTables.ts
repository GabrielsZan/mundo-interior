import type { Domain, MissionType, ItemRarity } from '@/types'

// ── Loot Entry (template, without instance id/date) ──────────────────────────

export interface ILootEntry {
  name:        string
  description: string
  icon:        string
  rarity:      ItemRarity
  domain:      Domain
}

// ── Item pools per domain × rarity ───────────────────────────────────────────

const LOOT_POOLS: Record<Domain, Record<ItemRarity, ILootEntry>> = {
  mind: {
    common:    { name: 'Tomo Comum',        description: 'Anotações de aprendizado do dia.',          icon: '📚', rarity: 'common',    domain: 'mind' },
    uncommon:  { name: 'Cristal de Foco',   description: 'Amplifica a concentração mental.',          icon: '🔮', rarity: 'uncommon',  domain: 'mind' },
    rare:      { name: 'Orbe de Clareza',   description: 'Traz clareza a pensamentos complexos.',     icon: '🌟', rarity: 'rare',      domain: 'mind' },
    legendary: { name: 'Grimório Ancestral',description: 'Contém o conhecimento de eras passadas.',  icon: '✨', rarity: 'legendary', domain: 'mind' },
  },
  body: {
    common:    { name: 'Erva Medicinal',    description: 'Restaura energia vital.',                   icon: '🌿', rarity: 'common',    domain: 'body' },
    uncommon:  { name: 'Elixir Vigorizante',description: 'Fortalece o corpo e a mente.',              icon: '⚗️',  rarity: 'uncommon',  domain: 'body' },
    rare:      { name: 'Gema de Energia',   description: 'Irradia força vital pura.',                 icon: '💎', rarity: 'rare',      domain: 'body' },
    legendary: { name: 'Amuleto do Guerreiro', description: 'Concede vitalidade inesgotável.',        icon: '🏆', rarity: 'legendary', domain: 'body' },
  },
  soul: {
    common:    { name: 'Vela Sagrada',      description: 'Traz paz interior ao ambiente.',            icon: '🕯️',  rarity: 'common',    domain: 'soul' },
    uncommon:  { name: 'Cristal de Harmonia', description: 'Equilibra as energias da alma.',          icon: '💠', rarity: 'uncommon',  domain: 'soul' },
    rare:      { name: 'Pluma da Esperança', description: 'Símbolo de renovação e esperança.',        icon: '🪶', rarity: 'rare',      domain: 'soul' },
    legendary: { name: 'Luz Interior',      description: 'A manifestação da sua essência mais pura.', icon: '☀️', rarity: 'legendary', domain: 'soul' },
  },
  creation: {
    common:    { name: 'Tinta Mágica',      description: 'Para dar forma a ideias.',                  icon: '🖌️',  rarity: 'common',    domain: 'creation' },
    uncommon:  { name: 'Pena de Inspiração', description: 'Guia a criatividade em momentos difíceis.', icon: '✏️', rarity: 'uncommon',  domain: 'creation' },
    rare:      { name: 'Pedra de Visão',    description: 'Revela possibilidades ainda ocultas.',      icon: '🔷', rarity: 'rare',      domain: 'creation' },
    legendary: { name: 'Gema da Criatividade', description: 'O coração da criação pura.',             icon: '💫', rarity: 'legendary', domain: 'creation' },
  },
}

// ── Rarity weights per mission type ──────────────────────────────────────────

const RARITY_WEIGHTS: Record<MissionType, [ItemRarity, number][]> = {
  daily: [
    ['common', 70], ['uncommon', 28], ['rare', 2], ['legendary', 0],
  ],
  main: [
    ['common', 30], ['uncommon', 50], ['rare', 18], ['legendary', 2],
  ],
  epic: [
    ['common', 10], ['uncommon', 30], ['rare', 45], ['legendary', 15],
  ],
}

// How many items drop per mission type [min, max]
const ITEM_COUNT: Record<MissionType, [number, number]> = {
  daily: [1, 1],
  main:  [1, 2],
  epic:  [2, 3],
}

function rollRarity(type: MissionType): ItemRarity {
  const weights = RARITY_WEIGHTS[type]
  const total   = weights.reduce((sum, [, w]) => sum + w, 0)
  let roll      = Math.random() * total
  for (const [rarity, weight] of weights) {
    roll -= weight
    if (roll <= 0) return rarity
  }
  return 'common'
}

export function rollLoot(domain: Domain, type: MissionType): ILootEntry[] {
  const [min, max] = ITEM_COUNT[type]
  const count      = Math.floor(Math.random() * (max - min + 1)) + min
  const results: ILootEntry[] = []
  for (let i = 0; i < count; i++) {
    results.push(LOOT_POOLS[domain][rollRarity(type)])
  }
  return results
}

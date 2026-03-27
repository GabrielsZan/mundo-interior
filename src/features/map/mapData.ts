import type { Domain } from '@/types'

export type POIType = 'regular' | 'challenge' | 'citadel'

export interface IPOI {
  id: string
  name: string
  description: string
  domain: Domain | 'center'
  type: POIType
  x: number        // 0–100, percentage of MAP_W
  y: number        // 0–100, percentage of MAP_H
  revealXP: number // domainXP needed to reveal (0 = always visible)
  icon: string
}

export const MAP_W = 1600
export const MAP_H = 900

export const POIS: IPOI[] = [
  // ── Center ────────────────────────────────────────────────────────────────
  {
    id: 'citadel',
    name: 'Cidadela Interior',
    description: 'O núcleo do seu mundo interior. Aqui tudo começa e para aqui tudo converge.',
    domain: 'center',
    type: 'citadel',
    x: 50, y: 50,
    revealXP: 0,
    icon: '🏰',
  },

  // ── Mind — North ──────────────────────────────────────────────────────────
  {
    id: 'mind-tower',
    name: 'Torre da Contemplação',
    description: 'Um lugar de silêncio absoluto onde a mente encontra foco profundo.',
    domain: 'mind',
    type: 'regular',
    x: 42, y: 13,
    revealXP: 0,
    icon: '🗼',
  },
  {
    id: 'mind-library',
    name: 'Biblioteca do Saber',
    description: 'Repositório de todo conhecimento adquirido ao longo da jornada.',
    domain: 'mind',
    type: 'regular',
    x: 27, y: 20,
    revealXP: 100,
    icon: '📚',
  },
  {
    id: 'mind-observatory',
    name: 'Observatório das Estrelas',
    description: 'Do alto das montanhas, a mente enxerga padrões ocultos no cosmos.',
    domain: 'mind',
    type: 'regular',
    x: 62, y: 8,
    revealXP: 200,
    icon: '🔭',
  },

  // ── Body — South ──────────────────────────────────────────────────────────
  {
    id: 'body-training',
    name: 'Campo de Treino',
    description: 'Onde o corpo é forjado pela disciplina diária e pelo esforço consistente.',
    domain: 'body',
    type: 'regular',
    x: 35, y: 83,
    revealXP: 0,
    icon: '⚔️',
  },
  {
    id: 'body-spring',
    name: 'Fonte da Vitalidade',
    description: 'Águas que restauram energia, saúde e equilíbrio físico.',
    domain: 'body',
    type: 'regular',
    x: 58, y: 89,
    revealXP: 100,
    icon: '💧',
  },
  {
    id: 'body-trail',
    name: 'Trilha da Floresta',
    description: 'Um caminho de movimento e conexão profunda com a natureza.',
    domain: 'body',
    type: 'regular',
    x: 73, y: 78,
    revealXP: 200,
    icon: '🌿',
  },

  // ── Soul — East ───────────────────────────────────────────────────────────
  {
    id: 'soul-lake',
    name: 'Lago da Reflexão',
    description: 'Espelha a verdade interior com clareza cristalina.',
    domain: 'soul',
    type: 'regular',
    x: 83, y: 37,
    revealXP: 0,
    icon: '🌊',
  },
  {
    id: 'soul-sanctuary',
    name: 'Santuário Interior',
    description: 'Refúgio de paz, conexão emocional e presença plena.',
    domain: 'soul',
    type: 'regular',
    x: 89, y: 57,
    revealXP: 100,
    icon: '🕊️',
  },
  {
    id: 'soul-grove',
    name: 'Bosque do Espírito',
    description: 'Onde emoções florescem livremente entre árvores antigas.',
    domain: 'soul',
    type: 'regular',
    x: 76, y: 68,
    revealXP: 200,
    icon: '🌸',
  },

  // ── Creation — West ───────────────────────────────────────────────────────
  {
    id: 'creation-atelier',
    name: 'Ateliê do Artesão',
    description: 'Espaço de criação, expressão manual e arte em todas as formas.',
    domain: 'creation',
    type: 'regular',
    x: 17, y: 42,
    revealXP: 0,
    icon: '🎨',
  },
  {
    id: 'creation-cabin',
    name: 'Cabana do Escritor',
    description: 'Onde histórias, ideias e mundos inteiros tomam forma nas palavras.',
    domain: 'creation',
    type: 'regular',
    x: 10, y: 61,
    revealXP: 100,
    icon: '✍️',
  },
  {
    id: 'creation-music',
    name: 'Sala de Música',
    description: 'Harmonias que expressam o que as palavras não conseguem alcançar.',
    domain: 'creation',
    type: 'regular',
    x: 24, y: 71,
    revealXP: 200,
    icon: '🎵',
  },

  // ── Challenge Zones ───────────────────────────────────────────────────────
  {
    id: 'challenge-procrastination',
    name: 'Labirinto da Procrastinação',
    description: 'Uma névoa mental traiçoeira que distorce o tempo e adia o essencial.',
    domain: 'mind',
    type: 'challenge',
    x: 46, y: 31,
    revealXP: 50,
    icon: '🌀',
  },
  {
    id: 'challenge-burnout',
    name: 'Pântano do Esgotamento',
    description: 'Território sombrio de quem ignora os próprios limites por tempo demais.',
    domain: 'body',
    type: 'challenge',
    x: 54, y: 68,
    revealXP: 50,
    icon: '🌑',
  },
]

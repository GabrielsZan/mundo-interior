// POI images
import alma1Img    from '@/assets/pois/alma-1_jardim_da_gratidao.png'
import alma2Img    from '@/assets/pois/alma-2_templo_de_meditacao.png'
import alma3Img    from '@/assets/pois/alma-3_praca_social.png'
import alma4Img    from '@/assets/pois/alma-4_santuario_da_empatia.png'
import alma5Img    from '@/assets/pois/alma-5_santuario_do_silencio.png'
import corpo1Img   from '@/assets/pois/corpo-1_campo_de_treino.png'
import corpo2Img   from '@/assets/pois/corpo-2_jardim_nutricional.png'
import corpo3Img   from '@/assets/pois/corpo-3_santuario_do_descanso.png'
import corpo4Img   from '@/assets/pois/corpo-4_santuario_da_postura.png'
import corpo5Img   from '@/assets/pois/corpo-5_fonte_de_cura.png'
import criacao1Img from '@/assets/pois/criacao-1_guilda_dos_escritores.png'
import criacao2Img from '@/assets/pois/criacao-2_estudio_de_arte.png'
import criacao3Img from '@/assets/pois/criacao-3_salao_de_musica.png'
import criacao4Img from '@/assets/pois/criacao-4_oficina_de_criacao.png'
import criacao5Img from '@/assets/pois/criacao-5_laboratorio_de_inovacao.png'
import mente1Img   from '@/assets/pois/mente-1_grande_biblioteca.png'
import mente2Img   from '@/assets/pois/mente-2_torre_do_foco.png'
import mente3Img   from '@/assets/pois/mente-3_observatorio_celestial.png'
import mente4Img   from '@/assets/pois/mente-4_templo_de_estudo.png'
import mente5Img   from '@/assets/pois/mente-5_arquivo_da_memoria.png'
import citadelImg  from '@/assets/pois/citadel.png'

export type MapDomain = 'mente' | 'corpo' | 'alma' | 'criacao'
export type POIType = 'regular' | 'challenge' | 'citadel'

export interface POI {
  id: string
  name: string
  domain: MapDomain
  type: POIType
  description: string
  icon: string       // emoji fallback (always present)
  image?: string     // custom illustration URL
  x: number          // percentage 0-100 of MAP_W
  y: number          // percentage 0-100 of MAP_H
  revealXP: number   // domainXP needed to reveal (0 = always visible)
}

export const MAP_W = 3000
export const MAP_H = 2000

export const mapPOIs: POI[] = [
  // === CIDADELA (Centro — ruínas) ===
  {
    id: 'citadel',
    name: 'Cidadela Interior',
    domain: 'mente',
    type: 'citadel',
    description: 'O núcleo do seu mundo interior. Reconstrua-a conforme evolui.',
    icon: '🏰',
    image: citadelImg,
    x: 50.0,
    y: 60.0,
    revealXP: 0,
  },

  // === MENTE (Norte — montanhas nevadas e pinheiros) ===
  {
    id: 'mente-1',
    name: 'Grande Biblioteca',
    domain: 'mente',
    type: 'regular',
    description: 'Centro de aprendizado e aquisição de conhecimento.',
    icon: '📚',
    image: mente1Img,
    x: 22.0,
    y: 14.0,
    revealXP: 0,
  },
  {
    id: 'mente-2',
    name: 'Torre do Foco',
    domain: 'mente',
    type: 'regular',
    description: 'Concentração profunda e produtividade.',
    icon: '🗼',
    image: mente2Img,
    x: 38.0,
    y: 9.5,
    revealXP: 50,
  },
  {
    id: 'mente-3',
    name: 'Observatório Celestial',
    domain: 'mente',
    type: 'regular',
    description: 'Visão de longo prazo, planejamento e metas.',
    icon: '🔭',
    image: mente3Img,
    x: 55.0,
    y: 13.5,
    revealXP: 100,
  },
  {
    id: 'mente-4',
    name: 'Templo de Estudo',
    domain: 'mente',
    type: 'regular',
    description: 'Disciplina intelectual e prática constante.',
    icon: '🎓',
    image: mente4Img,
    x: 30.0,
    y: 27.0,
    revealXP: 150,
  },
  {
    id: 'mente-5',
    name: 'Arquivo da Memória',
    domain: 'mente',
    type: 'regular',
    description: 'Retenção, revisão e memorização.',
    icon: '🧠',
    image: mente5Img,
    x: 14.0,
    y: 30.0,
    revealXP: 200,
  },

  // === ALMA (Nordeste — cerejeiras e rio) ===
  {
    id: 'alma-1',
    name: 'Jardim da Gratidão',
    domain: 'alma',
    type: 'regular',
    description: 'Cultive emoções positivas e gratidão.',
    icon: '🌸',
    image: alma1Img,
    x: 73.0,
    y: 12.0,
    revealXP: 0,
  },
  {
    id: 'alma-2',
    name: 'Templo de Meditação',
    domain: 'alma',
    type: 'regular',
    description: 'Consciência plena e meditação.',
    icon: '🧘',
    image: alma2Img,
    x: 85.5,
    y: 21.0,
    revealXP: 50,
  },
  {
    id: 'alma-3',
    name: 'Praça Social',
    domain: 'alma',
    type: 'regular',
    description: 'Conexões sociais e interação.',
    icon: '🤝',
    image: alma3Img,
    x: 78.0,
    y: 34.0,
    revealXP: 100,
  },
  {
    id: 'alma-4',
    name: 'Santuário da Empatia',
    domain: 'alma',
    type: 'regular',
    description: 'Escuta ativa e relações humanas.',
    icon: '💙',
    image: alma4Img,
    x: 88.5,
    y: 44.0,
    revealXP: 150,
  },
  {
    id: 'alma-5',
    name: 'Santuário do Silêncio',
    domain: 'alma',
    type: 'regular',
    description: 'Introspecção e solitude reflexiva.',
    icon: '🕊️',
    image: alma5Img,
    x: 65.0,
    y: 39.0,
    revealXP: 200,
  },

  // === CORPO (Sul — planícies abertas) ===
  {
    id: 'corpo-1',
    name: 'Campo de Treino',
    domain: 'corpo',
    type: 'regular',
    description: 'Exercícios físicos e atividade.',
    icon: '💪',
    image: corpo1Img,
    x: 40.0,
    y: 65.0,
    revealXP: 0,
  },
  {
    id: 'corpo-2',
    name: 'Jardim Nutricional',
    domain: 'corpo',
    type: 'regular',
    description: 'Alimentação saudável e dieta.',
    icon: '🥗',
    image: corpo2Img,
    x: 55.0,
    y: 70.5,
    revealXP: 50,
  },
  {
    id: 'corpo-3',
    name: 'Santuário do Descanso',
    domain: 'corpo',
    type: 'regular',
    description: 'Recuperação, sono e pausas.',
    icon: '😴',
    image: corpo3Img,
    x: 28.0,
    y: 73.5,
    revealXP: 100,
  },
  {
    id: 'corpo-4',
    name: 'Santuário da Postura',
    domain: 'corpo',
    type: 'regular',
    description: 'Consciência corporal e alongamento.',
    icon: '🧍',
    image: corpo4Img,
    x: 68.0,
    y: 73.0,
    revealXP: 150,
  },
  {
    id: 'corpo-5',
    name: 'Fonte de Cura',
    domain: 'corpo',
    type: 'regular',
    description: 'Hidratação e regeneração.',
    icon: '⛲',
    image: corpo5Img,
    x: 48.0,
    y: 84.5,
    revealXP: 200,
  },

  // === CRIAÇÃO (Oeste — floresta de outono) ===
  {
    id: 'criacao-1',
    name: 'Guilda dos Escritores',
    domain: 'criacao',
    type: 'regular',
    description: 'Escrita criativa e journaling.',
    icon: '✍️',
    image: criacao1Img,
    x: 10.0,
    y: 42.0,
    revealXP: 0,
  },
  {
    id: 'criacao-2',
    name: 'Estúdio de Arte',
    domain: 'criacao',
    type: 'regular',
    description: 'Expressão visual e desenho.',
    icon: '🎨',
    image: criacao2Img,
    x: 17.5,
    y: 53.0,
    revealXP: 50,
  },
  {
    id: 'criacao-3',
    name: 'Salão de Música',
    domain: 'criacao',
    type: 'regular',
    description: 'Prática musical e expressão sonora.',
    icon: '🎵',
    image: criacao3Img,
    x: 7.5,
    y: 64.0,
    revealXP: 100,
  },
  {
    id: 'criacao-4',
    name: 'Oficina de Criação',
    domain: 'criacao',
    type: 'regular',
    description: 'Produção prática — construir e criar.',
    icon: '🔨',
    image: criacao4Img,
    x: 22.0,
    y: 62.0,
    revealXP: 150,
  },
  {
    id: 'criacao-5',
    name: 'Laboratório de Inovação',
    domain: 'criacao',
    type: 'regular',
    description: 'Brainstorming e experimentação.',
    icon: '💡',
    image: criacao5Img,
    x: 14.5,
    y: 73.5,
    revealXP: 200,
  },

  // === CHALLENGE ZONES ===
  {
    id: 'challenge-mente',
    name: 'Vale da Procrastinação',
    domain: 'mente',
    type: 'challenge',
    description: 'Névoa densa que representa a dificuldade em começar tarefas.',
    icon: '⚠️',
    x: 42.0,
    y: 22.0,
    revealXP: 50,
  },
  {
    id: 'challenge-alma',
    name: 'Névoa da Dúvida',
    domain: 'alma',
    type: 'challenge',
    description: 'Visibilidade reduzida que representa insegurança.',
    icon: '⚠️',
    x: 72.5,
    y: 28.0,
    revealXP: 50,
  },
  {
    id: 'challenge-corpo',
    name: 'Deserto do Burnout',
    domain: 'corpo',
    type: 'challenge',
    description: 'Ambiente seco e vazio que representa exaustão.',
    icon: '⚠️',
    x: 60.0,
    y: 59.0,
    revealXP: 50,
  },
  {
    id: 'challenge-criacao',
    name: 'Floresta do Perfeccionismo',
    domain: 'criacao',
    type: 'challenge',
    description: 'Floresta densa e difícil que representa bloqueio criativo.',
    icon: '⚠️',
    x: 10.0,
    y: 78.0,
    revealXP: 50,
  },
]

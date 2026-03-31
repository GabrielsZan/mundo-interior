// ── Weekly Events ─────────────────────────────────────────────────────────────
// Pool of rotating weekly challenges. Active event = pool[isoWeek % pool.length]

export interface IWeeklyEvent {
  id:          string
  name:        string
  description: string
  domain:      'mente' | 'corpo' | 'alma' | 'criacao' | 'todas'
  icon:        string
  requirement: number   // total missions to complete this week
  xpBonus:     number
  rewardName:  string
  rewardIcon:  string
  rewardDesc:  string
}

export const WEEKLY_EVENTS: IWeeklyEvent[] = [
  {
    id: 'mente-foco',
    name: 'Semana da Mente Clara',
    description: 'A névoa do dia a dia obscurece o pensamento. Esta semana, afie sua mente com disciplina e intenção.',
    domain: 'mente',
    icon: '🧠',
    requirement: 5,
    xpBonus: 150,
    rewardName: 'Cristal de Sabedoria',
    rewardIcon: '💎',
    rewardDesc: 'Forjado na clareza de uma mente disciplinada.',
  },
  {
    id: 'corpo-forca',
    name: 'Semana do Guerreiro',
    description: 'O corpo é o templo da alma. Movimente-se, fortaleça-se e honre sua vitalidade esta semana.',
    domain: 'corpo',
    icon: '⚔️',
    requirement: 5,
    xpBonus: 150,
    rewardName: 'Escudo do Vigor',
    rewardIcon: '🛡️',
    rewardDesc: 'Moldado pelo suor de quem nunca desistiu.',
  },
  {
    id: 'alma-presenca',
    name: 'Semana da Alma Presente',
    description: 'A conexão com o outro e consigo mesmo é a verdadeira riqueza. Cultive presença e gratidão.',
    domain: 'alma',
    icon: '🌙',
    requirement: 5,
    xpBonus: 150,
    rewardName: 'Lanterna da Serenidade',
    rewardIcon: '🪔',
    rewardDesc: 'Ilumina o caminho mesmo nas noites mais escuras.',
  },
  {
    id: 'criacao-fluxo',
    name: 'Semana do Criador',
    description: 'Crie sem julgamento. Esta semana, deixe as ideias fluírem e tome forma no mundo.',
    domain: 'criacao',
    icon: '✨',
    requirement: 5,
    xpBonus: 150,
    rewardName: 'Pena do Artesão',
    rewardIcon: '🪶',
    rewardDesc: 'Escreve realidades que ainda não existem.',
  },
  {
    id: 'todas-equilíbrio',
    name: 'Semana do Equilíbrio',
    description: 'Um explorador completo não negligencia nenhum domínio. Esta semana, cuide de todos os aspectos da sua jornada.',
    domain: 'todas',
    icon: '⚖️',
    requirement: 7,
    xpBonus: 200,
    rewardName: 'Medalhão do Equilíbrio',
    rewardIcon: '🏅',
    rewardDesc: 'Concedido apenas a quem cultivou todos os domínios.',
  },
  {
    id: 'mente-reflexao',
    name: 'Semana da Reflexão Profunda',
    description: 'Antes de agir, compreenda. Esta semana, mergulhe fundo no conhecimento e na autoanálise.',
    domain: 'mente',
    icon: '📚',
    requirement: 6,
    xpBonus: 160,
    rewardName: 'Tomo dos Segredos',
    rewardIcon: '📜',
    rewardDesc: 'Contém sabedoria que só quem persiste encontra.',
  },
  {
    id: 'corpo-movimento',
    name: 'Semana em Movimento',
    description: 'Energia não gasta apodrece. Esta semana, mova-se: o corpo em ação libera o espírito.',
    domain: 'corpo',
    icon: '🏃',
    requirement: 6,
    xpBonus: 160,
    rewardName: 'Botas do Caminhante',
    rewardIcon: '👢',
    rewardDesc: 'Usadas por quem nunca parou de seguir em frente.',
  },
  {
    id: 'alma-conexao',
    name: 'Semana das Conexões',
    description: 'Nenhum herói cresce sozinho. Esta semana, fortaleça os laços que sustentam sua jornada.',
    domain: 'alma',
    icon: '🤝',
    requirement: 6,
    xpBonus: 160,
    rewardName: 'Amuleto dos Vínculos',
    rewardIcon: '💫',
    rewardDesc: 'Cada vínculo genuíno adiciona força a este amuleto.',
  },
  {
    id: 'todas-superacao',
    name: 'Semana da Superação',
    description: 'Os maiores tesouros estão além do limite de ontem. Esta semana, vá além.',
    domain: 'todas',
    icon: '🔥',
    requirement: 8,
    xpBonus: 250,
    rewardName: 'Chama da Superação',
    rewardIcon: '🕯️',
    rewardDesc: 'Arde mais forte quanto maior o vento que a enfrenta.',
  },
  {
    id: 'criacao-expressao',
    name: 'Semana da Expressão',
    description: 'Você carrega histórias que o mundo precisa ouvir. Esta semana, expresse-se sem filtros.',
    domain: 'criacao',
    icon: '🎨',
    requirement: 6,
    xpBonus: 160,
    rewardName: 'Paleta do Criador',
    rewardIcon: '🖌️',
    rewardDesc: 'Com ela, qualquer superfície se torna arte.',
  },
  {
    id: 'mente-intencao',
    name: 'Semana da Intenção',
    description: 'Ações sem intenção são folhas ao vento. Esta semana, aja com propósito claro em cada passo.',
    domain: 'mente',
    icon: '🎯',
    requirement: 5,
    xpBonus: 140,
    rewardName: 'Bússola Interior',
    rewardIcon: '🧭',
    rewardDesc: 'Sempre aponta para o verdadeiro norte de quem a porta.',
  },
  {
    id: 'todas-consistencia',
    name: 'Semana da Consistência',
    description: 'Grandes mudanças nascem de pequenos atos repetidos. Mostre presença todos os dias esta semana.',
    domain: 'todas',
    icon: '🗓️',
    requirement: 7,
    xpBonus: 220,
    rewardName: 'Pedra da Perseverança',
    rewardIcon: '🪨',
    rewardDesc: 'Cada dia de consistência adiciona uma camada a esta pedra.',
  },
]

function getISOWeek(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
}

export function getWeekKey(date: Date = new Date()): string {
  return `${date.getFullYear()}-W${getISOWeek(date).toString().padStart(2, '0')}`
}

export function getCurrentWeekEvent(): IWeeklyEvent {
  const week = getISOWeek(new Date())
  return WEEKLY_EVENTS[week % WEEKLY_EVENTS.length]
}

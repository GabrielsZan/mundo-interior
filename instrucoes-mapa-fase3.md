# Instruções para Refatorar o Mapa — Fase 3

## Contexto
O mapa atual usa MapTerrain SVG/CSS que ficou visualmente ruim. Vamos substituir por uma imagem de background pintada (watercolor Ghibli) com POIs posicionados como overlays programáticos.

## Passo 1: Adicionar a imagem
Coloque o arquivo `map-background.png` em `src/assets/map-background.png`
A imagem tem 1536x1024 pixels, aspect ratio ~3:2.

## Passo 2: Atualizar mapData.ts
Substitua TODOS os POIs atuais por estes. As coordenadas são em percentual (x%, y%) da imagem 1536x1024.
Cada POI tem: id, name, domain, type, description, icon, x (%), y (%).

```typescript
export interface POI {
  id: string;
  name: string;
  domain: 'mente' | 'corpo' | 'alma' | 'criacao';
  type: 'regular' | 'challenge' | 'citadel';
  description: string;
  icon: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
}

export const mapPOIs: POI[] = [
  // === CIDADELA (Centro) ===
  {
    id: 'citadel',
    name: 'Cidadela Interior',
    domain: 'mente',
    type: 'citadel',
    description: 'O núcleo do seu mundo interior. Reconstrua-a conforme evolui.',
    icon: '🏰',
    x: 50.0,
    y: 36.1,
  },

  // === MENTE (Norte) — 5 POIs ===
  {
    id: 'mente-1',
    name: 'Grande Biblioteca',
    domain: 'mente',
    type: 'regular',
    description: 'Centro de aprendizado e aquisição de conhecimento.',
    icon: '📚',
    x: 24.7,
    y: 19.0,
  },
  {
    id: 'mente-2',
    name: 'Torre do Foco',
    domain: 'mente',
    type: 'regular',
    description: 'Concentração profunda e produtividade.',
    icon: '🗼',
    x: 40.4,
    y: 15.1,
  },
  {
    id: 'mente-3',
    name: 'Observatório Celestial',
    domain: 'mente',
    type: 'regular',
    description: 'Visão de longo prazo, planejamento e metas.',
    icon: '🔭',
    x: 61.8,
    y: 12.7,
  },
  {
    id: 'mente-4',
    name: 'Templo de Estudo',
    domain: 'mente',
    type: 'regular',
    description: 'Disciplina intelectual e prática constante.',
    icon: '🎓',
    x: 35.2,
    y: 28.3,
  },
  {
    id: 'mente-5',
    name: 'Arquivo da Memória',
    domain: 'mente',
    type: 'regular',
    description: 'Retenção, revisão e memorização.',
    icon: '🧠',
    x: 20.2,
    y: 33.2,
  },

  // === ALMA (Leste) — 5 POIs ===
  {
    id: 'alma-1',
    name: 'Jardim da Gratidão',
    domain: 'alma',
    type: 'regular',
    description: 'Cultive emoções positivas e gratidão.',
    icon: '🌸',
    x: 78.1,
    y: 19.5,
  },
  {
    id: 'alma-2',
    name: 'Templo de Meditação',
    domain: 'alma',
    type: 'regular',
    description: 'Consciência plena e meditação.',
    icon: '🧘',
    x: 87.9,
    y: 31.3,
  },
  {
    id: 'alma-3',
    name: 'Praça Social',
    domain: 'alma',
    type: 'regular',
    description: 'Conexões sociais e interação.',
    icon: '🤝',
    x: 71.6,
    y: 39.1,
  },
  {
    id: 'alma-4',
    name: 'Santuário da Empatia',
    domain: 'alma',
    type: 'regular',
    description: 'Escuta ativa e relações humanas.',
    icon: '💙',
    x: 84.6,
    y: 48.8,
  },
  {
    id: 'alma-5',
    name: 'Santuário do Silêncio',
    domain: 'alma',
    type: 'regular',
    description: 'Introspecção e solitude reflexiva.',
    icon: '🕊️',
    x: 93.1,
    y: 60.5,
  },

  // === CORPO (Sul) — 5 POIs ===
  {
    id: 'corpo-1',
    name: 'Campo de Treino',
    domain: 'corpo',
    type: 'regular',
    description: 'Exercícios físicos e atividade.',
    icon: '💪',
    x: 37.8,
    y: 66.4,
  },
  {
    id: 'corpo-2',
    name: 'Jardim Nutricional',
    domain: 'corpo',
    type: 'regular',
    description: 'Alimentação saudável e dieta.',
    icon: '🥗',
    x: 54.0,
    y: 70.3,
  },
  {
    id: 'corpo-3',
    name: 'Santuário do Descanso',
    domain: 'corpo',
    type: 'regular',
    description: 'Recuperação, sono e pausas.',
    icon: '😴',
    x: 26.0,
    y: 73.2,
  },
  {
    id: 'corpo-4',
    name: 'Santuário da Postura',
    domain: 'corpo',
    type: 'regular',
    description: 'Consciência corporal e alongamento.',
    icon: '🧍',
    x: 68.4,
    y: 75.2,
  },
  {
    id: 'corpo-5',
    name: 'Fonte de Cura',
    domain: 'corpo',
    type: 'regular',
    description: 'Hidratação e regeneração.',
    icon: '⛲',
    x: 45.6,
    y: 83.0,
  },

  // === CRIAÇÃO (Oeste) — 5 POIs ===
  {
    id: 'criacao-1',
    name: 'Guilda dos Escritores',
    domain: 'criacao',
    type: 'regular',
    description: 'Escrita criativa e journaling.',
    icon: '✍️',
    x: 11.1,
    y: 38.1,
  },
  {
    id: 'criacao-2',
    name: 'Estúdio de Arte',
    domain: 'criacao',
    type: 'regular',
    description: 'Expressão visual e desenho.',
    icon: '🎨',
    x: 16.3,
    y: 52.7,
  },
  {
    id: 'criacao-3',
    name: 'Salão de Música',
    domain: 'criacao',
    type: 'regular',
    description: 'Prática musical e expressão sonora.',
    icon: '🎵',
    x: 7.8,
    y: 66.4,
  },
  {
    id: 'criacao-4',
    name: 'Oficina de Criação',
    domain: 'criacao',
    type: 'regular',
    description: 'Produção prática — construir e criar.',
    icon: '🔨',
    x: 22.8,
    y: 60.5,
  },
  {
    id: 'criacao-5',
    name: 'Laboratório de Inovação',
    domain: 'criacao',
    type: 'regular',
    description: 'Brainstorming e experimentação.',
    icon: '💡',
    x: 31.3,
    y: 46.9,
  },

  // === CHALLENGE ZONES (4, uma por região) ===
  {
    id: 'challenge-mente',
    name: 'Vale da Procrastinação',
    domain: 'mente',
    type: 'challenge',
    description: 'Névoa densa que representa a dificuldade em começar tarefas.',
    icon: '⚠️',
    x: 48.8,
    y: 23.4,
  },
  {
    id: 'challenge-corpo',
    name: 'Deserto do Burnout',
    domain: 'corpo',
    type: 'challenge',
    description: 'Ambiente seco e vazio que representa exaustão.',
    icon: '⚠️',
    x: 78.1,
    y: 66.4,
  },
  {
    id: 'challenge-alma',
    name: 'Névoa da Dúvida',
    domain: 'alma',
    type: 'challenge',
    description: 'Visibilidade reduzida que representa insegurança.',
    icon: '⚠️',
    x: 64.5,
    y: 51.8,
  },
  {
    id: 'challenge-criacao',
    name: 'Floresta do Perfeccionismo',
    domain: 'criacao',
    type: 'challenge',
    description: 'Floresta densa e difícil que representa bloqueio criativo.',
    icon: '⚠️',
    x: 13.0,
    y: 80.1,
  },
];
```

## Passo 3: Refatorar MapPage.tsx
- Remover o componente MapTerrain SVG/CSS completamente
- Usar a imagem `map-background.png` como background do container do mapa
- O container do mapa deve ser 1536x1024 (ou proporcional) com a imagem cobrindo 100%
- POIs são posicionados com `position: absolute; left: {x}%; top: {y}%`
- Manter o FogCanvas overlay como está (fog sépia)
- Manter o pan com pointer capture como está
- Manter o POISheet como está

## Passo 4: Refinar POIMarker visual
Os marcadores devem ficar bonitos sobre a arte watercolor:
- POI regular: círculo de 36px com fundo semi-transparente na cor do domínio, borda sólida, emoji centralizado
- POI challenge: círculo com borda dashed vermelha, fundo escuro semi-transparente
- Cidadela: círculo maior (48px) com borda dourada, glow dourado
- Label abaixo com text-shadow de pergaminho para legibilidade
- Cores dos domínios: mente=#5B8C5A, corpo=#C67B5C, alma=#6BA3B7, criacao=#B8976A
- Cor challenge: #C2675A
- Cor cidadela: #D4A843

## Passo 5: Ajustar FogCanvas
- A névoa sépia `rgba(62,42,18,0.72)` está boa, manter
- Garantir que os círculos de revelação alinham com as coordenadas percentuais dos POIs
- Revelação deve usar as mesmas coordenadas x%, y% convertidas para pixels do canvas

## O que NÃO mudar:
- mapStore.ts (Zustand + persist) — manter como está
- POISheet.tsx — manter como está
- Lógica de revelação por XP — manter como está
- Sistema de pan — manter como está

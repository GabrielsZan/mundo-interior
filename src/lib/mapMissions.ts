import type { MissionType } from '@/types'
import type { MapDomain } from '@/features/map/mapData'

export interface IMapMission {
  id:          string
  poiId:       string
  name:        string
  description: string
  type:        MissionType
  domain:      MapDomain
  xpGeneral:   number
  xpDomain:    number
  order:       number
}

export const ALL_MAP_MISSIONS: IMapMission[] = [
  // ── MENTE-1 ──────────────────────────────────────────────────────────────
  {
    id: 'mente-1-m1', poiId: 'mente-1',
    name: 'Leitura Inicial',
    description: 'Leia 30 páginas de qualquer livro.',
    type: 'main', domain: 'mente', xpGeneral: 100, xpDomain: 100, order: 1,
  },
  {
    id: 'mente-1-m2', poiId: 'mente-1',
    name: 'Resumo do Aprendiz',
    description: 'Escreva um resumo de 1 parágrafo sobre o que leu.',
    type: 'main', domain: 'mente', xpGeneral: 100, xpDomain: 100, order: 2,
  },
  {
    id: 'mente-1-m3', poiId: 'mente-1',
    name: 'Lista de Leitura',
    description: 'Crie uma lista com 5 livros que quer ler este ano.',
    type: 'main', domain: 'mente', xpGeneral: 80, xpDomain: 80, order: 3,
  },

  // ── MENTE-2 ──────────────────────────────────────────────────────────────
  {
    id: 'mente-2-m1', poiId: 'mente-2',
    name: 'Sessão Pomodoro',
    description: 'Complete uma sessão de 25 minutos de foco sem distrações.',
    type: 'main', domain: 'mente', xpGeneral: 100, xpDomain: 100, order: 1,
  },
  {
    id: 'mente-2-m2', poiId: 'mente-2',
    name: 'Dieta Digital',
    description: 'Passe 2 horas consecutivas sem redes sociais.',
    type: 'main', domain: 'mente', xpGeneral: 120, xpDomain: 120, order: 2,
  },
  {
    id: 'mente-2-m3', poiId: 'mente-2',
    name: 'Bloco de Produtividade',
    description: 'Defina 3 tarefas prioritárias do dia e complete todas.',
    type: 'main', domain: 'mente', xpGeneral: 120, xpDomain: 120, order: 3,
  },
  {
    id: 'mente-2-m4', poiId: 'mente-2',
    name: 'Ritual de Foco',
    description: 'Crie uma rotina de início de trabalho e execute-a.',
    type: 'main', domain: 'mente', xpGeneral: 100, xpDomain: 100, order: 4,
  },

  // ── MENTE-3 ──────────────────────────────────────────────────────────────
  {
    id: 'mente-3-m1', poiId: 'mente-3',
    name: 'Visão de Futuro',
    description: 'Escreva onde você quer estar em 5 anos (mínimo 200 palavras).',
    type: 'main', domain: 'mente', xpGeneral: 150, xpDomain: 150, order: 1,
  },
  {
    id: 'mente-3-m2', poiId: 'mente-3',
    name: 'Metas Trimestrais',
    description: 'Defina 3 metas concretas para os próximos 3 meses.',
    type: 'main', domain: 'mente', xpGeneral: 120, xpDomain: 120, order: 2,
  },
  {
    id: 'mente-3-m3', poiId: 'mente-3',
    name: 'Revisão Semanal',
    description: 'Faça uma revisão do que conquistou esta semana e o que falta.',
    type: 'main', domain: 'mente', xpGeneral: 100, xpDomain: 100, order: 3,
  },

  // ── CHALLENGE-MENTE ───────────────────────────────────────────────────────
  {
    id: 'challenge-mente-m1', poiId: 'challenge-mente',
    name: 'Confronto Inicial',
    description: 'Identifique 3 tarefas que você está adiando e escreva por quê.',
    type: 'epic', domain: 'mente', xpGeneral: 150, xpDomain: 150, order: 1,
  },
  {
    id: 'challenge-mente-m2', poiId: 'challenge-mente',
    name: 'Regra dos 2 Minutos',
    description: 'Para cada tarefa adiada: se leva menos de 2 min, faça agora.',
    type: 'epic', domain: 'mente', xpGeneral: 130, xpDomain: 130, order: 2,
  },
  {
    id: 'challenge-mente-m3', poiId: 'challenge-mente',
    name: 'Quebrando a Inércia',
    description: 'Escolha a tarefa que mais adia e trabalhe nela por 15 minutos.',
    type: 'epic', domain: 'mente', xpGeneral: 180, xpDomain: 180, order: 3,
  },

  // ── MENTE-4 ──────────────────────────────────────────────────────────────
  {
    id: 'mente-4-m1', poiId: 'mente-4',
    name: 'Estudo Dirigido',
    description: 'Estude um tema novo por 45 minutos com anotações.',
    type: 'main', domain: 'mente', xpGeneral: 130, xpDomain: 130, order: 1,
  },
  {
    id: 'mente-4-m2', poiId: 'mente-4',
    name: 'Ensinando para Aprender',
    description: 'Explique um conceito que aprendeu para alguém (ou grave um áudio).',
    type: 'main', domain: 'mente', xpGeneral: 140, xpDomain: 140, order: 2,
  },
  {
    id: 'mente-4-m3', poiId: 'mente-4',
    name: 'Mapa Mental',
    description: 'Crie um mapa mental de um tema que está estudando.',
    type: 'main', domain: 'mente', xpGeneral: 120, xpDomain: 120, order: 3,
  },
  {
    id: 'mente-4-m4', poiId: 'mente-4',
    name: 'Disciplina do Saber',
    description: 'Estude o mesmo tema por 3 dias seguidos, mínimo 30 min cada.',
    type: 'epic', domain: 'mente', xpGeneral: 150, xpDomain: 150, order: 4,
  },

  // ── MENTE-5 ──────────────────────────────────────────────────────────────
  {
    id: 'mente-5-m1', poiId: 'mente-5',
    name: 'Revisão Espaçada',
    description: 'Revise anotações de algo que estudou há mais de 1 semana.',
    type: 'main', domain: 'mente', xpGeneral: 130, xpDomain: 130, order: 1,
  },
  {
    id: 'mente-5-m2', poiId: 'mente-5',
    name: 'Flashcards',
    description: 'Crie 10 flashcards sobre um tema que quer memorizar.',
    type: 'main', domain: 'mente', xpGeneral: 120, xpDomain: 120, order: 2,
  },
  {
    id: 'mente-5-m3', poiId: 'mente-5',
    name: 'Diário de Aprendizado',
    description: 'Escreva 3 coisas novas que aprendeu hoje.',
    type: 'main', domain: 'mente', xpGeneral: 100, xpDomain: 100, order: 3,
  },

  // ── ALMA-1 ───────────────────────────────────────────────────────────────
  {
    id: 'alma-1-m1', poiId: 'alma-1',
    name: 'Três Gratidões',
    description: 'Escreva 3 coisas pelas quais é grato hoje.',
    type: 'main', domain: 'alma', xpGeneral: 80, xpDomain: 80, order: 1,
  },
  {
    id: 'alma-1-m2', poiId: 'alma-1',
    name: 'Carta de Agradecimento',
    description: 'Escreva uma mensagem de agradecimento para alguém importante.',
    type: 'main', domain: 'alma', xpGeneral: 120, xpDomain: 120, order: 2,
  },
  {
    id: 'alma-1-m3', poiId: 'alma-1',
    name: 'Olhar Positivo',
    description: 'No final do dia, liste 3 momentos bons que aconteceram.',
    type: 'main', domain: 'alma', xpGeneral: 80, xpDomain: 80, order: 3,
  },

  // ── ALMA-2 ───────────────────────────────────────────────────────────────
  {
    id: 'alma-2-m1', poiId: 'alma-2',
    name: 'Primeira Meditação',
    description: 'Medite por 5 minutos em silêncio ou com app guiado.',
    type: 'main', domain: 'alma', xpGeneral: 100, xpDomain: 100, order: 1,
  },
  {
    id: 'alma-2-m2', poiId: 'alma-2',
    name: 'Respiração Consciente',
    description: 'Faça 10 respirações profundas com olhos fechados antes de dormir.',
    type: 'main', domain: 'alma', xpGeneral: 80, xpDomain: 80, order: 2,
  },
  {
    id: 'alma-2-m3', poiId: 'alma-2',
    name: 'Meditação Expandida',
    description: 'Complete uma meditação de 15 minutos.',
    type: 'main', domain: 'alma', xpGeneral: 130, xpDomain: 130, order: 3,
  },
  {
    id: 'alma-2-m4', poiId: 'alma-2',
    name: 'Ritual Meditativo',
    description: 'Medite por 3 dias consecutivos (qualquer duração).',
    type: 'epic', domain: 'alma', xpGeneral: 150, xpDomain: 150, order: 4,
  },

  // ── ALMA-3 ───────────────────────────────────────────────────────────────
  {
    id: 'alma-3-m1', poiId: 'alma-3',
    name: 'Conversa Genuína',
    description: 'Tenha uma conversa de pelo menos 15 minutos com alguém sem celular.',
    type: 'main', domain: 'alma', xpGeneral: 120, xpDomain: 120, order: 1,
  },
  {
    id: 'alma-3-m2', poiId: 'alma-3',
    name: 'Reconexão',
    description: 'Mande uma mensagem para alguém com quem não fala há tempo.',
    type: 'main', domain: 'alma', xpGeneral: 100, xpDomain: 100, order: 2,
  },
  {
    id: 'alma-3-m3', poiId: 'alma-3',
    name: 'Presença Social',
    description: 'Participe de um encontro social (presencial ou virtual) por vontade própria.',
    type: 'main', domain: 'alma', xpGeneral: 130, xpDomain: 130, order: 3,
  },

  // ── CHALLENGE-ALMA ────────────────────────────────────────────────────────
  {
    id: 'challenge-alma-m1', poiId: 'challenge-alma',
    name: 'Mapeando Inseguranças',
    description: 'Escreva 3 inseguranças que te afetam e de onde elas vieram.',
    type: 'epic', domain: 'alma', xpGeneral: 160, xpDomain: 160, order: 1,
  },
  {
    id: 'challenge-alma-m2', poiId: 'challenge-alma',
    name: 'Voz Interior Gentil',
    description: 'Reescreva cada insegurança como se fosse um amigo falando com você.',
    type: 'epic', domain: 'alma', xpGeneral: 150, xpDomain: 150, order: 2,
  },
  {
    id: 'challenge-alma-m3', poiId: 'challenge-alma',
    name: 'Ação Apesar do Medo',
    description: 'Faça algo que te deixa inseguro mas que sabe que é bom para você.',
    type: 'epic', domain: 'alma', xpGeneral: 200, xpDomain: 200, order: 3,
  },

  // ── ALMA-4 ───────────────────────────────────────────────────────────────
  {
    id: 'alma-4-m1', poiId: 'alma-4',
    name: 'Escuta Ativa',
    description: 'Em uma conversa, apenas escute por 5 minutos sem interromper.',
    type: 'main', domain: 'alma', xpGeneral: 120, xpDomain: 120, order: 1,
  },
  {
    id: 'alma-4-m2', poiId: 'alma-4',
    name: 'Perspectiva Alheia',
    description: 'Escreva sobre uma situação recente do ponto de vista da outra pessoa.',
    type: 'main', domain: 'alma', xpGeneral: 140, xpDomain: 140, order: 2,
  },
  {
    id: 'alma-4-m3', poiId: 'alma-4',
    name: 'Ato de Bondade',
    description: 'Faça algo gentil por alguém sem que peçam.',
    type: 'main', domain: 'alma', xpGeneral: 100, xpDomain: 100, order: 3,
  },
  {
    id: 'alma-4-m4', poiId: 'alma-4',
    name: 'Check-in Emocional',
    description: 'Pergunte a alguém próximo como ele realmente está e escute com atenção.',
    type: 'main', domain: 'alma', xpGeneral: 130, xpDomain: 130, order: 4,
  },

  // ── ALMA-5 ───────────────────────────────────────────────────────────────
  {
    id: 'alma-5-m1', poiId: 'alma-5',
    name: 'Hora do Silêncio',
    description: 'Passe 30 minutos em silêncio total (sem música, sem telas).',
    type: 'main', domain: 'alma', xpGeneral: 130, xpDomain: 130, order: 1,
  },
  {
    id: 'alma-5-m2', poiId: 'alma-5',
    name: 'Caminhada Solitária',
    description: 'Faça uma caminhada sozinho, sem fones, prestando atenção ao redor.',
    type: 'main', domain: 'alma', xpGeneral: 120, xpDomain: 120, order: 2,
  },
  {
    id: 'alma-5-m3', poiId: 'alma-5',
    name: 'Autoconhecimento',
    description: 'Escreva uma reflexão honesta sobre como está se sentindo (mínimo 150 palavras).',
    type: 'main', domain: 'alma', xpGeneral: 140, xpDomain: 140, order: 3,
  },

  // ── CORPO-1 ──────────────────────────────────────────────────────────────
  {
    id: 'corpo-1-m1', poiId: 'corpo-1',
    name: 'Primeiro Treino',
    description: 'Faça 20 minutos de qualquer exercício físico.',
    type: 'main', domain: 'corpo', xpGeneral: 100, xpDomain: 100, order: 1,
  },
  {
    id: 'corpo-1-m2', poiId: 'corpo-1',
    name: 'Desafio Corporal',
    description: 'Faça 3 séries de: 10 flexões + 15 agachamentos + 30s prancha.',
    type: 'main', domain: 'corpo', xpGeneral: 120, xpDomain: 120, order: 2,
  },
  {
    id: 'corpo-1-m3', poiId: 'corpo-1',
    name: 'Movimento Diário',
    description: 'Faça pelo menos 15 minutos de atividade física por 3 dias seguidos.',
    type: 'epic', domain: 'corpo', xpGeneral: 150, xpDomain: 150, order: 3,
  },

  // ── CORPO-2 ──────────────────────────────────────────────────────────────
  {
    id: 'corpo-2-m1', poiId: 'corpo-2',
    name: 'Refeição Consciente',
    description: 'Coma uma refeição sem celular, prestando atenção no sabor.',
    type: 'main', domain: 'corpo', xpGeneral: 80, xpDomain: 80, order: 1,
  },
  {
    id: 'corpo-2-m2', poiId: 'corpo-2',
    name: 'Cozinheiro Interior',
    description: 'Prepare uma refeição saudável do zero.',
    type: 'main', domain: 'corpo', xpGeneral: 120, xpDomain: 120, order: 2,
  },
  {
    id: 'corpo-2-m3', poiId: 'corpo-2',
    name: 'Diário Alimentar',
    description: 'Registre tudo que comeu hoje e avalie o equilíbrio.',
    type: 'main', domain: 'corpo', xpGeneral: 100, xpDomain: 100, order: 3,
  },
  {
    id: 'corpo-2-m4', poiId: 'corpo-2',
    name: 'Hidratação',
    description: 'Beba pelo menos 2 litros de água hoje e registre.',
    type: 'main', domain: 'corpo', xpGeneral: 80, xpDomain: 80, order: 4,
  },

  // ── CORPO-3 ──────────────────────────────────────────────────────────────
  {
    id: 'corpo-3-m1', poiId: 'corpo-3',
    name: 'Rotina Noturna',
    description: 'Desligue telas 30 minutos antes de dormir.',
    type: 'main', domain: 'corpo', xpGeneral: 100, xpDomain: 100, order: 1,
  },
  {
    id: 'corpo-3-m2', poiId: 'corpo-3',
    name: 'Sono Reparador',
    description: 'Durma pelo menos 7 horas esta noite.',
    type: 'main', domain: 'corpo', xpGeneral: 120, xpDomain: 120, order: 2,
  },
  {
    id: 'corpo-3-m3', poiId: 'corpo-3',
    name: 'Pausa Restauradora',
    description: 'Tire um intervalo de 15 minutos durante o trabalho para descansar de verdade.',
    type: 'main', domain: 'corpo', xpGeneral: 100, xpDomain: 100, order: 3,
  },

  // ── CHALLENGE-CORPO ───────────────────────────────────────────────────────
  {
    id: 'challenge-corpo-m1', poiId: 'challenge-corpo',
    name: 'Inventário de Energia',
    description: 'Liste o que drena e o que recarrega sua energia no dia a dia.',
    type: 'epic', domain: 'corpo', xpGeneral: 150, xpDomain: 150, order: 1,
  },
  {
    id: 'challenge-corpo-m2', poiId: 'challenge-corpo',
    name: 'Dia de Nada',
    description: 'Passe um dia inteiro sem produtividade forçada — descanse de verdade.',
    type: 'epic', domain: 'corpo', xpGeneral: 180, xpDomain: 180, order: 2,
  },
  {
    id: 'challenge-corpo-m3', poiId: 'challenge-corpo',
    name: 'Limites Saudáveis',
    description: "Diga 'não' para um compromisso que não quer ou que drena energia.",
    type: 'epic', domain: 'corpo', xpGeneral: 160, xpDomain: 160, order: 3,
  },

  // ── CORPO-4 ──────────────────────────────────────────────────────────────
  {
    id: 'corpo-4-m1', poiId: 'corpo-4',
    name: 'Check Postural',
    description: 'Configure um alarme e corrija sua postura 5 vezes ao longo do dia.',
    type: 'main', domain: 'corpo', xpGeneral: 100, xpDomain: 100, order: 1,
  },
  {
    id: 'corpo-4-m2', poiId: 'corpo-4',
    name: 'Alongamento Matinal',
    description: 'Faça 10 minutos de alongamento ao acordar.',
    type: 'main', domain: 'corpo', xpGeneral: 110, xpDomain: 110, order: 2,
  },
  {
    id: 'corpo-4-m3', poiId: 'corpo-4',
    name: 'Consciência Corporal',
    description: 'Faça uma sessão de yoga ou alongamento guiado de 20 minutos.',
    type: 'main', domain: 'corpo', xpGeneral: 130, xpDomain: 130, order: 3,
  },
  {
    id: 'corpo-4-m4', poiId: 'corpo-4',
    name: 'Ergonomia',
    description: 'Ajuste seu espaço de trabalho e tire uma foto.',
    type: 'main', domain: 'corpo', xpGeneral: 120, xpDomain: 120, order: 4,
  },

  // ── CORPO-5 ──────────────────────────────────────────────────────────────
  {
    id: 'corpo-5-m1', poiId: 'corpo-5',
    name: 'Dia de Recuperação',
    description: 'Dedique um dia a atividades leves: caminhada, banho longo, leitura.',
    type: 'main', domain: 'corpo', xpGeneral: 130, xpDomain: 130, order: 1,
  },
  {
    id: 'corpo-5-m2', poiId: 'corpo-5',
    name: 'Auto Check-up',
    description: 'Faça uma avaliação honesta da sua saúde: sono, dores, energia, humor.',
    type: 'main', domain: 'corpo', xpGeneral: 120, xpDomain: 120, order: 2,
  },
  {
    id: 'corpo-5-m3', poiId: 'corpo-5',
    name: 'Ritual de Cura',
    description: 'Escolha um hábito de saúde que abandonou e retome-o hoje.',
    type: 'main', domain: 'corpo', xpGeneral: 140, xpDomain: 140, order: 3,
  },

  // ── CRIACAO-1 ────────────────────────────────────────────────────────────
  {
    id: 'criacao-1-m1', poiId: 'criacao-1',
    name: 'Escrita Livre',
    description: 'Escreva por 10 minutos sem parar sobre qualquer assunto.',
    type: 'main', domain: 'criacao', xpGeneral: 80, xpDomain: 80, order: 1,
  },
  {
    id: 'criacao-1-m2', poiId: 'criacao-1',
    name: 'Micro-conto',
    description: 'Escreva uma história curta de até 200 palavras.',
    type: 'main', domain: 'criacao', xpGeneral: 120, xpDomain: 120, order: 2,
  },
  {
    id: 'criacao-1-m3', poiId: 'criacao-1',
    name: 'Diário Criativo',
    description: 'Escreva uma entrada de diário descrevendo seu dia como se fosse ficção.',
    type: 'main', domain: 'criacao', xpGeneral: 100, xpDomain: 100, order: 3,
  },

  // ── CRIACAO-2 ────────────────────────────────────────────────────────────
  {
    id: 'criacao-2-m1', poiId: 'criacao-2',
    name: 'Rabisco do Dia',
    description: 'Desenhe algo — qualquer coisa — em 10 minutos.',
    type: 'main', domain: 'criacao', xpGeneral: 80, xpDomain: 80, order: 1,
  },
  {
    id: 'criacao-2-m2', poiId: 'criacao-2',
    name: 'Observação Visual',
    description: 'Desenhe um objeto que está na sua frente tentando ser fiel ao real.',
    type: 'main', domain: 'criacao', xpGeneral: 120, xpDomain: 120, order: 2,
  },
  {
    id: 'criacao-2-m3', poiId: 'criacao-2',
    name: 'Expressão Visual',
    description: 'Crie uma imagem que represente como está se sentindo.',
    type: 'main', domain: 'criacao', xpGeneral: 130, xpDomain: 130, order: 3,
  },
  {
    id: 'criacao-2-m4', poiId: 'criacao-2',
    name: 'Galeria Pessoal',
    description: 'Junte 3 criações visuais suas e reflita sobre sua evolução.',
    type: 'main', domain: 'criacao', xpGeneral: 100, xpDomain: 100, order: 4,
  },

  // ── CRIACAO-3 ────────────────────────────────────────────────────────────
  {
    id: 'criacao-3-m1', poiId: 'criacao-3',
    name: 'Escuta Profunda',
    description: 'Ouça um álbum inteiro sem fazer nada, só ouvindo.',
    type: 'main', domain: 'criacao', xpGeneral: 100, xpDomain: 100, order: 1,
  },
  {
    id: 'criacao-3-m2', poiId: 'criacao-3',
    name: 'Prática Musical',
    description: 'Pratique um instrumento ou cante por 20 minutos.',
    type: 'main', domain: 'criacao', xpGeneral: 120, xpDomain: 120, order: 2,
  },
  {
    id: 'criacao-3-m3', poiId: 'criacao-3',
    name: 'Playlist da Alma',
    description: 'Crie uma playlist de 10 músicas que representam momentos da sua vida.',
    type: 'main', domain: 'criacao', xpGeneral: 100, xpDomain: 100, order: 3,
  },

  // ── CHALLENGE-CRIACAO ─────────────────────────────────────────────────────
  {
    id: 'challenge-criacao-m1', poiId: 'challenge-criacao',
    name: 'Criação Imperfeita',
    description: 'Crie algo em 15 minutos e NÃO edite depois.',
    type: 'epic', domain: 'criacao', xpGeneral: 150, xpDomain: 150, order: 1,
  },
  {
    id: 'challenge-criacao-m2', poiId: 'challenge-criacao',
    name: 'Mostrar ao Mundo',
    description: 'Compartilhe algo que criou com pelo menos 1 pessoa.',
    type: 'epic', domain: 'criacao', xpGeneral: 160, xpDomain: 160, order: 2,
  },
  {
    id: 'challenge-criacao-m3', poiId: 'challenge-criacao',
    name: 'Abraçar o Rascunho',
    description: 'Comece um projeto novo aceitando que a primeira versão será ruim.',
    type: 'epic', domain: 'criacao', xpGeneral: 180, xpDomain: 180, order: 3,
  },

  // ── CRIACAO-4 ────────────────────────────────────────────────────────────
  {
    id: 'criacao-4-m1', poiId: 'criacao-4',
    name: 'Mãos à Obra',
    description: 'Construa, conserte ou monte algo físico.',
    type: 'main', domain: 'criacao', xpGeneral: 120, xpDomain: 120, order: 1,
  },
  {
    id: 'criacao-4-m2', poiId: 'criacao-4',
    name: 'Projeto Pessoal',
    description: 'Dedique 1 hora a um projeto criativo pessoal.',
    type: 'main', domain: 'criacao', xpGeneral: 140, xpDomain: 140, order: 2,
  },
  {
    id: 'criacao-4-m3', poiId: 'criacao-4',
    name: 'Finalizar Algo',
    description: 'Pegue algo inacabado e termine hoje.',
    type: 'epic', domain: 'criacao', xpGeneral: 150, xpDomain: 150, order: 3,
  },

  // ── CRIACAO-5 ────────────────────────────────────────────────────────────
  {
    id: 'criacao-5-m1', poiId: 'criacao-5',
    name: 'Brainstorm Selvagem',
    description: 'Escreva 20 ideias em 10 minutos (podem ser absurdas).',
    type: 'main', domain: 'criacao', xpGeneral: 100, xpDomain: 100, order: 1,
  },
  {
    id: 'criacao-5-m2', poiId: 'criacao-5',
    name: 'Experimento Criativo',
    description: 'Tente algo que nunca fez antes (nova receita, novo app, novo estilo).',
    type: 'main', domain: 'criacao', xpGeneral: 140, xpDomain: 140, order: 2,
  },
  {
    id: 'criacao-5-m3', poiId: 'criacao-5',
    name: 'Ideia em Ação',
    description: 'Escolha uma das suas ideias e execute o primeiro passo concreto.',
    type: 'epic', domain: 'criacao', xpGeneral: 150, xpDomain: 150, order: 3,
  },
  {
    id: 'criacao-5-m4', poiId: 'criacao-5',
    name: 'Documentar o Processo',
    description: 'Registre (texto, foto ou vídeo) o processo de criação de algo.',
    type: 'main', domain: 'criacao', xpGeneral: 120, xpDomain: 120, order: 4,
  },
]

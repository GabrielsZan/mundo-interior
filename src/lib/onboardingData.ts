import type { Domain } from '@/types'

// ── Quiz ─────────────────────────────────────────────────────────────────────

export interface IOnboardingQuestion {
  id:      string
  domain:  Domain
  text:    string
  options: [string, string, string]  // score 1 / 2 / 3
}

export const ONBOARDING_QUESTIONS: IOnboardingQuestion[] = [
  // Mente
  {
    id:      'mind-1',
    domain:  'mind',
    text:    'Com que frequência você aprende algo novo intencionalmente?',
    options: ['Raramente', 'Às vezes', 'Frequentemente'],
  },
  {
    id:      'mind-2',
    domain:  'mind',
    text:    'Você consegue manter o foco por mais de 30 minutos numa tarefa?',
    options: ['Dificilmente', 'Às vezes', 'Com facilidade'],
  },
  {
    id:      'mind-3',
    domain:  'mind',
    text:    'Você tem uma rotina de leitura, estudo ou reflexão?',
    options: ['Não tenho', 'Às vezes', 'Sim, regularmente'],
  },

  // Corpo
  {
    id:      'body-1',
    domain:  'body',
    text:    'Com que frequência você pratica exercício físico?',
    options: ['Raramente', '1–2× por semana', '3× ou mais por semana'],
  },
  {
    id:      'body-2',
    domain:  'body',
    text:    'Como você avalia sua qualidade de sono atualmente?',
    options: ['Ruim', 'Regular', 'Boa'],
  },
  {
    id:      'body-3',
    domain:  'body',
    text:    'Você se alimenta de forma nutritiva e consciente?',
    options: ['Raramente', 'Às vezes', 'Na maioria das vezes'],
  },

  // Alma
  {
    id:      'soul-1',
    domain:  'soul',
    text:    'Você dedica tempo de qualidade para suas relações importantes?',
    options: ['Raramente', 'Às vezes', 'Frequentemente'],
  },
  {
    id:      'soul-2',
    domain:  'soul',
    text:    'Com que frequência você pratica auto-reflexão ou meditação?',
    options: ['Raramente', 'Às vezes', 'Frequentemente'],
  },
  {
    id:      'soul-3',
    domain:  'soul',
    text:    'Você sente que suas ações estão alinhadas com seus valores?',
    options: ['Quase nunca', 'Às vezes', 'Frequentemente'],
  },

  // Criação
  {
    id:      'creation-1',
    domain:  'creation',
    text:    'Você tem projetos criativos que te empolgam?',
    options: ['Nenhum no momento', 'Tenho alguns', 'Vários em andamento'],
  },
  {
    id:      'creation-2',
    domain:  'creation',
    text:    'Com que frequência você expressa sua criatividade?',
    options: ['Raramente', 'Às vezes', 'Frequentemente'],
  },
  {
    id:      'creation-3',
    domain:  'creation',
    text:    'Você tem tempo para hobbies e atividades que te energizam?',
    options: ['Raramente', 'Às vezes', 'Regularmente'],
  },
]

// ── Starter Missions Pool ────────────────────────────────────────────────────

export interface IStarterMission {
  title:       string
  description: string
  domain:      Domain
}

export const STARTER_MISSIONS: IStarterMission[] = [
  // Mente
  {
    domain:      'mind',
    title:       'Leitura Diária',
    description: 'Ler por 20 minutos qualquer livro ou artigo de interesse.',
  },
  {
    domain:      'mind',
    title:       'Estudo Focado',
    description: 'Estudar um tema de interesse por 30 minutos sem distrações.',
  },
  {
    domain:      'mind',
    title:       'Diário de Reflexão',
    description: 'Escrever 3 pensamentos, aprendizados ou ideias do dia.',
  },
  {
    domain:      'mind',
    title:       'Desafio Mental',
    description: 'Resolver um puzzle, sudoku, charada ou problema criativo.',
  },
  {
    domain:      'mind',
    title:       'Conteúdo Educativo',
    description: 'Assistir a um documentário, podcast ou aula sobre algo novo.',
  },
  {
    domain:      'mind',
    title:       'Novas Palavras',
    description: 'Aprender o significado de 3 palavras novas em qualquer idioma.',
  },
  {
    domain:      'mind',
    title:       'Planejamento do Dia',
    description: 'Organizar tarefas e definir as 3 prioridades ao acordar.',
  },
  {
    domain:      'mind',
    title:       'Revisão Semanal',
    description: 'Reservar 15 minutos para refletir sobre o que aprendeu na semana.',
  },

  // Corpo
  {
    domain:      'body',
    title:       'Movimento Diário',
    description: 'Caminhar, pedalar ou movimentar o corpo por pelo menos 20 minutos.',
  },
  {
    domain:      'body',
    title:       'Hidratação',
    description: 'Beber 2 litros de água ao longo do dia.',
  },
  {
    domain:      'body',
    title:       'Sono em Dia',
    description: 'Dormir antes da meia-noite e acordar no mesmo horário.',
  },
  {
    domain:      'body',
    title:       'Refeição Nutritiva',
    description: 'Fazer uma refeição saudável e consciente, sem telas.',
  },
  {
    domain:      'body',
    title:       'Alongamento',
    description: 'Fazer 10 minutos de alongamento ou mobilidade.',
  },
  {
    domain:      'body',
    title:       'Exercício Curto',
    description: 'Fazer 15 minutos de exercício (qualquer tipo: yoga, treino, dança).',
  },
  {
    domain:      'body',
    title:       'Sem Tela Antes de Dormir',
    description: 'Ficar 1 hora sem usar telas antes de dormir.',
  },
  {
    domain:      'body',
    title:       'Respiração Consciente',
    description: 'Praticar 5 minutos de respiração profunda ou coerência cardíaca.',
  },

  // Alma
  {
    domain:      'soul',
    title:       'Gratidão',
    description: 'Escrever 3 coisas pelas quais você é grato hoje.',
  },
  {
    domain:      'soul',
    title:       'Conexão Real',
    description: 'Conversar de verdade com alguém importante, sem pressa.',
  },
  {
    domain:      'soul',
    title:       'Meditação',
    description: 'Meditar por 10 minutos usando qualquer técnica ou app.',
  },
  {
    domain:      'soul',
    title:       'Momento Presente',
    description: 'Passar 15 minutos sem distrações, apenas observando o entorno.',
  },
  {
    domain:      'soul',
    title:       'Ato de Bondade',
    description: 'Fazer algo gentil por alguém sem esperar retorno.',
  },
  {
    domain:      'soul',
    title:       'Desintoxicação Digital',
    description: 'Desconectar das redes sociais por pelo menos 2 horas.',
  },
  {
    domain:      'soul',
    title:       'Sentimentos no Papel',
    description: 'Escrever livremente sobre como você se sente hoje, sem julgamento.',
  },
  {
    domain:      'soul',
    title:       'Natureza',
    description: 'Passar 15 minutos ao ar livre, prestando atenção ao ambiente.',
  },

  // Criação
  {
    domain:      'creation',
    title:       'Projeto Criativo',
    description: 'Trabalhar num projeto pessoal (qualquer área) por 30 minutos.',
  },
  {
    domain:      'creation',
    title:       'Esboço Livre',
    description: 'Desenhar, rabiscar ou esboçar qualquer coisa sem objetivo.',
  },
  {
    domain:      'creation',
    title:       'Escrita Livre',
    description: 'Escrever 200 palavras sem julgamento — ficção, diário, o que vier.',
  },
  {
    domain:      'creation',
    title:       'Escuta Musical',
    description: 'Ouvir um álbum inteiro com atenção plena, ou tocar um instrumento.',
  },
  {
    domain:      'creation',
    title:       'Fotografia do Dia',
    description: 'Fotografar algo que te inspirou ou chamou atenção hoje.',
  },
  {
    domain:      'creation',
    title:       'Aprender Fazendo',
    description: 'Assistir a um tutorial e criar algo concreto com o aprendizado.',
  },
  {
    domain:      'creation',
    title:       'Brainstorming',
    description: 'Gerar 10 ideias sobre qualquer tema em 10 minutos sem filtro.',
  },
  {
    domain:      'creation',
    title:       'Compartilhar Criação',
    description: 'Mostrar ou enviar algo que criou para pelo menos uma pessoa.',
  },
]

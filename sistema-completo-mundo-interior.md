# Sistema Completo de Missões, Progressão e Vilão — Mundo Interior
# Documento final para implementação no VS Code

---

## 1. SISTEMA DE PROGRESSÃO DO MAPA

### Regras gerais:
- Progressão LINEAR dentro de cada região (ordem fixa)
- Completar TODAS as missões de um POI revela o próximo da região
- 4 POIs iniciais revelados: mente-1, alma-1, corpo-1, criacao-1
- Jogador avança nas 4 regiões simultaneamente
- Challenge zones desbloqueiam ao completar o 3º POI da região

### Ordem por região:
- **Mente:** mente-1 → mente-2 → mente-3 → challenge-mente → mente-4 → mente-5
- **Alma:** alma-1 → alma-2 → alma-3 → challenge-alma → alma-4 → alma-5
- **Corpo:** corpo-1 → corpo-2 → corpo-3 → challenge-corpo → corpo-4 → corpo-5
- **Criação:** criacao-1 → criacao-2 → criacao-3 → challenge-criacao → criacao-4 → criacao-5

---

## 2. TODAS AS MISSÕES

### Estrutura de dados por missão:
```typescript
interface Mission {
  id: string;           // ex: "mente-1-m1"
  poiId: string;        // ex: "mente-1"
  name: string;
  description: string;
  type: 'principal' | 'epica';
  domain: 'mente' | 'corpo' | 'alma' | 'criacao';
  xpGeral: number;
  xpDomain: number;
  order: number;        // ordem dentro do POI (1, 2, 3...)
}
```

---

### 🧠 MENTE — Grande Biblioteca (mente-1) [INÍCIO]

| id | name | description | xpGeral | xpDomain | order |
|----|------|-------------|---------|----------|-------|
| mente-1-m1 | Leitura Inicial | Leia 30 páginas de qualquer livro | 100 | 100 | 1 |
| mente-1-m2 | Resumo do Aprendiz | Escreva um resumo de 1 parágrafo sobre o que leu | 100 | 100 | 2 |
| mente-1-m3 | Lista de Leitura | Crie uma lista com 5 livros que quer ler este ano | 80 | 80 | 3 |

### 🧠 MENTE — Torre do Foco (mente-2)

| id | name | description | xpGeral | xpDomain | order |
|----|------|-------------|---------|----------|-------|
| mente-2-m1 | Sessão Pomodoro | Complete uma sessão de 25 minutos de foco sem distrações | 100 | 100 | 1 |
| mente-2-m2 | Dieta Digital | Passe 2 horas consecutivas sem redes sociais | 120 | 120 | 2 |
| mente-2-m3 | Bloco de Produtividade | Defina 3 tarefas prioritárias do dia e complete todas | 120 | 120 | 3 |
| mente-2-m4 | Ritual de Foco | Crie uma rotina de início de trabalho (ex: café, música, organizar mesa) e execute-a | 100 | 100 | 4 |

### 🧠 MENTE — Observatório Celestial (mente-3)

| id | name | description | xpGeral | xpDomain | order |
|----|------|-------------|---------|----------|-------|
| mente-3-m1 | Visão de Futuro | Escreva onde você quer estar em 5 anos (mínimo 200 palavras) | 150 | 150 | 1 |
| mente-3-m2 | Metas Trimestrais | Defina 3 metas concretas para os próximos 3 meses | 120 | 120 | 2 |
| mente-3-m3 | Revisão Semanal | Faça uma revisão do que conquistou esta semana e o que falta | 100 | 100 | 3 |

### 🧠 MENTE — Templo de Estudo (mente-4)

| id | name | description | xpGeral | xpDomain | order |
|----|------|-------------|---------|----------|-------|
| mente-4-m1 | Estudo Dirigido | Estude um tema novo por 45 minutos com anotações | 130 | 130 | 1 |
| mente-4-m2 | Ensinando para Aprender | Explique um conceito que aprendeu para alguém (ou grave um áudio) | 140 | 140 | 2 |
| mente-4-m3 | Mapa Mental | Crie um mapa mental de um tema que está estudando | 120 | 120 | 3 |
| mente-4-m4 | Disciplina do Saber | Estude o mesmo tema por 3 dias seguidos, mínimo 30 min cada | 150 | 150 | 4 |

### 🧠 MENTE — Arquivo da Memória (mente-5)

| id | name | description | xpGeral | xpDomain | order |
|----|------|-------------|---------|----------|-------|
| mente-5-m1 | Revisão Espaçada | Revise anotações de algo que estudou há mais de 1 semana | 130 | 130 | 1 |
| mente-5-m2 | Flashcards | Crie 10 flashcards sobre um tema que quer memorizar | 120 | 120 | 2 |
| mente-5-m3 | Diário de Aprendizado | Escreva 3 coisas novas que aprendeu hoje | 100 | 100 | 3 |

---

### 💙 ALMA — Jardim da Gratidão (alma-1) [INÍCIO]

| id | name | description | xpGeral | xpDomain | order |
|----|------|-------------|---------|----------|-------|
| alma-1-m1 | Três Gratidões | Escreva 3 coisas pelas quais é grato hoje | 80 | 80 | 1 |
| alma-1-m2 | Carta de Agradecimento | Escreva uma mensagem de agradecimento para alguém importante | 120 | 120 | 2 |
| alma-1-m3 | Olhar Positivo | No final do dia, liste 3 momentos bons que aconteceram | 80 | 80 | 3 |

### 💙 ALMA — Templo de Meditação (alma-2)

| id | name | description | xpGeral | xpDomain | order |
|----|------|-------------|---------|----------|-------|
| alma-2-m1 | Primeira Meditação | Medite por 5 minutos em silêncio ou com app guiado | 100 | 100 | 1 |
| alma-2-m2 | Respiração Consciente | Faça 10 respirações profundas com olhos fechados antes de dormir | 80 | 80 | 2 |
| alma-2-m3 | Meditação Expandida | Complete uma meditação de 15 minutos | 130 | 130 | 3 |
| alma-2-m4 | Ritual Meditativo | Medite por 3 dias consecutivos (qualquer duração) | 150 | 150 | 4 |

### 💙 ALMA — Praça Social (alma-3)

| id | name | description | xpGeral | xpDomain | order |
|----|------|-------------|---------|----------|-------|
| alma-3-m1 | Conversa Genuína | Tenha uma conversa de pelo menos 15 minutos com alguém sem celular | 120 | 120 | 1 |
| alma-3-m2 | Reconexão | Mande uma mensagem para alguém com quem não fala há tempo | 100 | 100 | 2 |
| alma-3-m3 | Presença Social | Participe de um encontro social (presencial ou virtual) por vontade própria | 130 | 130 | 3 |

### 💙 ALMA — Santuário da Empatia (alma-4)

| id | name | description | xpGeral | xpDomain | order |
|----|------|-------------|---------|----------|-------|
| alma-4-m1 | Escuta Ativa | Em uma conversa, apenas escute por 5 minutos sem interromper | 120 | 120 | 1 |
| alma-4-m2 | Perspectiva Alheia | Escreva sobre uma situação recente do ponto de vista da outra pessoa | 140 | 140 | 2 |
| alma-4-m3 | Ato de Bondade | Faça algo gentil por alguém sem que peçam | 100 | 100 | 3 |
| alma-4-m4 | Check-in Emocional | Pergunte a alguém próximo como ele realmente está e escute com atenção | 130 | 130 | 4 |

### 💙 ALMA — Santuário do Silêncio (alma-5)

| id | name | description | xpGeral | xpDomain | order |
|----|------|-------------|---------|----------|-------|
| alma-5-m1 | Hora do Silêncio | Passe 30 minutos em silêncio total (sem música, sem telas) | 130 | 130 | 1 |
| alma-5-m2 | Caminhada Solitária | Faça uma caminhada sozinho, sem fones, prestando atenção ao redor | 120 | 120 | 2 |
| alma-5-m3 | Autoconhecimento | Escreva uma reflexão honesta sobre como está se sentindo (mínimo 150 palavras) | 140 | 140 | 3 |

---

### 💪 CORPO — Campo de Treino (corpo-1) [INÍCIO]

| id | name | description | xpGeral | xpDomain | order |
|----|------|-------------|---------|----------|-------|
| corpo-1-m1 | Primeiro Treino | Faça 20 minutos de qualquer exercício físico | 100 | 100 | 1 |
| corpo-1-m2 | Desafio Corporal | Faça 3 séries de: 10 flexões + 15 agachamentos + 30s prancha | 120 | 120 | 2 |
| corpo-1-m3 | Movimento Diário | Faça pelo menos 15 minutos de atividade física por 3 dias seguidos | 150 | 150 | 3 |

### 💪 CORPO — Jardim Nutricional (corpo-2)

| id | name | description | xpGeral | xpDomain | order |
|----|------|-------------|---------|----------|-------|
| corpo-2-m1 | Refeição Consciente | Coma uma refeição sem celular, prestando atenção no sabor | 80 | 80 | 1 |
| corpo-2-m2 | Cozinheiro Interior | Prepare uma refeição saudável do zero | 120 | 120 | 2 |
| corpo-2-m3 | Diário Alimentar | Registre tudo que comeu hoje e avalie o equilíbrio | 100 | 100 | 3 |
| corpo-2-m4 | Hidratação | Beba pelo menos 2 litros de água hoje e registre | 80 | 80 | 4 |

### 💪 CORPO — Santuário do Descanso (corpo-3)

| id | name | description | xpGeral | xpDomain | order |
|----|------|-------------|---------|----------|-------|
| corpo-3-m1 | Rotina Noturna | Desligue telas 30 minutos antes de dormir | 100 | 100 | 1 |
| corpo-3-m2 | Sono Reparador | Durma pelo menos 7 horas esta noite | 120 | 120 | 2 |
| corpo-3-m3 | Pausa Restauradora | Tire um intervalo de 15 minutos durante o trabalho para descansar de verdade | 100 | 100 | 3 |

### 💪 CORPO — Santuário da Postura (corpo-4)

| id | name | description | xpGeral | xpDomain | order |
|----|------|-------------|---------|----------|-------|
| corpo-4-m1 | Check Postural | Configure um alarme e corrija sua postura 5 vezes ao longo do dia | 100 | 100 | 1 |
| corpo-4-m2 | Alongamento Matinal | Faça 10 minutos de alongamento ao acordar | 110 | 110 | 2 |
| corpo-4-m3 | Consciência Corporal | Faça uma sessão de yoga ou alongamento guiado de 20 minutos | 130 | 130 | 3 |
| corpo-4-m4 | Ergonomia | Ajuste seu espaço de trabalho (altura da tela, cadeira, posição) e tire uma foto | 120 | 120 | 4 |

### 💪 CORPO — Fonte de Cura (corpo-5)

| id | name | description | xpGeral | xpDomain | order |
|----|------|-------------|---------|----------|-------|
| corpo-5-m1 | Dia de Recuperação | Dedique um dia a atividades leves: caminhada, banho longo, leitura | 130 | 130 | 1 |
| corpo-5-m2 | Auto Check-up | Faça uma avaliação honesta da sua saúde: sono, dores, energia, humor | 120 | 120 | 2 |
| corpo-5-m3 | Ritual de Cura | Escolha um hábito de saúde que abandonou e retome-o hoje | 140 | 140 | 3 |

---

### 🎨 CRIAÇÃO — Guilda dos Escritores (criacao-1) [INÍCIO]

| id | name | description | xpGeral | xpDomain | order |
|----|------|-------------|---------|----------|-------|
| criacao-1-m1 | Escrita Livre | Escreva por 10 minutos sem parar sobre qualquer assunto | 80 | 80 | 1 |
| criacao-1-m2 | Micro-conto | Escreva uma história curta de até 200 palavras | 120 | 120 | 2 |
| criacao-1-m3 | Diário Criativo | Escreva uma entrada de diário descrevendo seu dia como se fosse ficção | 100 | 100 | 3 |

### 🎨 CRIAÇÃO — Estúdio de Arte (criacao-2)

| id | name | description | xpGeral | xpDomain | order |
|----|------|-------------|---------|----------|-------|
| criacao-2-m1 | Rabisco do Dia | Desenhe algo — qualquer coisa — em 10 minutos | 80 | 80 | 1 |
| criacao-2-m2 | Observação Visual | Desenhe um objeto que está na sua frente tentando ser fiel ao real | 120 | 120 | 2 |
| criacao-2-m3 | Expressão Visual | Crie uma imagem (desenho, colagem, digital) que represente como está se sentindo | 130 | 130 | 3 |
| criacao-2-m4 | Galeria Pessoal | Junte 3 criações visuais suas (de qualquer época) e reflita sobre sua evolução | 100 | 100 | 4 |

### 🎨 CRIAÇÃO — Salão de Música (criacao-3)

| id | name | description | xpGeral | xpDomain | order |
|----|------|-------------|---------|----------|-------|
| criacao-3-m1 | Escuta Profunda | Ouça um álbum inteiro sem fazer nada, só ouvindo | 100 | 100 | 1 |
| criacao-3-m2 | Prática Musical | Pratique um instrumento ou cante por 20 minutos | 120 | 120 | 2 |
| criacao-3-m3 | Playlist da Alma | Crie uma playlist de 10 músicas que representam momentos da sua vida | 100 | 100 | 3 |

### 🎨 CRIAÇÃO — Oficina de Criação (criacao-4)

| id | name | description | xpGeral | xpDomain | order |
|----|------|-------------|---------|----------|-------|
| criacao-4-m1 | Mãos à Obra | Construa, conserte ou monte algo físico (cozinhar, montar, craftar) | 120 | 120 | 1 |
| criacao-4-m2 | Projeto Pessoal | Dedique 1 hora a um projeto criativo pessoal (qualquer um) | 140 | 140 | 2 |
| criacao-4-m3 | Finalizar Algo | Pegue algo inacabado e termine hoje | 150 | 150 | 3 |

### 🎨 CRIAÇÃO — Laboratório de Inovação (criacao-5)

| id | name | description | xpGeral | xpDomain | order |
|----|------|-------------|---------|----------|-------|
| criacao-5-m1 | Brainstorm Selvagem | Escreva 20 ideias em 10 minutos (podem ser absurdas) | 100 | 100 | 1 |
| criacao-5-m2 | Experimento Criativo | Tente algo que nunca fez antes (nova receita, novo app, novo estilo) | 140 | 140 | 2 |
| criacao-5-m3 | Ideia em Ação | Escolha uma das suas ideias e execute o primeiro passo concreto | 150 | 150 | 3 |
| criacao-5-m4 | Documentar o Processo | Registre (texto, foto ou vídeo) o processo de criação de algo | 120 | 120 | 4 |

---

### ⚠️ CHALLENGE ZONES

Challenge zones desbloqueiam ao completar o 3º POI da região.
Missões tipo "épica" com XP maior.

### ⚠️ Vale da Procrastinação (challenge-mente)
Revelado: ao completar mente-3

| id | name | description | xpGeral | xpDomain | order |
|----|------|-------------|---------|----------|-------|
| challenge-mente-m1 | Confronto Inicial | Identifique 3 tarefas que você está adiando e escreva por quê | 150 | 150 | 1 |
| challenge-mente-m2 | Regra dos 2 Minutos | Para cada tarefa adiada: se leva menos de 2 min, faça agora | 130 | 130 | 2 |
| challenge-mente-m3 | Quebrando a Inércia | Escolha a tarefa que mais adia e trabalhe nela por 15 minutos | 180 | 180 | 3 |

### ⚠️ Deserto do Burnout (challenge-corpo)
Revelado: ao completar corpo-3

| id | name | description | xpGeral | xpDomain | order |
|----|------|-------------|---------|----------|-------|
| challenge-corpo-m1 | Inventário de Energia | Liste o que drena e o que recarrega sua energia no dia a dia | 150 | 150 | 1 |
| challenge-corpo-m2 | Dia de Nada | Passe um dia inteiro sem produtividade forçada — descanse de verdade | 180 | 180 | 2 |
| challenge-corpo-m3 | Limites Saudáveis | Diga "não" para um compromisso que não quer ou que drena energia | 160 | 160 | 3 |

### ⚠️ Névoa da Dúvida (challenge-alma)
Revelado: ao completar alma-3

| id | name | description | xpGeral | xpDomain | order |
|----|------|-------------|---------|----------|-------|
| challenge-alma-m1 | Mapeando Inseguranças | Escreva 3 inseguranças que te afetam e de onde elas vieram | 160 | 160 | 1 |
| challenge-alma-m2 | Voz Interior Gentil | Reescreva cada insegurança como se fosse um amigo falando com você | 150 | 150 | 2 |
| challenge-alma-m3 | Ação Apesar do Medo | Faça algo que te deixa inseguro mas que sabe que é bom para você | 200 | 200 | 3 |

### ⚠️ Floresta do Perfeccionismo (challenge-criacao)
Revelado: ao completar criacao-3

| id | name | description | xpGeral | xpDomain | order |
|----|------|-------------|---------|----------|-------|
| challenge-criacao-m1 | Criação Imperfeita | Crie algo (texto, desenho, música) em 15 minutos e NÃO edite depois | 150 | 150 | 1 |
| challenge-criacao-m2 | Mostrar ao Mundo | Compartilhe algo que criou com pelo menos 1 pessoa | 160 | 160 | 2 |
| challenge-criacao-m3 | Abraçar o Rascunho | Comece um projeto novo aceitando que a primeira versão será ruim | 180 | 180 | 3 |

---

## 3. VILÃO — NYXOS, O CORRUPTOR

### Lore:
Nyxos não destrói — ele perverte. Onde havia disciplina, planta obsessão. Onde havia descanso, semeia preguiça. Ele fala com a sua voz, usa seus desejos, e veste suas conquistas como disfarce. Ele é sedutor, elegante, envolvente — e lentamente corrói tudo que você construiu.

### Visual:
- Figura elegante envolta em dourado escuro/corrompido
- Não é monstruoso — é bonito demais, reluzente, quase hipnótico
- Rachaduras escuras por onde vaza sombra
- Cor principal: dourado escuro (#8B7332) com sombras roxas (#3D2B5A)

### A Legião de Nyxos — As Tentações:
Cada domínio tem uma Tentação temática que aparece quando Nyxos invade:

| Domínio | Tentação | Frase | Conceito |
|---------|----------|-------|----------|
| Mente | A Paralisia da Análise | "Por que agir se você pode planejar mais?" | Overthinking, adiar por pensar demais |
| Corpo | O Conforto Eterno | "Descanse mais, você merece. Amanhã você treina." | Preguiça disfarçada de autocuidado |
| Alma | O Isolamento Dourado | "Você não precisa de ninguém. Fique na sua." | Solidão disfarçada de independência |
| Criação | A Perfeição Infinita | "Não publique ainda. Não está bom o suficiente." | Perfeccionismo paralisante |

---

## 4. MECÂNICA DE INVASÃO

### Regras:

```typescript
interface InvasionSystem {
  // Chance base diária (mesmo quando ativo)
  baseChancePercent: 5;  // 5% todo dia, calculado 1x por dia ao abrir o app

  // Escala de inatividade (dias sem completar NENHUMA missão)
  inactivityScale: {
    day3: 20;   // após 3 dias sem atividade
    day4: 35;   // após 4 dias
    day5: 50;   // após 5 dias
    day6: 65;   // após 6 dias
    day7plus: 80; // 7+ dias
  };

  // Requisitos para invasão
  minimumPoisUnlocked: 3;  // mínimo de POIs liberados no domínio
  maxInvasionsPerDomain: 1; // máximo 1 POI invadido por domínio

  // Qual POI é invadido?
  // Aleatório entre os POIs COMPLETOS do domínio (não pode invadir POI não-completado)

  // Consequências
  // - POI invadido: missões resetam (precisam ser refeitas)
  // - POIs DEPOIS do invadido na progressão: ficam TRAVADOS
  // - Mensagem: "Nyxos corrompeu [POI]! [Tentação] tomou conta. Reconquiste para liberar o caminho."

  // Reconquista
  // - Refazer TODAS as missões do POI invadido
  // - Ao reconquistar: POIs seguintes são destravados novamente
  // - XP é ganho novamente ao refazer as missões

  // Reset de inatividade
  // - Completar qualquer missão reseta o contador de inatividade para 0
  // - A chance base de 5% NÃO é afetada (sempre ativa)

  // Quando calcular
  // - 1x por dia, ao abrir o app (não ao navegar entre telas)
  // - Se já houve cálculo hoje, não recalcular
  // - Guardar lastInvasionCheck: Date no store
}
```

### Visual do POI invadido no mapa:
- Borda do marcador muda para dourado escuro (#8B7332) com animação pulsante
- Aura/glow sombrio ao redor (roxo escuro semi-transparente)
- Ícone do POI escurece/dessatura
- Label muda para cor vermelha/dourado escuro
- Ao clicar: sheet mostra a mensagem da Tentação + botão "Reconquistar"

### Notificação ao jogador:
Quando uma invasão acontece, mostrar um banner/modal dramático:
- Ícone de Nyxos (ou símbolo de alerta dourado)
- Título: "Nyxos atacou!"
- Mensagem: "[Tentação do domínio] corrompeu [Nome do POI]!"
- Subtítulo: "Reconquiste completando as missões novamente."
- Botão: "Ver no Mapa"

---

## 5. ESTRUTURA DE DADOS PARA IMPLEMENTAÇÃO

### Stores necessários:

```typescript
// mapStore.ts — atualizar
interface MapState {
  revealedPois: string[];           // POIs revelados
  completedPois: string[];          // POIs com todas as missões completas
  invadedPois: string[];            // POIs atualmente invadidos por Nyxos
  lastActivityDate: string | null;  // última data que completou uma missão
  lastInvasionCheck: string | null; // última data que verificou invasão
  daysInactive: number;             // dias consecutivos sem atividade
}

// missionStore.ts — criar ou atualizar
interface MissionState {
  completedMissions: string[];      // IDs de missões completas
  // Para POIs invadidos, as missões são removidas de completedMissions
  // forçando o jogador a refazê-las
}
```

### Fluxo de invasão (pseudo-código):
```
ao abrir o app:
  se lastInvasionCheck === hoje → não fazer nada
  senão:
    lastInvasionCheck = hoje
    calcular daysInactive
    
    para cada domínio:
      se invadedPois já tem 1 desse domínio → pular
      se completedPois desse domínio < 3 → pular
      
      chance = 5% (base)
      se daysInactive >= 7: chance = 80%
      senão se daysInactive >= 6: chance = 65%
      senão se daysInactive >= 5: chance = 50%
      senão se daysInactive >= 4: chance = 35%
      senão se daysInactive >= 3: chance = 20%
      
      se random(0-100) < chance:
        poiParaInvadir = aleatório entre completedPois desse domínio
        adicionar poiParaInvadir em invadedPois
        remover missões desse POI de completedMissions
        mostrar notificação de invasão
```

---

## 6. RESUMO PARA O CLAUDE CODE

Implementar na seguinte ordem:
1. Criar seed data com todas as 73 missões (tabelas acima)
2. Atualizar mapStore: remover desbloqueio por XP, implementar progressão linear
3. Criar missionStore com tracking de missões completas por POI
4. POIs iniciais revelados: mente-1, alma-1, corpo-1, criacao-1
5. Completar todas as missões de um POI → revelar próximo + marcar como completo
6. Implementar sistema de invasão do Nyxos com as regras da seção 4
7. Visual do POI invadido: borda dourada escura pulsante, aura sombria
8. Notificação/modal de invasão ao abrir app
9. Mecânica de reconquista: refazer missões do POI invadido

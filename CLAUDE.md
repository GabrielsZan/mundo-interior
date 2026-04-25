# Mundo Interior — Contexto do Projeto

## O que é
Um Life-RPG gamificado para web (PWA) que transforma desenvolvimento pessoal em uma aventura de RPG. O jogador completa missões do mundo real, ganha XP, desbloqueia habilidades em uma skill tree e explora um mapa do seu "mundo interior".

## Stack
- **Frontend:** React 18 + TypeScript + Vite
- **Estilização:** Tailwind CSS + CSS Modules (para animações custom)
- **Estado:** Zustand
- **Backend:** Supabase (PostgreSQL, auth, real-time)
- **Deploy:** PWA via Vercel ou Netlify

## Idioma
- **UI do app:** Português (pt-BR) — todas as labels, textos, mensagens
- **Código:** Inglês — nomes de variáveis, funções, componentes, tipos, comentários

## Estilo Visual
Ghibli-esque: suave, pintado, acolhedor. Paleta quente com pergaminho, verdes orgânicos, terracota e azul céu.

### Cores dos Domínios
- Mente: #5B8C5A (verde sálvia)
- Corpo: #C67B5C (terracota)
- Alma: #6BA3B7 (azul céu)
- Criação: #B8976A (bege areia)
- Background: #FBF6F0 (pergaminho)
- Texto: #2A2118 (marrom escuro)
- Ouro/XP: #D4A843

### Tipografia
- Títulos: Lora (serifada, italics)
- Corpo: Nunito (sans-serif)
- Números/XP: JetBrains Mono (monospaced)

## Estrutura de Pastas
```
src/
  components/     → Componentes reutilizáveis (Button, Card, Modal, etc)
  features/       → Módulos por feature (missions/, skill-tree/, map/, citadel/)
  hooks/          → Custom hooks (useXP, useMissions, useFogOfWar)
  stores/         → Zustand stores (playerStore, missionStore, etc)
  lib/            → Supabase client, utilitários, constantes do GDD
  types/          → TypeScript types/interfaces centralizados
  styles/         → CSS global, variáveis de tema, animações
  assets/         → Imagens, ícones, sons
supabase/         → Migrations SQL, seed data
```

## Mecânicas Principais (do GDD)
- **4 Domínios:** Mente, Corpo, Alma, Criação
- **XP Dual:** Cada missão dá XP Geral (universal) + XP de Domínio (específico)
- **Tipos de Missão:** Diárias (recorrentes), Principais (médio prazo), Épicas (vida)
- **Árvore da Alma:** ~80 habilidades em 3 tiers, desbloqueadas com XP de domínio
- **Mapa:** Exploração com Fog of War, POIs por região, Cidadela central
- **Streaks:** Rastreamento de dias consecutivos para missões diárias

## Fórmulas de XP (do GDD)
- XP para próximo nível: `100 * nivel_atual * 1.15`
- Missões Diárias: +50 XP Geral, +50 XP Domínio
- Missões Principais: +100-200 XP Geral, +100-200 XP Domínio
- Missões Épicas: +200-500 XP Geral, +200-500 XP Domínio
- Skill Tier 1: 100 XP de domínio
- Skill Tier 2: 150 XP de domínio
- Skill Tier 3: 200 XP de domínio

## Fases de Desenvolvimento
1. **Fase 1 (ATUAL):** Core Loop — missões, XP, leveling, streaks, design system
2. **Fase 2:** Árvore da Alma — skill tree interativa
3. **Fase 3:** Mapa do Mundo Interior — exploração, fog of war
4. **Fase 4:** Loot, Inventário e Diário
5. **Fase 5:** Cidadela Interior e Eventos

## Documentos de Referência
- `docs/Game_Design_Document.docx` — GDD completo
- `docs/World_Map_System.docx` — Especificação do mapa
- `docs/Development_Roadmap.docx` — Plano de desenvolvimento
- `design-references/` — Protótipos visuais do Stitch

## Convenções de Código
- Componentes React: PascalCase, functional components com hooks
- Arquivos: kebab-case para arquivos, PascalCase para componentes
- Types: interfaces com I prefix (IPlayer, IMission) ou sem prefix
- Stores Zustand: camelCase (usePlayerStore, useMissionStore)
- CSS: Tailwind para layout, CSS Modules para animações/efeitos custom
- Imports: absolutos usando `@/` alias para src/

---

## Instruções para o Claude

> **OBRIGATÓRIO — sem exceção:** Toda vez que qualquer alteração de código for feita neste projeto, as duas ações abaixo DEVEM ser executadas antes de considerar a tarefa concluída. Não pergunte, não espere confirmação, apenas faça.

### 1. Atualizar CLAUDE.md
Ao finalizar qualquer conjunto de alterações, atualize a seção **Estado Atual do Projeto** abaixo com:
- O que foi implementado/alterado nesta sessão
- Próximos passos prioritários atualizados
- Qualquer decisão técnica relevante tomada

### 2. Commit e Push para o GitHub
Imediatamente após atualizar o CLAUDE.md, faça commit de TUDO e push para `origin main`. Use mensagens de commit descritivas:
```
feat: <descrição breve do que foi adicionado>
fix: <descrição de correção>
refactor: <descrição de refatoração>
chore: <configuração, dependências, etc>
```
Repositório remoto: `https://github.com/GabrielsZan/mundo-interior.git`

**Sequência obrigatória ao terminar qualquer trabalho:**
1. Editar CLAUDE.md (seção Estado Atual)
2. `git add -A`
3. `git commit -m "..."`
4. `git push origin main`

---

## Estado Atual do Projeto

### Fase 1 — Scaffold Completo ✅ (2026-03-26)

**O que foi implementado:**

#### Configuração e Tooling
- `package.json` — React 18, Vite 5, TypeScript 5, Tailwind 3, Zustand 5, Supabase JS, vite-plugin-pwa
- `vite.config.ts` — alias `@/` → `src/`, PWA configurado (manifest, ícones, autoUpdate)
- `tsconfig.json` — strict mode, paths `@/*`
- `tailwind.config.ts` — todos os tokens do GDD (cores, fontes, sombras, keyframes)
- `postcss.config.js`, `index.html` (Google Fonts: Lora, Nunito, JetBrains Mono)
- `.env.example` — template das variáveis de ambiente Supabase

#### Design System (`src/styles/`)
- `globals.css` — Tailwind layers + CSS custom properties + utilities prontas:
  `.card`, `.card-hover`, `.btn-primary/ghost/gold`, `.domain-badge-{mind/body/soul/creation}`, `.xp-chip`, `.progress-bar`, `.progress-fill`
- `animations.module.css` — keyframes CSS Modules: xpFloat, levelUp, streakPulse, fogReveal, shimmer (skill unlock)

#### Tipos (`src/types/index.ts`)
- `Domain`, `MissionType`, `SkillTier` (union types)
- `DOMAIN_LABELS`, `DOMAIN_COLORS` (lookup maps)
- `IMission`, `IPlayer`, `IDomainXP`, `ISkill`, `IXPGain` (interfaces)

#### Lógica de Negócio
- `src/lib/constants.ts` — `xpToNextLevel()`, `MISSION_XP`, `SKILL_XP_COST`, `STREAK_MILESTONES`
- `src/lib/supabase.ts` — cliente Supabase nullable (modo local se env vars ausentes)
- `src/lib/db.ts` — helpers CRUD: `dbFetchPlayer`, `dbUpsertPlayer`, `dbFetchMissions`, `dbInsertMission`, `dbUpdateMission`, `dbDeleteMission`, `dbResetDailyMissions`
- `src/stores/playerStore.ts` — Zustand + persist; `gainXP` com level-up loop; `loadFromDb`; sync ao Supabase
- `src/stores/missionStore.ts` — Zustand + persist; `completeMission`, `resetDailies`, `checkDailyReset` (detecta virada de dia), `loadFromDb`; sync ao Supabase
- `src/hooks/useXP.ts` — progresso derivado (current, needed, percent, level)
- `src/hooks/useMissions.ts` — filtros por domain/type/completed

#### Componentes UI (`src/components/ui/`)
- `Button` — variantes primary/ghost/gold
- `Card` — base + hoverable
- `XPBar` — barra de progresso com ARIA
- `DomainBadge` — badge colorida por domínio
- `index.ts` — barrel export

#### App
- `src/main.tsx` — entry point com StrictMode
- `src/App.tsx` — fluxo auth-aware: loading → `AuthScreen` → `SetupScreen` → `Dashboard`; daily reset no mount
- `src/features/auth/AuthScreen.tsx` — magic link via Supabase Auth
- `src/vite-env.d.ts` — tipos para env vars e PWA

**Variáveis de ambiente necessárias:**
```
VITE_SUPABASE_URL=<url do projeto Supabase>
VITE_SUPABASE_ANON_KEY=<chave anon do Supabase>
```

---

### Fase 1 — Core Loop COMPLETA ✅ (2026-03-26)

**Feature de Missões** ✅
- `MissionCard`, `MissionList`, `AddMissionModal` — CRUD completo
- Streak badge com animação de pulso; XP float ao completar; level-up burst

**Persistência Supabase** ✅
- `supabase/migrations/001_initial.sql` — tabelas `players` + `missions` com RLS
- `src/lib/db.ts` — helpers CRUD null-safe, fire-and-forget
- `playerStore` + `missionStore` sincronizam ao Supabase em background

**Auth** ✅
- `AuthScreen` com magic link (Supabase Auth)
- Fluxo: loading → unauthenticated → setup → dashboard
- Sem env vars = modo local (localStorage apenas)

**Reset de Diárias** ✅
- `checkDailyReset()` detecta virada de dia via `lastResetDate` (YYYY-MM-DD)
- Chamado automaticamente no mount do Dashboard

---

---

### Fase 2 — Árvore da Alma COMPLETA ✅ (2026-03-26)

- `src/features/skill-tree/SkillNode.tsx` — nó com estados locked/available/unlocked + shimmer
- `src/features/skill-tree/SkillTreeView.tsx` — layout horizontal por tier com linhas SVG
- `src/features/skill-tree/SkillTreePage.tsx` — filtro de domínio, XP disponível, contagem
- `src/stores/skillStore.ts` — Zustand + persist; `unlockSkill`, `canUnlock`, seed de habilidades

---

### Fase 3 — Mapa do Mundo Interior COMPLETA ✅ (2026-03-27)

**O que foi implementado:**

- `src/features/map/mapData.ts` — 15 POIs com coordenadas, ícones, domínio e XP de revelação
- `src/stores/mapStore.ts` — Zustand + persist; rastreia POIs visitados
- `src/features/map/FogCanvas.tsx` — canvas overlay que "recorta" névoa ao redor de POIs revelados
- `src/features/map/POIMarker.tsx` — botão posicionado absolutamente no mapa (regular/challenge/citadel)
- `src/features/map/POISheet.tsx` — bottom sheet com nome, descrição e tipo do POI
- `src/features/map/MapPage.tsx` — mapa 1600×900px com pan (pointer events), terreno CSS+SVG, fog of war
- `src/App.tsx` — tab "Mapa 🗺️" adicionada ao BottomNav

**Mecânicas:**
- 4 regiões por domínio (Norte/Mente, Sul/Corpo, Leste/Alma, Oeste/Criação) + Cidadela central
- 13 POIs regulares + 2 challenge zones (Labirinto da Procrastinação, Pântano do Esgotamento)
- Fog of War revelado por `domainXP` do player (gradiente radial em canvas com `destination-out`)
- Pan com pointer capture (funciona em touch e mouse)

---

### Fix — Mapa: redesign visual pergaminho + fog sépia ✅ (2026-03-27)
- `MapTerrain` reescrito: base `#E8D5A0`, regiões como paths SVG orgânicos, montanhas com triângulos de tinta, floresta com símbolos de pinheiro, rio com 3 linhas paralelas, lago com hatch, planícies com hatch diagonal, anel da Cidadela em ouro, rosa dos ventos, moldura dupla, vignette nas bordas
- `FogCanvas` corrigido: névoa sépia quente `rgba(62,42,18,0.72)` + gradiente de revelação com feather de 60% do raio + halo de tinta na borda
- `POIMarker` atualizado: wrapper flex-col, nomes visíveis abaixo do ícone com halo de pergaminho (textShadow), bordas estilo pergaminho/ouro
- Container externo: `#3E2A12` (coincide com a névoa, borda natural do mapa)

### Refactor — Mapa: background pintado (watercolor) + 25 POIs ✅ (2026-03-27)
- `mapData.ts` — interface `POI` com domínios em português (`mente/corpo/alma/criacao`); 25 POIs (5 por domínio + 4 challenge + citadela); MAP_W=1536, MAP_H=1024; export `mapPOIs`
- `MapPage.tsx` — `MapTerrain` SVG removido; background agora é `map-background.png` (watercolor Ghibli, 1536×1024); mapeamento `MapDomain → domainXP key` para reveal logic; dots de domínio atualizados para pt-BR
- `POIMarker.tsx` — cores por mapa local (pt-BR keys); regular=36px semi-transparente; challenge=borda dashed vermelha, fundo escuro; citadela=48px com glow dourado
- `POISheet.tsx` — `COLOR_MAP` e `LABEL_MAP` atualizados para chaves pt-BR (mente/corpo/alma/criacao); removida dependência de `DOMAIN_COLORS` do types global

### Fix — Skill Tree: disponibilidade de T2 após desbloquear T1 ✅ (2026-03-27)
- `prereqsMet(id)` adicionado ao skillStore — verifica só pré-requisitos, sem checar XP
- `canUnlock(id)` mantido para guard do unlock (prereqs + XP)
- `SkillNode` agora usa `prereqsMet` para o estado visual `'available'` e `canUnlock` só para habilitar o botão
- Quando pré-requisito cumprido mas XP insuficiente: card fica visível/disponível com texto "Precisa de N XP"

---

### Fase 4 — Loot, Inventário e Diário COMPLETA ✅ (2026-03-30)

**Tipos adicionados (`src/types/index.ts`)**
- `ItemRarity` (common/uncommon/rare/legendary) + `RARITY_LABELS` + `RARITY_COLORS`
- `IItem` — item de inventário com id, name, description, domain, rarity, icon, obtainedAt, fromMission
- `IJournalEntry` — entrada do diário com xpGeneral/xpDomain, itemIds, note editável

**Loot Tables (`src/lib/lootTables.ts`)**
- 4 itens por domínio × 4 raridades = 16 templates
- Pesos de raridade por tipo de missão: Daily (70/28/2/0), Main (30/50/18/2), Epic (10/30/45/15)
- Quantidade de drops: Daily=1, Main=1-2, Epic=2-3

**Stores**
- `src/stores/inventoryStore.ts` — Zustand + persist; `addItems`, `removeItem`
- `src/stores/journalStore.ts` — Zustand + persist; `addEntry`, `updateNote`
- `missionStore.completeMission` atualizado: retorna `IItem[]`, integra loot roll + journal entry

**UI**
- `src/features/inventory/InventoryPage.tsx` — grid 2 colunas, filtro por domínio, border-top por raridade
- `src/features/journal/JournalPage.tsx` — lista de entradas, data relativa, XP chips, ícones de loot, nota editável inline
- `MissionCard.tsx` — animação de ícones de loot flutuando após completar missão
- `missions.module.css` — keyframe `lootPop` adicionado
- `App.tsx` — 2 novos tabs: Inventário 🎒 e Diário 📖 (nav agora tem 5 itens)

---

### Mapa — Sistema de Progressão por Missões + Nyxos COMPLETO ✅ (2026-03-31)

**O que foi implementado:**

- `src/lib/mapMissions.ts` — 73 missões seed data (todas as tabelas do documento)
- `src/stores/mapStore.ts` — progressão LINEAR por região via missões (sem XP); invasão do Nyxos com inatividade + chance base 5%; reconquista; `completedPois`, `invadedPois`, `pendingInvasions`
- `src/features/map/NyxosInvasionModal.tsx` — modal dramático ao abrir o app quando invasão ocorre
- `src/features/map/map.module.css` — keyframe `invasionPulse` para borda dourada escura pulsante
- `src/features/map/POIMarker.tsx` — visual de POI invadido (escuro, greyscale, borda #8B7332 pulsante)
- `src/features/map/POISheet.tsx` — lista de missões do POI, estado invadido/bloqueado, botão Reconquistar
- `src/features/map/MapPage.tsx` — fog revela por `revealedPois` do store (não por XP)

**Regras de progressão:**
- 4 POIs iniciais: mente-1, alma-1, corpo-1, criacao-1 + Cidadela
- Completar TODAS missões de um POI → revela o próximo da região
- Challenge zones reveladas ao completar o 3º POI da região
- Invasão: 5% base, escala até 80% com 7+ dias inativo, requer 3 POIs completos no domínio
- Reconquista: refazer todas as missões do POI invadido

---

### Fix interação no mapa: sheet + pan + tap ✅ (2026-03-31)

- `MapPage.tsx` — POISheet e NyxosInvasionModal movidos para FORA do container `touch-none`; `touch-action: none` no container impedia síntese de `click` em filhos (iOS/Android)
- `MapPage.tsx` — `resetDrag` callback exposto e passado ao POIMarker para resetar `didDrag` quando novo tap começa em um POI (necessário pois `stopPropagation` impede o container de resetar)
- `POIMarker.tsx` — `onPointerDown` chama `onResetDrag()` antes de `stopPropagation()`, garantindo que tap após pan funciona

### Fix crítico: tap nos POIs do mapa ✅ (2026-03-31)

- `POIMarker.tsx` — `onPointerDown={(e) => e.stopPropagation()}` nos dois botões de POI
- Causa raiz: `setPointerCapture` no container capturava o ponteiro antes do botão receber `click`
- Com stopPropagation, o container não captura e o `click` dispara normalmente no botão

---

### Aba "Mundo" nas Missões + Fix POISheet ✅ (2026-03-31) v2

- `MissionList.tsx` — aba "Mundo" adicionada (4ª tab) com missões do mapa agrupadas por POI, estado de invasão/bloqueio, checkbox de completar inline, badge de pendentes em verde
- `POISheet.tsx` — removido `max-h-56` do container interno de missões (era o que cortava a lista); sheet com `max-height: calc(100vh - 7rem)` + `overflow-y-auto` no nível correto
- `MissionList WorldMissionsTab` — dropdown por missão: clicar no nome ou ▼ expande para mostrar a descrição; ▲ fecha; apenas uma missão expande por vez

---

### Fase 5 — Cidadela Interior + Eventos Semanais COMPLETA ✅ (2026-03-31)

**O que foi implementado:**

- `src/lib/weeklyEvents.ts` — Pool de 12 eventos semanais rotativos (por ISO week % 12); cada evento tem nome, descrição, domínio, ícone, requisito de missões, XP bônus e item de recompensa
- `src/stores/eventStore.ts` — Zustand + persist; rastreia semana atual (`weekKey`), progresso da semana (`progress`), e se recompensa foi reivindicada (`rewardClaimed`); `checkNewWeek` reseta ao virar semana; `progressEvent` incrementado a cada missão completada; `claimReward` dá XP + adiciona item ao inventário
- `src/features/citadel/CitadelPage.tsx` — Tela completa da Cidadela com:
  - **Perfil do jogador** — nome, nível, XP total acumulado
  - **Desafio da Semana** — card com barra de progresso, preview da recompensa e botão de reivindicar
  - **Conselho dos Domínios** — 4 NPCs (Mestra Lyra/Mente, Guerreiro Kaito/Corpo, Oráculo Serafim/Alma, Artesã Phaedra/Criação), cada um com 3 níveis de diálogo baseados no XP do domínio (< 150 / 150-500 / > 500)
  - **Sua Jornada** — estatísticas: missões concluídas, habilidades desbloqueadas, locais explorados, itens coletados
  - **XP por Domínio** — barras relativas mostrando distribuição entre domínios
- `src/features/citadel/index.ts` — Barrel export
- `src/features/map/POISheet.tsx` — prop `onOpenCitadel` adicionada; botão "🏰 Entrar na Cidadela" aparece quando POI selecionado é a Cidadela
- `src/features/map/MapPage.tsx` — prop `onOpenCitadel` recebida e repassada ao POISheet
- `src/App.tsx` — view `'citadel'` adicionada; `CitadelPage` renderizado com botão de voltar ao mapa; `BottomNav` oculto na Cidadela; `checkNewWeek` chamado no mount do Dashboard
- `src/stores/missionStore.ts` — `completeMission` chama `useEventStore.progressEvent()` após completar
- `src/stores/mapStore.ts` — `completeMapMission` chama `useEventStore.progressEvent()` após completar
- `src/stores/mapStore.ts` — função `getSubsequentPOIs` (nunca usada) removida; `poiName` duplicado removido

**Fluxo de navegação:**
- Mapa → toca POI Cidadela → POISheet → "Entrar na Cidadela" → CitadelPage (tela cheia, sem nav)
- CitadelPage → botão ← → volta ao Mapa

**Sistema de eventos semanais:**
- 12 eventos no pool, rotação por número de semana ISO
- Todos os tipos de missão (normais + mapa) progridem o evento
- Recompensa: XP bônus + item raro adicionado ao inventário
- Reset automático toda segunda-feira (semana ISO)

---

---

### Onboarding — Questionário + Seleção de Missões Iniciais ✅ (2026-04-01)

**O que foi implementado:**

- `src/lib/onboardingData.ts` — 12 perguntas (3 por domínio, 3 opções cada, score 1/2/3) + pool de 32 missões diárias starter (8 por domínio)
- `src/features/onboarding/QuizStep.tsx` — quiz pergunta por pergunta com barra de progresso, cabeçalho colorido por domínio, opções como cards grandes, botão Voltar
- `src/features/onboarding/ResultsStep.tsx` — tela de resultados com 4 barras por domínio (ordenadas do mais fraco), badge "Prioridade" no domínio mais fraco, mensagem contextual
- `src/features/onboarding/MissionPickerStep.tsx` — grid de missões agrupadas por domínio (fraco primeiro), checkboxes, counter sticky no bottom, mínimo 3 seleções
- `src/features/onboarding/OnboardingFlow.tsx` — orquestrador das 4 etapas (quiz → results → picker → done)
- `src/features/onboarding/index.ts` — barrel export
- `src/types/index.ts` — campo `hasCompletedOnboarding: boolean` adicionado em `IPlayer`
- `src/stores/playerStore.ts` — `createDefaultPlayer` seta flag como `false`; nova action `completeOnboarding()`
- `src/stores/missionStore.ts` — nova action `addBulkMissions()` para adicionar várias missões de uma vez
- `src/lib/db.ts` — `rowToPlayer` e `dbUpsertPlayer` incluem `has_completed_onboarding`
- `src/App.tsx` — check `!player.hasCompletedOnboarding` renderiza `<OnboardingFlow />` antes do Dashboard

**Fluxo:**
```
SetupScreen (nome) → initPlayer() → OnboardingFlow → Dashboard (com missões)
```
- Usuários existentes (flag `false`) também passam pelo onboarding no próximo acesso
- Ao confirmar missões: `setPlayerId` + `addBulkMissions` + `completeOnboarding` em sequência

---

---

### Persistência Supabase — Inventário, Diário, Mapa e Eventos ✅ (2026-04-01)

**O que foi implementado:**

- `supabase/migrations/003_inventory_journal_map_events.sql` — novas tabelas e colunas:
  - `inventory_items` (tabela com RLS por player_id)
  - `journal_entries` (tabela com RLS por player_id)
  - `players.map_state` (coluna JSONB para snapshot do mapa)
  - `players.event_state` (coluna JSONB para snapshot do evento semanal)
  - `players.has_completed_onboarding` (boolean, retrocompatível)
- `src/lib/db.ts` — 8 novos helpers: `dbFetchInventory`, `dbInsertInventoryItems`, `dbDeleteInventoryItem`, `dbFetchJournal`, `dbInsertJournalEntry`, `dbUpdateJournalNote`, `dbFetchMapState/dbUpsertMapState`, `dbFetchEventState/dbUpsertEventState`; tipos `MapStateSnapshot` e `EventStateSnapshot`
- `src/stores/inventoryStore.ts` — `playerId` + `setPlayerId` + `loadFromDb`; sync fire-and-forget em `addItems` e `removeItem`
- `src/stores/journalStore.ts` — `playerId` + `setPlayerId` + `loadFromDb`; sync em `addEntry` e `updateNote`
- `src/stores/mapStore.ts` — `loadFromDb`; sync via `syncMapState()` após `completeMapMission`, `reconquerPOI`, `checkInvasion`, `clearPendingInvasions`
- `src/stores/eventStore.ts` — `loadFromDb`; sync após `checkNewWeek`, `progressEvent`, `claimReward`
- `src/App.tsx` — `loadInventory`, `loadJournal`, `loadMapState`, `loadEventState` adicionados ao `Promise.all` na inicialização; `setInventoryPlayerId` + `setJournalPlayerId` chamados no mount do Dashboard

**Todos os dados do jogo agora são sincronizados ao Supabase** e sobrevivem a múltiplos dispositivos e limpeza de localStorage.

---

### Cidadela — Logout, Apagar Dados + Navegação pelo Header ✅ (2026-04-01)

- `src/features/citadel/CitadelPage.tsx` — props `onLogout` e `onDeleteData` adicionadas; botão "Sair da conta" (limpo, cinza); botão "Apagar meus dados" com confirmação em 2 passos (vermelho); estado local `confirmDelete`
- `src/App.tsx` — `openCitadel(from)` rastreia `prevView` para o botão de voltar funcionar tanto do dashboard quanto do mapa; `handleLogout` chama `supabase.auth.signOut()` (ou `resetPlayer` em local mode); `handleDeleteData` faz `signOut` + `localStorage.clear()` + `window.location.reload()`; Dashboard recebe prop `onOpenCitadel`; header do Dashboard (nome + nível) agora é um `<button>` clicável que abre a Cidadela

**Fluxo de navegação:**
- Header (nome/nível) no Dashboard → abre Cidadela (voltar retorna ao Dashboard)
- POI Cidadela no Mapa → abre Cidadela (voltar retorna ao Mapa)

### Android (Capacitor) ✅ (2026-04-06)

- Capacitor configurado (`@capacitor/core`, `@capacitor/cli`, `@capacitor/android`)
- `capacitor.config.ts` — appId `com.mundointerior.app`, webDir `dist`
- Pasta `android/` gerada com `npx cap add android`
- APK gerado via Android Studio: `Build → Generate App Bundles or APKs → Generate APKs`

### Fix Auth — Email + senha (resolve mobile) ✅ (2026-04-06)

- `AuthScreen.tsx` — login e cadastro com email + senha; sem magic link
- `signInWithPassword` para login; `signUp` para cadastro
- Erros traduzidos para pt-BR
- Requer "Enable email confirmations" desabilitado no Supabase (Authentication → Providers → Email)

### Bug Fixes ✅ (2026-04-10)

**1. Streak real de dias consecutivos** (`missionStore.ts`)
- `resetDailies` agora reseta `streak → 0` para missões que NÃO foram completadas no dia anterior
- DB sincronizado: chama `dbUpdateMission(id, { streak: 0 })` para cada missão perdida

**2. Logout limpa localStorage** (`App.tsx`)
- `handleLogout` agora faz `localStorage.clear()` + `window.location.reload()` após signOut
- Impede que dados de um usuário apareçam para outro no mesmo dispositivo

**3. Confirmação antes de deletar missão** (`MissionCard.tsx`)
- Botão "×" agora mostra "Sim / Não" inline antes de deletar
- Evita deleções acidentais no mobile

**4. XP total histórico na Cidadela** (`IPlayer`, `playerStore`, `db.ts`, `CitadelPage`)
- Novo campo `totalXPEarned` em `IPlayer` — acumula todo XP ganho, nunca decresce
- `gainXP` incrementa `totalXPEarned` a cada ganho
- `CitadelPage` usa `player.totalXPEarned` (fallback para soma de domain XP em contas antigas)
- Migration `004_total_xp_earned.sql` adicionada para o Supabase

**5. Missões do mapa geram loot e entradas no diário** (`mapStore.ts`)
- `completeMapMission` agora chama `rollLoot`, adiciona itens ao inventário e cria entrada no diário
- Mesmo comportamento das missões normais

### Separação Perfil / Cidadela ✅ (2026-04-10)

- Página aberta pelo header (nome/nível) renomeada de "A Cidadela Interior" para **"Perfil do Aventureiro"** — contém perfil, evento semanal, NPCs, stats e ações de conta
- POI Cidadela no mapa desvinculado desta página — exibe placeholder "🏰 Em breve" no POISheet
- `MapPage` não recebe mais `onOpenCitadel`; `POISheet` não recebe mais a prop
- A Cidadela real (com suas mecânicas próprias) será criada como nova página separada

### Sistema de Buffs da Árvore da Alma ✅ (2026-04-10)

**O que foi implementado:**

- `src/types/index.ts` — `BuffType`, `ISkillBuff`, `ActiveBuffs` adicionados; campo `buff: ISkillBuff` inserido em `ISkill`
- `src/data/skills.ts` — Todos os 96 skills agora têm campo `buff` com tipo, valor e label em pt-BR (valores balanceados por tier: T1=5%/10%, T2=8-10%/15-20%, T3=12-15%/20-25%)
- `src/lib/buffs.ts` — Novo arquivo: `computeActiveBuffs(skills)` e `applyXPBuffs(base, buffs, domain)`
- `src/lib/lootTables.ts` — `rollLoot` agora aceita `lootRarityShiftPct` e `lootExtraChancePct` (default 0); adiciona upgrade de raridade e item extra
- `src/stores/missionStore.ts` — `completeMission` aplica buffs antes de conceder XP e loot
- `src/stores/mapStore.ts` — `completeMapMission` aplica buffs antes de conceder XP e loot
- `src/features/skill-tree/SkillNode.tsx` — Badge de buff adicionado ao card (cinza=locked, cor do domínio=available/unlocked)
- `src/features/skill-tree/SkillTreePage.tsx` — Widget "Bônus Ativos" exibido quando há skills desbloqueadas, mostrando bônus acumulados do domínio ativo

**Arquitetura:** Buffs são computados em tempo real a partir do array `skills[]` persistido — sem novas colunas no Supabase. Stacking aditivo entre habilidades do mesmo tipo.

### Redesign Visual do Mapa ✅ (2026-04-14)

**O que foi implementado:**

- `fantasy_world_map_final_combined_upscayl_6x_remacri-4x.png` redimensionado para 3000×2000px → `src/assets/map-background.png`
- 20 imagens de POI (2048×2048px) copiadas para `src/assets/pois/`
- `mapData.ts` — `MAP_W=3000`, `MAP_H=2000`; campo `image?: string` adicionado à interface `POI`; 20 imports estáticos das imagens; coordenadas recalibradas para o novo mapa (mente=norte/montanhas, alma=nordeste/cerejeiras, corpo=sul/planícies, criação=oeste/floresta de outono)
- `POIMarker.tsx` — suporte a imagem circular (`<img>` com `object-cover` + `border-radius: 50%` + borda colorida); marcadores maiores (60px regular, 72px cidadela) para o mapa 3000px; overlay de 💀 no estado invadido
- `POISheet.tsx` — banner de imagem (h-40, `object-cover`) com gradiente overlay + título inline quando POI tem imagem; fallback para layout com emoji quando não tem
- `MapPage.tsx` — `FOG_RADIUS_REGULAR=340`, `FOG_RADIUS_CITADEL=510` (proporcional ao mapa 2× maior)

**Nota sobre assets:** As imagens de POI são 1–1.5MB cada (~25MB total). Lazy loading é feito automaticamente pelo browser. Para APK Android considerar converter para WebP no futuro.

### POI Markers — Estruturas no Mapa ✅ (2026-04-14)

- `POIMarker.tsx` redesenhado: imagens exibidas como estruturas soltas no mapa (sem bolinha)
- `mix-blend-mode: multiply` faz o fundo claro das ilustrações desaparecer, deixando apenas a estrutura desenhada "pintada" sobre o terreno
- `filter: drop-shadow(...)` dá profundidade à estrutura
- Âncora ajustada para `translate(-50%, -82%)` — a base da estrutura assenta no ponto do POI
- Tamanhos: 100px regular, 160px cidadela
- Challenge zones mantêm pin de ⚠️ (sem imagem)
- Estados: invadido (grayscale + 💀), bloqueado (escurecido + 🔒), visitado (leve transparência)

### Fix — POI Markers com fundo transparente ✅ (2026-04-15)

- Imagens de POI em `src/assets/pois/` substituídas por versões "Editado" com fundo transparente (PNG sem background)
- `POIMarker.tsx` — `mixBlendMode: 'multiply'` removido; estruturas aparecem pintadas no mapa sem retângulo

### Fix — POIs movidos para baixo +4% ✅ (2026-04-25)
- `mapData.ts` — todos os POIs (exceto Cidadela) tiveram `y` incrementado em +4 pontos percentuais

### Próximos Passos

- [ ] Continuar ajustando coordenadas dos POIs conforme necessário
- [ ] Criar a página real da Cidadela Interior (acessível pelo POI no mapa)
- [ ] Notificações PWA para missões diárias
- [ ] Sistema de conquistas/achievements
- [ ] Efeito sonoro ao reivindicar recompensa semanal

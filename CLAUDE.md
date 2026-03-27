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

### Fix — Skill Tree: disponibilidade de T2 após desbloquear T1 ✅ (2026-03-27)
- `prereqsMet(id)` adicionado ao skillStore — verifica só pré-requisitos, sem checar XP
- `canUnlock(id)` mantido para guard do unlock (prereqs + XP)
- `SkillNode` agora usa `prereqsMet` para o estado visual `'available'` e `canUnlock` só para habilitar o botão
- Quando pré-requisito cumprido mas XP insuficiente: card fica visível/disponível com texto "Precisa de N XP"

---

### Próximos Passos — Fase 4 (Loot, Inventário e Diário)

- [ ] `src/features/inventory/` — tela de inventário com itens coletados
- [ ] Sistema de loot ao completar missões (itens aleatórios por domínio)
- [ ] `src/features/journal/` — diário de jornada (log de missões completadas)
- [ ] Persistência de inventário no Supabase

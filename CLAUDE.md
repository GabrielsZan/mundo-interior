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

### Manutenção do CLAUDE.md
Ao final de cada sessão de trabalho ou quando houver progresso significativo, atualize a seção **Estado Atual do Projeto** abaixo com:
- O que foi implementado/alterado
- Próximos passos prioritários
- Qualquer decisão técnica relevante tomada

### Sincronização com GitHub
Após cada conjunto de alterações no projeto, faça commit e push automático para o repositório remoto (`origin main`). Use mensagens de commit descritivas no formato:
```
feat: <descrição breve do que foi adicionado>
fix: <descrição de correção>
refactor: <descrição de refatoração>
chore: <configuração, dependências, etc>
```
O repositório remoto é: `https://github.com/GabrielsZan/mundo-interior.git`

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

### Próximos Passos — Fase 2 (Árvore da Alma)

- [ ] `src/features/skill-tree/` — layout da árvore com 3 tiers por domínio
- [ ] `SkillNode` — nó de habilidade (locked/unlocked/available)
- [ ] `SkillTreePage` — tela com filtro de domínio, conexões SVG entre nós
- [ ] Integrar desbloqueio com `domainXP` do player
- [ ] Animação `shimmer` ao desbloquear habilidade

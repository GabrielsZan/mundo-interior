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

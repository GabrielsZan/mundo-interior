# 🏰 Mundo Interior

**Um Life-RPG gamificado para desenvolvimento pessoal, autoconhecimento e formação de hábitos.**

Transforme suas tarefas diárias e rotinas em uma aventura de RPG, com progressão de personagem, árvore de habilidades, mapa explorável e mecânicas de crafting.

## 🎮 Conceito

A jornada de autoaperfeiçoamento é uma aventura épica e introspectiva. O foco não é apenas "completar tarefas", mas entender *como* cada tarefa molda o "mundo interior" do jogador.

## 🛠️ Stack Técnica

| Camada | Tecnologia |
|--------|-----------|
| Frontend | React 18 + TypeScript |
| Build | Vite |
| Estilização | Tailwind CSS + CSS Modules |
| Estado | Zustand |
| Backend | Supabase (PostgreSQL) |
| Deploy | Vercel/Netlify (PWA) |

## 🗺️ Mecânicas Principais

- **4 Domínios:** Mente 🌿 · Corpo 🏔️ · Alma 💧 · Criação 🌲
- **Sistema de Missões:** Diárias, Principais e Épicas
- **Árvore da Alma:** ~80 habilidades desbloqueáveis com XP de domínio
- **Mapa do Mundo Interior:** Exploração com Fog of War
- **Cidadela Interior:** Reconstrução e personalização de longo prazo
- **Loot & Crafting:** Recompensas tangíveis e equipamentos

## 📁 Estrutura do Projeto

```
mundo-interior/
├── docs/                          # Documentos de design e planejamento
│   ├── Game_Design_Document.docx  # GDD completo
│   ├── World_Map_System.docx      # Especificação do sistema de mapa
│   └── Development_Roadmap.docx   # Plano de desenvolvimento e roadmap
├── design-references/             # Protótipos visuais (Stitch)
├── src/                           # Código fonte (em desenvolvimento)
│   ├── components/                # Componentes reutilizáveis
│   ├── features/                  # Módulos por feature
│   ├── hooks/                     # Custom hooks
│   ├── stores/                    # Zustand stores
│   ├── lib/                       # Utilitários e clients
│   ├── types/                     # TypeScript types
│   ├── styles/                    # CSS global e tema
│   └── assets/                    # Imagens, ícones, sons
├── supabase/                      # Migrations e seed data
└── public/                        # PWA manifest e assets estáticos
```

## 🚀 Fases de Desenvolvimento

1. **Fase 1:** Fundação e Core Loop (missões, XP, leveling)
2. **Fase 2:** Árvore da Alma (skill tree interativa)
3. **Fase 3:** Mapa do Mundo Interior (exploração, fog of war)
4. **Fase 4:** Loot, Inventário e Diário
5. **Fase 5:** Cidadela Interior e Eventos

## 🎨 Estilo Visual

Ghibli-esque — suave, pintado, acolhedor e nostálgico. Paleta quente com tons de pergaminho, verde sálvia, terracota e azul céu.

## 📄 Licença

Projeto privado em desenvolvimento.

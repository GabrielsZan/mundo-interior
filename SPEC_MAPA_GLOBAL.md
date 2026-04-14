# Especificação Técnica — Sistema de Mapa Global

## Contexto do Projeto

Estou criando um app de **desenvolvimento pessoal gamificado** em **React Native**. O app usa uma temática fantasy/RPG onde o usuário "explora" locais no mapa para realizar atividades de bem-estar e crescimento pessoal.

O sistema de mapa global é inspirado no jogo "Last Day on Earth: Survival" (LDOE) — funciona como uma **tela de seleção de destinos** onde o usuário vê o mapa de cima, pode dar zoom e arrastar, e toca nos pontos de interesse (POIs) para interagir. Não é um mapa aberto onde o personagem anda livremente.

### Categorias de POIs

O app tem **20 POIs** divididos em **4 categorias**, cada uma com 5 locais:

| Categoria | Cor da Borda | Região do Mapa | POIs |
|-----------|-------------|-----------------|------|
| **Alma** | Rosa/Lilás `#C77DBA` | Cerejeiras e rio (nordeste) | Jardim da Gratidão, Templo de Meditação, Praça Social, Santuário da Empatia, Santuário do Silêncio |
| **Corpo** | Laranja `#E8913A` | Planícies secas (sul/sudoeste) | Campo de Treino, Jardim Nutricional, Santuário do Descanso, Santuário da Postura, Fonte de Cura |
| **Criação** | Vermelho quente `#D4654A` | Floresta de outono (oeste) | Guilda dos Escritores, Estúdio de Arte, Salão de Música, Oficina de Criação, Laboratório de Inovação |
| **Mente** | Azul `#5B8EC4` | Montanhas/rochas (norte/noroeste) | Grande Biblioteca, Torre do Foco, Observatório Celestial, Templo de Estudo, Arquivo da Memória |

A **dificuldade** não é indicada por cor — ela é implícita pela **distância da home base** (centro do mapa). POIs mais próximos da base são mais fáceis/rápidos de acessar, POIs mais distantes custam mais energia e tempo.

Cada POI tem uma **imagem customizada** em estilo aquarela/isométrico que será usada como ícone no mapa e imagem de destaque no bottom sheet.

---

## Asset do Mapa

- **Imagem de fundo**: `fantasy_world_map_final_combined_upscayl_6x_remacri-4x.png`
- Resolução original: **15048 x 10032 px** (~177MB) — usar versão reduzida no app!
- Proporção: 3:2 (landscape)
- Ilustração estilo cartoon/painted de um mundo fantasy com vista aérea angular
- A imagem tem: ruínas centrais (home base), florestas de outono (oeste), cerejeiras com rio (leste), montanhas nevadas e pinheiros (norte), planícies abertas (sul)
- Caminhos naturais já desenhados conectando as regiões
- **IMPORTANTE**: Redimensionar para ~3000x2000px (~2-4MB) antes de usar no app. A imagem original de 177MB vai causar crash no dispositivo.

---

## Funcionalidades Obrigatórias

### 1. Mapa com Zoom e Pan

- **Pinch-to-zoom**: O jogador pode usar dois dedos para dar zoom in/out no mapa
- **Pan/arrastar**: O jogador pode arrastar o mapa para navegar
- **Limites de zoom**: Definir zoom mínimo (mapa inteiro visível) e zoom máximo (detalhes dos POIs)
- **Limites de pan**: O jogador não pode arrastar para além das bordas da imagem
- **Sugestão de lib**: `react-native-gesture-handler` + `react-native-reanimated` para gestos fluidos, ou avaliar `react-native-zoom-toolkit` / `react-native-image-zoom`

### 2. Pontos de Interesse (POIs)

Os POIs são os locais que o jogador pode visitar no mapa. Eles ficam posicionados em coordenadas específicas sobre a imagem de fundo.

#### Estrutura de dados de cada POI:

```typescript
type POICategory = 'alma' | 'corpo' | 'criacao' | 'mente';

interface PointOfInterest {
  id: string;
  name: string;                    // Ex: "Jardim da Gratidão", "Torre do Foco"
  description: string;             // Descrição curta do local
  category: POICategory;           // Categoria do POI (define cor da borda e região)
  position: {
    x: number;                     // Posição X em % da largura da imagem (0-100)
    y: number;                     // Posição Y em % da altura da imagem (0-100)
  };
  icon: {
    type: 'emoji' | 'image';
    value: string | ImageSourcePropType;
    // Se type === 'emoji': value é uma string de emoji (ex: '🌳')
    // Se type === 'image': value é um require() de imagem (ex: require('../assets/pois/local.png'))
  };
  unlocked: boolean;               // Se o local está desbloqueado ou não
  unlockCondition?: string;        // Texto descritivo da condição (ex: "Complete a quest X")
  isEvent?: boolean;               // Se é um evento temporário
  eventExpiresAt?: number;         // Timestamp de quando o evento expira
  isHomeBase?: boolean;            // Se é a home base (POI especial)
}
```

#### Renderização dos POIs — Componente `POIMarker`

O `POIMarker` é o componente mais importante do mapa. Ele precisa lidar com dois tipos de ícone (emoji e imagem customizada) e múltiplos estados visuais.

##### Estrutura visual do marcador:

```
┌─────────────────────────────┐
│  Sombra (shadow) por baixo  │
│                             │
│  ┌───────────────────────┐  │
│  │ Borda colorida (4px)  │  │
│  │ (cor = categoria)   │  │
│  │                       │  │
│  │  ┌─────────────────┐  │  │
│  │  │                 │  │  │
│  │  │  Ícone central  │  │  │
│  │  │  (emoji ou img) │  │  │
│  │  │                 │  │  │
│  │  └─────────────────┘  │  │
│  │                       │  │
│  └───────────────────────┘  │
│                             │
│  Nome do local (abaixo)     │
└─────────────────────────────┘
```

##### Tamanhos:

- **Tamanho total do marcador**: 64x64 pts (tamanho base, antes do zoom)
- **Borda**: 3px de espessura
- **borderRadius**: 50% (círculo perfeito)
- **Nome do local**: fontSize 11, fontWeight 600, cor branca com sombra preta sutil, posicionado abaixo do círculo com 4px de gap
- **Home Base**: 76x76 pts (um pouco maior que os outros)

##### Cores da borda por categoria:

```typescript
const CATEGORY_COLORS = {
  alma: {
    border: '#C77DBA',             // Rosa/Lilás
    glow: 'rgba(199, 125, 186, 0.5)',
    label: 'Alma',
    emoji: '💜',
  },
  corpo: {
    border: '#E8913A',             // Laranja
    glow: 'rgba(232, 145, 58, 0.5)',
    label: 'Corpo',
    emoji: '🧡',
  },
  criacao: {
    border: '#D4654A',             // Vermelho quente
    glow: 'rgba(212, 101, 74, 0.5)',
    label: 'Criação',
    emoji: '❤️‍🔥',
  },
  mente: {
    border: '#5B8EC4',             // Azul
    glow: 'rgba(91, 142, 196, 0.5)',
    label: 'Mente',
    emoji: '💙',
  },
};

// Home base tem cor especial (dourada)
const HOME_BASE_COLORS = {
  border: '#FFD700',
  glow: 'rgba(255, 215, 0, 0.6)',
};
```

##### Renderização do ícone central — DOIS MODOS:

**Modo 1: Emoji** (`icon.type === 'emoji'`)
```tsx
// Fundo circular semi-transparente escuro + emoji centralizado
<View style={{
  width: 64, height: 64,
  borderRadius: 32,
  borderWidth: 3,
  borderColor: CATEGORY_COLORS[poi.category].border,
  backgroundColor: 'rgba(20, 15, 10, 0.75)',  // fundo escuro semi-transparente
  justifyContent: 'center',
  alignItems: 'center',
}}>
  <Text style={{ fontSize: 28 }}>{poi.icon.value}</Text>
</View>
```

**Modo 2: Imagem customizada** (`icon.type === 'image'`)
```tsx
// A imagem do POI preenche o círculo inteiro, recortada com borderRadius
// A borda colorida fica POR CIMA como um anel
<View style={{
  width: 64, height: 64,
  borderRadius: 32,
  borderWidth: 3,
  borderColor: CATEGORY_COLORS[poi.category].border,
  overflow: 'hidden',  // IMPORTANTE: recorta a imagem no círculo
}}>
  <Image
    source={poi.icon.value}  // require('../assets/pois/nome.png')
    style={{
      width: '100%',
      height: '100%',
      resizeMode: 'cover',  // preenche o círculo, corta as bordas
    }}
  />
</View>
```

**IMPORTANTE sobre imagens de POI:**
- As imagens dos POIs são ilustrações isométricas/aquarela com fundo claro (bege/branco)
- O `resizeMode: 'cover'` vai recortar a imagem pra caber no círculo — o centro da imagem fica visível
- Se a imagem tiver muito "fundo vazio" nas bordas, pode precisar ajustar com um leve zoom (scale: 1.2) pra focar no conteúdo central
- Tamanho recomendado das imagens: 256x256px ou 512x512px (quadradas, já que vão ser recortadas em círculo)

##### Estados visuais:

**Estado: Desbloqueado (normal)**
- Marcador em cores normais
- Animação de glow suave pulsante na borda (loop infinito, opacity 0.3 → 0.7 → 0.3, duração ~2s)
- Tappable (onPress abre o bottom sheet)

```tsx
// Animação de glow com Reanimated
const glowOpacity = useSharedValue(0.3);

useEffect(() => {
  glowOpacity.value = withRepeat(
    withSequence(
      withTiming(0.7, { duration: 1000 }),
      withTiming(0.3, { duration: 1000 }),
    ),
    -1, // loop infinito
    false,
  );
}, []);

// O glow é uma View absolutamente posicionada ATRÁS do marcador
<Animated.View style={{
  position: 'absolute',
  width: 72, height: 72,  // um pouco maior que o marcador
  borderRadius: 36,
  backgroundColor: CATEGORY_COLORS[poi.category].glow,
  opacity: glowOpacity,
}} />
```

**Estado: Bloqueado**
- Marcador inteiro com `opacity: 0.5`
- Borda em cinza (`#666666`) ao invés da cor de dificuldade
- Sem animação de glow
- Overlay de cadeado: ícone 🔒 (fontSize 20) posicionado no centro, por cima do ícone normal
- A imagem/emoji fica com um filtro escurecido (overlay preto com opacity 0.4)
- Tappable (onPress abre o modal de bloqueado)

```tsx
// Overlay de bloqueio por cima da imagem/emoji
{!poi.unlocked && (
  <>
    {/* Escurece o conteúdo */}
    <View style={{
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      borderRadius: 32,
    }} />
    {/* Ícone de cadeado centralizado */}
    <View style={{
      ...StyleSheet.absoluteFillObject,
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <Text style={{ fontSize: 20 }}>🔒</Text>
    </View>
  </>
)}
```

**Estado: Evento temporário**
- Tudo igual ao desbloqueado, MAS:
- Animação de pulso mais rápida e intensa (scale 1.0 → 1.15 → 1.0, duração ~1.2s)
- Badge de countdown no canto superior direito do marcador

```tsx
// Badge de timer
<View style={{
  position: 'absolute',
  top: -8,
  right: -12,
  backgroundColor: '#E53935',
  borderRadius: 10,
  paddingHorizontal: 6,
  paddingVertical: 2,
  minWidth: 40,
}}>
  <Text style={{
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700',
    textAlign: 'center',
  }}>
    {formatTime(poi.eventExpiresAt)}  {/* Ex: "23:41" */}
  </Text>
</View>
```

**Estado: Home Base**
- Tamanho maior: 76x76 pts
- Borda dourada (#FFD700) com 4px de espessura
- Glow dourado mais forte
- Sem estado bloqueado (sempre acessível)
- Label "Sua Base" ao invés do nome

##### Escala com zoom:

Os marcadores devem acompanhar o zoom do mapa proporcionalmente. Porém, pra não ficarem microscópicos no zoom out ou gigantes no zoom in, aplicar limites:

```typescript
const BASE_MARKER_SIZE = 64;
const MIN_SCALE = 0.6;   // No zoom out máximo, marcador fica 60% do tamanho
const MAX_SCALE = 1.4;   // No zoom in máximo, marcador fica 140% do tamanho

// Calcular escala do marcador baseada no zoom atual
const markerScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, currentZoom));
```

##### Sombra:

Todos os marcadores têm uma sombra sutil pra "descolar" do mapa:

```typescript
const MARKER_SHADOW = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 3 },
  shadowOpacity: 0.35,
  shadowRadius: 5,
  elevation: 6,  // Android
};
```

### 3. Interação com POI (Popup/Modal)

Quando o jogador toca em um POI **desbloqueado**, abre um **bottom sheet ou modal** com:

- **Imagem do local em destaque** (se `icon.type === 'image'`):
  - Exibir a imagem original (sem recorte circular) no topo do bottom sheet
  - Tamanho: largura total do sheet, altura ~180px, `resizeMode: 'cover'`
  - Bordas arredondadas no topo (borderTopLeftRadius: 16, borderTopRightRadius: 16)
  - Se `icon.type === 'emoji'`: exibir o emoji grande (fontSize 48) centralizado num bloco de fundo com gradiente suave
- **Nome do local** (título grande, fontSize 20, fontWeight 700)
- **Badge de categoria** ao lado do nome:
  - Círculo pequeno na cor da categoria + texto ("Alma" / "Corpo" / "Criação" / "Mente")
  - Cores: mesmas do `CATEGORY_COLORS`
- **Descrição** do local (fontSize 14, cor suave)
- **Botão principal**: "Explorar" (botão grande, cor da categoria do local)

Quando o jogador toca em um POI **bloqueado**, abre um modal menor com:

- **Imagem escurecida** (se tiver) com overlay escuro + cadeado centralizado
- **Nome do local** (em cinza, fontSize 18)
- **Texto da condição de desbloqueio** (ex: "Complete a Quest 'Caminho do Sobrevivente' Fase 3")
- **Sem botões de ação**, apenas botão de fechar

### 4. Home Base (Ponto Central)

- A home base é um POI especial fixo no **centro do mapa** (nas ruínas da imagem)
- Tem visual diferenciado: borda dourada, ícone de casa/castelo, glow dourado
- Sempre desbloqueado
- Ao tocar: abre opções diferentes dos POIs normais (navega para tela da base)
- Um indicador visual (seta, pulso) mostra onde a base está quando o jogador dá zoom longe

### 5. Linhas de Caminho (Opcional mas Desejado)

- Linhas pontilhadas ou tracejadas conectando a home base aos POIs
- A cor da linha segue a **categoria** do destino (rosa pra Alma, laranja pra Corpo, etc)
- Linhas para POIs bloqueados ficam em cinza e mais transparentes
- As linhas seguem um caminho levemente curvado (não retas puras) para parecerem naturais

---

## Como Adicionar Novos POIs

Os POIs serão definidos futuramente. O sistema deve ser construído de forma que adicionar um novo POI seja **apenas adicionar um objeto no array**, sem tocar em nenhum componente.

### Passo a passo para adicionar um POI com imagem customizada:

**1. Preparar a imagem:**
- Gerar a ilustração do local (estilo aquarela/isométrico, fundo claro bege)
- Salvar como PNG quadrado, idealmente 512x512px
- Nomear seguindo o padrão: `{categoria}-{número}_{nome_snake_case}.png`
- Colocar em: `assets/pois/`
- A imagem será recortada em círculo pelo componente, então o conteúdo importante deve estar centralizado

**Arquivos de imagem já existentes (20 POIs):**
```
assets/pois/
  alma-1_jardim_da_gratidao.png
  alma-2_templo_de_meditacao.png
  alma-3_praca_social.png
  alma-4_santuario_da_empatia.png
  alma-5_santuario_do_silencio.png
  corpo-1_campo_de_treino.png
  corpo-2_jardim_nutricional.png
  corpo-3_santuario_do_descanso.png
  corpo-4_santuario_da_postura.png
  corpo-5_fonte_de_cura.png
  criacao-1_guilda_dos_escritores.png
  criacao-2_estudio_de_arte.png
  criacao-3_salao_de_musica.png
  criacao-4_oficina_de_criacao.png
  criacao-5_laboratorio_de_inovacao.png
  mente-1_grande_biblioteca.png
  mente-2_torre_do_foco.png
  mente-3_observatorio_celestial.png
  mente-4_templo_de_estudo.png
  mente-5_arquivo_da_memoria.png
```

**2. Adicionar o objeto no array de POIs (exemplos):**

```typescript
// Exemplo com imagem customizada
{
  id: 'corpo_3_santuario_do_descanso',
  name: 'Santuário do Descanso',
  description: 'Um refúgio aconchegante com fogueira e riacho. Recupere energia aqui.',
  category: 'corpo',
  position: { x: 58, y: 86 },
  icon: {
    type: 'image',
    value: require('../assets/pois/corpo-3_santuario_do_descanso.png'),
  },
  unlocked: true,
  travelTime: 12,
  energyCost: 15,
}
```

**3. Encontrar a posição (x, y):**
- Abrir a imagem do mapa em um editor de imagem
- Localizar onde o POI deve ficar
- Calcular a posição em porcentagem: `x = (pixelX / larguraTotal) * 100`, `y = (pixelY / alturaTotal) * 100`
- Testar no app e ajustar se necessário

---

## Coordenadas de Todos os POIs (Posições Finais)

As coordenadas são em **porcentagem (0-100)** da imagem do mapa. Foram mapeadas manualmente sobre a imagem marcada. Podem precisar de ajustes finos no app.

```typescript
const ALL_POIS: PointOfInterest[] = [

  // ═══════════════════════════════════════
  // HOME BASE (centro do mapa, ruínas)
  // ═══════════════════════════════════════
  {
    id: 'home',
    name: 'Ruínas Ancestrais',
    description: 'Sua base principal. Organize suas jornadas aqui.',
    category: 'alma' as POICategory, // categoria irrelevante pra base
    position: { x: 47.5, y: 45.5 },
    icon: { type: 'image', value: require('../assets/pois/home_base.png') },
    unlocked: true,
    travelTime: 0,
    energyCost: 0,
    isHomeBase: true,
  },

  // ═══════════════════════════════════════
  // ALMA — Região Leste (cerejeiras e rio)
  // Cor da borda: Rosa #C77DBA
  // ═══════════════════════════════════════
  {
    id: 'alma_1_jardim_da_gratidao',
    name: 'Jardim da Gratidão',
    description: 'Um jardim florido com cerejeiras e fonte. Pratique a gratidão diária.',
    category: 'alma',
    position: { x: 64, y: 40 },
    icon: { type: 'image', value: require('../assets/pois/alma-1_jardim_da_gratidao.png') },
    unlocked: true,
    travelTime: 8,
    energyCost: 10,
  },
  {
    id: 'alma_2_templo_de_meditacao',
    name: 'Templo de Meditação',
    description: 'Um templo zen com jardim de pedras e lago. Medite e encontre paz interior.',
    category: 'alma',
    position: { x: 76, y: 38 },
    icon: { type: 'image', value: require('../assets/pois/alma-2_templo_de_meditacao.png') },
    unlocked: true,
    travelTime: 12,
    energyCost: 15,
  },
  {
    id: 'alma_3_praca_social',
    name: 'Praça Social',
    description: 'Uma praça acolhedora com bancos e luzes. Conecte-se com outros.',
    category: 'alma',
    position: { x: 72, y: 58 },
    icon: { type: 'image', value: require('../assets/pois/alma-3_praca_social.png') },
    unlocked: true,
    travelTime: 10,
    energyCost: 12,
  },
  {
    id: 'alma_4_santuario_da_empatia',
    name: 'Santuário da Empatia',
    description: 'Um santuário com lago em forma de coração e cristais. Desenvolva empatia.',
    category: 'alma',
    position: { x: 88, y: 62 },
    icon: { type: 'image', value: require('../assets/pois/alma-4_santuario_da_empatia.png') },
    unlocked: false,
    unlockCondition: 'Complete 5 sessões na Praça Social',
    travelTime: 18,
    energyCost: 22,
  },
  {
    id: 'alma_5_santuario_do_silencio',
    name: 'Santuário do Silêncio',
    description: 'Um santuário atrás das cachoeiras. O silêncio traz clareza.',
    category: 'alma',
    position: { x: 93, y: 15 },
    icon: { type: 'image', value: require('../assets/pois/alma-5_santuario_do_silencio.png') },
    unlocked: false,
    unlockCondition: 'Complete 10 meditações no Templo',
    travelTime: 25,
    energyCost: 30,
  },

  // ═══════════════════════════════════════
  // CORPO — Região Sul (planícies abertas)
  // Cor da borda: Laranja #E8913A
  // ═══════════════════════════════════════
  {
    id: 'corpo_1_campo_de_treino',
    name: 'Campo de Treino',
    description: 'Uma arena cercada com equipamentos de treino. Fortaleça seu corpo.',
    category: 'corpo',
    position: { x: 43, y: 72 },
    icon: { type: 'image', value: require('../assets/pois/corpo-1_campo_de_treino.png') },
    unlocked: true,
    travelTime: 8,
    energyCost: 10,
  },
  {
    id: 'corpo_2_jardim_nutricional',
    name: 'Jardim Nutricional',
    description: 'Uma horta variada com poço e celeiro. Aprenda sobre nutrição.',
    category: 'corpo',
    position: { x: 52, y: 80 },
    icon: { type: 'image', value: require('../assets/pois/corpo-2_jardim_nutricional.png') },
    unlocked: true,
    travelTime: 10,
    energyCost: 12,
  },
  {
    id: 'corpo_3_santuario_do_descanso',
    name: 'Santuário do Descanso',
    description: 'Uma cabana aconchegante com fogueira e rede. Cuide do seu sono.',
    category: 'corpo',
    position: { x: 58, y: 86 },
    icon: { type: 'image', value: require('../assets/pois/corpo-3_santuario_do_descanso.png') },
    unlocked: true,
    travelTime: 12,
    energyCost: 15,
  },
  {
    id: 'corpo_4_santuario_da_postura',
    name: 'Santuário da Postura',
    description: 'Um deck com espelho e lanternas. Melhore sua postura e presença.',
    category: 'corpo',
    position: { x: 30, y: 70 },
    icon: { type: 'image', value: require('../assets/pois/corpo-4_santuario_da_postura.png') },
    unlocked: false,
    unlockCondition: 'Complete 5 treinos no Campo de Treino',
    travelTime: 15,
    energyCost: 18,
  },
  {
    id: 'corpo_5_fonte_de_cura',
    name: 'Fonte de Cura',
    description: 'Uma fonte termal mágica com águas curativas. Recuperação profunda.',
    category: 'corpo',
    position: { x: 18, y: 82 },
    icon: { type: 'image', value: require('../assets/pois/corpo-5_fonte_de_cura.png') },
    unlocked: false,
    unlockCondition: 'Alcance nível 15 de Corpo',
    travelTime: 22,
    energyCost: 28,
  },

  // ═══════════════════════════════════════
  // CRIAÇÃO — Região Oeste (floresta de outono)
  // Cor da borda: Vermelho #D4654A
  // ═══════════════════════════════════════
  {
    id: 'criacao_1_guilda_dos_escritores',
    name: 'Guilda dos Escritores',
    description: 'Uma casa rústica cheia de livros e um gato dormindo. Escreva e crie.',
    category: 'criacao',
    position: { x: 28, y: 45 },
    icon: { type: 'image', value: require('../assets/pois/criacao-1_guilda_dos_escritores.png') },
    unlocked: true,
    travelTime: 8,
    energyCost: 10,
  },
  {
    id: 'criacao_2_estudio_de_arte',
    name: 'Estúdio de Arte',
    description: 'Um ateliê colorido com telas e flores. Expresse sua criatividade visual.',
    category: 'criacao',
    position: { x: 22, y: 32 },
    icon: { type: 'image', value: require('../assets/pois/criacao-2_estudio_de_arte.png') },
    unlocked: true,
    travelTime: 10,
    energyCost: 12,
  },
  {
    id: 'criacao_3_salao_de_musica',
    name: 'Salão de Música',
    description: 'Um palco curvo com harpa e tambores. Explore a música e o ritmo.',
    category: 'criacao',
    position: { x: 18, y: 40 },
    icon: { type: 'image', value: require('../assets/pois/criacao-3_salao_de_musica.png') },
    unlocked: true,
    travelTime: 12,
    energyCost: 15,
  },
  {
    id: 'criacao_4_oficina_de_criacao',
    name: 'Oficina de Criação',
    description: 'Uma oficina com forja e ferramentas. Construa algo com as mãos.',
    category: 'criacao',
    position: { x: 14, y: 22 },
    icon: { type: 'image', value: require('../assets/pois/criacao-4_oficina_de_criacao.png') },
    unlocked: false,
    unlockCondition: 'Complete 5 sessões criativas',
    travelTime: 18,
    energyCost: 22,
  },
  {
    id: 'criacao_5_laboratorio_de_inovacao',
    name: 'Laboratório de Inovação',
    description: 'Um lab steampunk com cúpula de vidro. Inove e experimente.',
    category: 'criacao',
    position: { x: 6, y: 28 },
    icon: { type: 'image', value: require('../assets/pois/criacao-5_laboratorio_de_inovacao.png') },
    unlocked: false,
    unlockCondition: 'Complete todas as outras estações de Criação',
    travelTime: 25,
    energyCost: 30,
  },

  // ═══════════════════════════════════════
  // MENTE — Região Norte (montanhas e pinheiros)
  // Cor da borda: Azul #5B8EC4
  // ═══════════════════════════════════════
  {
    id: 'mente_1_grande_biblioteca',
    name: 'Grande Biblioteca',
    description: 'Uma biblioteca imponente com cúpula verde. Aprenda e estude.',
    category: 'mente',
    position: { x: 40, y: 38 },
    icon: { type: 'image', value: require('../assets/pois/mente-1_grande_biblioteca.png') },
    unlocked: true,
    travelTime: 8,
    energyCost: 10,
  },
  {
    id: 'mente_2_torre_do_foco',
    name: 'Torre do Foco',
    description: 'Uma torre alta com cristal no topo. Treine concentração e foco.',
    category: 'mente',
    position: { x: 42, y: 28 },
    icon: { type: 'image', value: require('../assets/pois/mente-2_torre_do_foco.png') },
    unlocked: true,
    travelTime: 12,
    energyCost: 15,
  },
  {
    id: 'mente_3_observatorio_celestial',
    name: 'Observatório Celestial',
    description: 'Um observatório com telescópio e mapas estelares. Expanda sua visão.',
    category: 'mente',
    position: { x: 32, y: 18 },
    icon: { type: 'image', value: require('../assets/pois/mente-3_observatorio_celestial.png') },
    unlocked: true,
    travelTime: 15,
    energyCost: 18,
  },
  {
    id: 'mente_4_templo_de_estudo',
    name: 'Templo de Estudo',
    description: 'Um templo oriental com cerejeira e lanternas. Estudo profundo.',
    category: 'mente',
    position: { x: 56, y: 22 },
    icon: { type: 'image', value: require('../assets/pois/mente-4_templo_de_estudo.png') },
    unlocked: false,
    unlockCondition: 'Complete 5 sessões na Biblioteca',
    travelTime: 18,
    energyCost: 22,
  },
  {
    id: 'mente_5_arquivo_da_memoria',
    name: 'Arquivo da Memória',
    description: 'Um arquivo subterrâneo com cristais e runas. Fortaleça sua memória.',
    category: 'mente',
    position: { x: 52, y: 10 },
    icon: { type: 'image', value: require('../assets/pois/mente-5_arquivo_da_memoria.png') },
    unlocked: false,
    unlockCondition: 'Alcance nível 15 de Mente',
    travelTime: 25,
    energyCost: 30,
  },
];
```

**Nota**: As posições (x, y) podem precisar de ajustes finos após testar no dispositivo real. Os valores são aproximados baseados em mapeamento manual sobre a imagem.

### Diretrizes para imagens de POI:

- **Formato**: PNG com fundo claro (bege/branco) — não usar fundo transparente pois o recorte circular precisa de preenchimento
- **Tamanho**: 512x512px ideal. Mínimo 256x256px. Maior que 512 é desperdício pois será exibido em ~64px no mapa
- **Estilo**: Manter consistência visual — aquarela/painted, vista isométrica, mesmo estilo do "Santuário do Descanso" fornecido como referência
- **Composição**: Conteúdo principal centralizado, pois as bordas serão cortadas pelo círculo
- **Peso**: Manter abaixo de 200KB por imagem para não impactar performance do mapa

---

## Estrutura de Componentes Sugerida

```
src/
  features/
    map/
      MapScreen.tsx              // Tela principal do mapa
      components/
        MapView.tsx              // Imagem do mapa com zoom/pan
        POIMarker.tsx            // Marcador individual de POI
        POIDetailSheet.tsx       // Bottom sheet de detalhes do POI
        POILockedModal.tsx       // Modal para POI bloqueado
        HomeBaseMarker.tsx       // Marcador especial da base
        EventTimer.tsx           // Badge de countdown para eventos
        PathLine.tsx             // Linha de caminho entre base e POI
      hooks/
        useMapGestures.ts        // Hook para lógica de zoom/pan
        usePOIPositioning.ts     // Hook para calcular posição dos POIs no zoom atual
      data/
        pois.ts                  // Dados dos POIs
        mapConfig.ts             // Configurações do mapa (limites, zoom, etc)
      types/
        map.types.ts             // Types do TypeScript
```

---

## Notas Técnicas Importantes

1. **Performance**: A imagem do mapa original é **177MB (15048x10032px)** — IMPOSSÍVEL usar direto. Obrigatório:
   - Redimensionar para ~3000x2000px (ficará ~2-4MB em PNG ou ~500KB-1MB em JPEG de alta qualidade)
   - Usar JPEG se não precisar de transparência (muito menor)
   - Testar performance em dispositivo real
   - Se ainda pesado, considerar tiles (recortar em 4-6 pedaços) para carregar sob demanda

2. **Posicionamento dos POIs**: Usar coordenadas em porcentagem (0-100) da imagem original para que os pins fiquem no lugar certo independente do zoom. Calcular a posição absoluta multiplicando pela dimensão renderizada da imagem.

3. **Gestos**: O pinch-to-zoom e pan precisam ser muito fluidos. Priorizar `react-native-reanimated` v3+ com `react-native-gesture-handler` para animações no UI thread.

4. **Escalabilidade**: O sistema deve ser facilmente extensível — adicionar novos POIs deve ser só adicionar um objeto no array de dados, sem mudar código de componentes.

5. **Estado dos POIs**: Futuramente os dados virão de um backend/estado global (Redux, Zustand, etc). Por agora, usar dados hardcoded mas já com a estrutura de tipos correta.

---

## Referência Visual

O sistema de mapa é inspirado no mapa global do LDOE, adaptado para um app de desenvolvimento pessoal:
- Mapa estático (ilustração fantasy aquarela) como fundo com zoom/pan
- Ícones circulares posicionados sobre o mapa representando os 20 locais
- Cada local tem imagem customizada recortada em círculo, com borda na cor da sua categoria
- 4 regiões do mapa = 4 categorias (Alma no nordeste, Corpo no sul, Criação no oeste, Mente no norte)
- Locais bloqueados ficam acinzentados com cadeado
- A home base (ruínas centrais) fica no centro com destaque dourado
- Dificuldade = distância da base (mais longe = mais energia/tempo)
- O usuário toca no local → vê detalhes no bottom sheet → escolhe explorar

---

## O Que NÃO Está Nesta Spec

- Sistema de energia (será outro documento)
- Sistema de viagem/timer (será outro documento)
- Sistema de eventos temporários (será outro documento)
- Tela de exploração dentro do local (será outro documento)
- Backend/persistência de dados
- Sistema de quests/desbloqueio

Esta spec cobre **apenas o mapa global como tela de seleção de destinos**.

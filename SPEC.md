# Tower Defense Game — Product Specification

## Overview
A browser-based tower defense game built with **React 19, TypeScript, Vite, and HTML5 Canvas**.
Players place towers on a map to defend against waves of enemies traveling along a path.

## Tech Stack
- **Build Tool**: Vite 6
- **Framework**: React 19
- **Language**: TypeScript (strict mode)
- **Rendering**: HTML5 Canvas 2D API
- **State Management**: Zustand
- **Styling**: Tailwind CSS (for UI overlays only)
- **Icons**: lucide-react
- **Package Manager**: npm

## Game Concept
- Top-down 2D tower defense
- Grid-based map (20×15 tiles, each tile 40×40 pixels)
- Enemies follow a predefined path from entry to exit
- Player places towers on empty tiles adjacent to the path
- Towers auto-attack enemies in range
- Killing enemies earns gold to buy more towers
- Survive all waves to win

## Success Criteria (Ranked)
1. `npm run dev` starts, game loads at localhost:5173
2. A map renders with a visible path, grass, and decorations
3. Enemies spawn and walk along the path
4. Player can place towers by clicking empty tiles
5. Towers auto-shoot projectiles at enemies in range
6. Enemies take damage and die (with death animation)
7. Gold system: earn gold from kills, spend to place towers
8. Wave system: enemies come in waves with increasing difficulty
9. Lives system: enemies reaching the exit reduce lives
10. Win/lose conditions with appropriate screens
11. Multiple tower types with different stats
12. Multiple enemy types with different behaviors
13. Tower upgrades (3 levels per tower)
14. At least 3 playable maps
15. UI: tower shop, wave info, gold/lives display
16. `npm run build` succeeds with zero errors

## Architecture

```
src/
├── main.tsx                    # Entry point
├── App.tsx                     # Root component
├── game/
│   ├── engine/
│   │   ├── GameLoop.ts         # requestAnimationFrame loop
│   │   ├── Renderer.ts         # Canvas drawing
│   │   ├── InputHandler.ts     # Mouse/touch events on canvas
│   │   └── Camera.ts           # Viewport management
│   ├── entities/
│   │   ├── Entity.ts           # Base entity class
│   │   ├── Tower.ts            # Base tower class
│   │   ├── Enemy.ts            # Base enemy class
│   │   ├── Projectile.ts       # Base projectile class
│   │   └── Effect.ts           # Visual effect base
│   ├── towers/
│   │   ├── ArrowTower.ts       # Basic arrow tower
│   │   ├── CannonTower.ts      # Splash damage
│   │   ├── IceTower.ts         # Slows enemies
│   │   ├── FireTower.ts        # Burn DoT
│   │   ├── LightningTower.ts   # Chain lightning
│   │   ├── PoisonTower.ts      # Poison AoE
│   │   ├── SniperTower.ts      # Long range, high damage
│   │   ├── LaserTower.ts       # Continuous beam
│   │   ├── BombTower.ts        # Explosive projectiles
│   │   ├── SlowTower.ts        # Aura slow field
│   │   ├── GoldMine.ts         # Generates gold over time
│   │   └── TeslaTower.ts       # Area shock damage
│   ├── enemies/
│   │   ├── BasicEnemy.ts       # Standard walker
│   │   ├── FastEnemy.ts        # Double speed, low HP
│   │   ├── TankEnemy.ts        # Slow, very high HP
│   │   ├── FlyingEnemy.ts      # Ignores ground towers
│   │   ├── StealthEnemy.ts     # Invisible until close
│   │   ├── HealerEnemy.ts      # Heals nearby enemies
│   │   ├── SplitterEnemy.ts    # Splits into 2 on death
│   │   ├── ShieldEnemy.ts      # Has damage shield
│   │   ├── SpeedAuraEnemy.ts   # Speeds up nearby enemies
│   │   ├── BossGolem.ts        # Boss: high HP, slow
│   │   ├── BossDragon.ts       # Boss: flies, fire breath
│   │   └── BossNecromancer.ts  # Boss: summons minions
│   ├── projectiles/
│   │   ├── Arrow.ts            # Standard projectile
│   │   ├── Cannonball.ts       # AoE on impact
│   │   ├── IceShard.ts         # Applies slow
│   │   ├── Fireball.ts         # Applies burn
│   │   ├── LightningBolt.ts    # Chains to nearby
│   │   ├── PoisonCloud.ts      # Lingers as AoE
│   │   ├── Bullet.ts           # Fast, single target
│   │   └── LaserBeam.ts        # Instant hit, continuous
│   ├── effects/
│   │   ├── ExplosionEffect.ts  # Explosion animation
│   │   ├── HitEffect.ts       # Damage number popup
│   │   ├── SlowEffect.ts      # Ice/snow particles
│   │   ├── BurnEffect.ts      # Fire particles
│   │   ├── PoisonEffect.ts    # Green cloud
│   │   ├── DeathEffect.ts     # Enemy death poof
│   │   ├── SpawnEffect.ts     # Enemy spawn glow
│   │   └── LevelUpEffect.ts   # Tower upgrade sparkle
│   ├── maps/
│   │   ├── MapData.ts          # Map type definitions
│   │   ├── GrasslandsMap.ts    # Map 1: simple S-curve
│   │   ├── DesertMap.ts        # Map 2: zigzag path
│   │   ├── SnowfieldMap.ts     # Map 3: spiral path
│   │   ├── VolcanoMap.ts       # Map 4: split path (2 lanes)
│   │   ├── SwampMap.ts         # Map 5: winding path
│   │   └── CastleMap.ts       # Map 6: complex layout
│   ├── systems/
│   │   ├── WaveManager.ts      # Wave spawning logic
│   │   ├── PathSystem.ts       # Pathfinding / waypoints
│   │   ├── CollisionSystem.ts  # Projectile-enemy collision
│   │   ├── EconomySystem.ts    # Gold management
│   │   ├── DamageSystem.ts     # Damage calculation, buffs/debuffs
│   │   ├── UpgradeSystem.ts    # Tower upgrade logic
│   │   └── ParticleSystem.ts   # Particle emitter
│   └── config/
│       ├── TowerConfig.ts      # All tower stats (cost, damage, range, etc.)
│       ├── EnemyConfig.ts      # All enemy stats (HP, speed, reward, etc.)
│       ├── WaveConfig.ts       # Wave definitions per map
│       └── GameConstants.ts    # Grid size, tick rate, etc.
├── components/
│   ├── GameCanvas.tsx          # Canvas wrapper React component
│   ├── HUD.tsx                 # In-game heads-up display
│   ├── TowerShop.tsx           # Tower purchase panel
│   ├── TowerInfo.tsx           # Selected tower stats/upgrade
│   ├── WaveIndicator.tsx       # Current/total wave display
│   ├── MainMenu.tsx            # Title screen
│   ├── MapSelect.tsx           # Map selection grid
│   ├── PauseMenu.tsx           # Pause overlay
│   ├── VictoryScreen.tsx       # Win screen with stats
│   ├── DefeatScreen.tsx        # Lose screen
│   ├── SettingsPanel.tsx       # Volume, speed controls
│   └── Tooltip.tsx             # Hover tooltip component
├── store/
│   └── gameStore.ts            # Zustand global game state
├── types/
│   └── index.ts                # All TypeScript types
└── utils/
    ├── math.ts                 # Vector math, distance, angles
    ├── colors.ts               # Color palette constants
    └── canvas.ts               # Canvas drawing helpers
```

## Core Data Types

```typescript
export type Position = { x: number; y: number }

export type TileType = 'grass' | 'path' | 'water' | 'rock' | 'entry' | 'exit'

export type Tile = {
  type: TileType
  gridX: number
  gridY: number
  tower: TowerInstance | null
}

export type GameMap = {
  id: string
  name: string
  width: number       // grid columns (20)
  height: number      // grid rows (15)
  tiles: TileType[][] // 2D array
  path: Position[]    // waypoints enemies follow
  entryPoint: Position
  exitPoint: Position
  waves: WaveDefinition[]
}

export type TowerType =
  | 'arrow' | 'cannon' | 'ice' | 'fire' | 'lightning'
  | 'poison' | 'sniper' | 'laser' | 'bomb' | 'slow'
  | 'goldmine' | 'tesla'

export type TowerStats = {
  type: TowerType
  name: string
  cost: number
  damage: number
  range: number         // in tiles
  fireRate: number      // shots per second
  projectileSpeed: number
  upgradeCosts: [number, number, number]  // cost for level 2, 3, 4
  damagePerLevel: number   // damage increase per upgrade
  rangePerLevel: number
  special: string       // description of special ability
  color: string         // hex color for rendering
  canTargetFlying: boolean
}

export type TowerInstance = {
  id: string
  type: TowerType
  level: number         // 1-4
  gridX: number
  gridY: number
  currentTarget: string | null  // enemy id
  lastFireTime: number
  totalDamageDealt: number
  totalKills: number
}

export type EnemyType =
  | 'basic' | 'fast' | 'tank' | 'flying' | 'stealth'
  | 'healer' | 'splitter' | 'shield' | 'speedaura'
  | 'boss_golem' | 'boss_dragon' | 'boss_necromancer'

export type EnemyStats = {
  type: EnemyType
  name: string
  maxHP: number
  speed: number         // tiles per second
  reward: number        // gold on kill
  armor: number         // flat damage reduction
  isFlying: boolean
  isBoss: boolean
  color: string
  size: number          // radius in pixels
  special: string       // description
}

export type EnemyInstance = {
  id: string
  type: EnemyType
  hp: number
  maxHP: number
  x: number             // pixel position
  y: number
  speed: number         // current speed (may be debuffed)
  pathIndex: number     // current waypoint index
  progress: number      // 0-1 between waypoints
  effects: StatusEffect[]
  isAlive: boolean
  isVisible: boolean    // for stealth
}

export type StatusEffect = {
  type: 'slow' | 'burn' | 'poison' | 'stun'
  duration: number      // seconds remaining
  magnitude: number     // slow %, damage/tick, etc.
  sourceId: string      // tower that applied it
}

export type ProjectileInstance = {
  id: string
  type: string
  x: number
  y: number
  targetId: string
  damage: number
  speed: number
  effect: StatusEffect | null
  isAoE: boolean
  aoERadius: number
}

export type WaveDefinition = {
  waveNumber: number
  groups: EnemyGroup[]
  delayBetweenGroups: number  // seconds
}

export type EnemyGroup = {
  enemyType: EnemyType
  count: number
  spawnInterval: number  // seconds between spawns
}

export type GameState = 'menu' | 'map_select' | 'playing' | 'paused' | 'victory' | 'defeat'

export type GameStore = {
  // State
  gameState: GameState
  currentMap: GameMap | null
  gold: number
  lives: number
  currentWave: number
  totalWaves: number
  score: number
  speed: number           // 1x, 2x, 3x
  selectedTower: TowerType | null
  selectedPlacedTower: TowerInstance | null
  towers: TowerInstance[]
  enemies: EnemyInstance[]
  projectiles: ProjectileInstance[]
  // Actions
  startGame: (mapId: string) => void
  placeTower: (type: TowerType, gridX: number, gridY: number) => void
  upgradeTower: (towerId: string) => void
  sellTower: (towerId: string) => void
  startWave: () => void
  togglePause: () => void
  setSpeed: (speed: number) => void
  selectTower: (type: TowerType | null) => void
  selectPlacedTower: (tower: TowerInstance | null) => void
  addGold: (amount: number) => void
  removeLife: () => void
  tick: (deltaTime: number) => void
}
```

## Visual Design
- Canvas: 800×600 pixels (20×15 grid of 40px tiles)
- Towers: colored circles with range ring on hover
- Enemies: colored shapes (circles for ground, diamonds for flying, large for bosses)
- Projectiles: small colored dots/lines moving toward targets
- Path: sandy/brown color on grass green background
- Health bars: small red/green bar above enemies
- UI: overlaid React components with Tailwind, semi-transparent dark panels
- Color palette: earthy/medieval tones

## Hard Constraints
- No backend, no database — pure client-side
- No `any` type — strict TypeScript
- No placeholder code, no TODOs
- Max 200 lines per file
- Named exports only
- All game logic in `src/game/`, all React UI in `src/components/`
- Canvas for game rendering, React DOM for UI overlays
- 60 FPS target

## Acceptance Tests
1. `npm run build` succeeds with zero errors
2. Game loads to main menu
3. Can select a map and start game
4. Enemies spawn and walk the path
5. Can place at least 3 different tower types
6. Towers shoot projectiles at enemies
7. Enemies die and drop gold
8. Can upgrade a tower
9. Wave counter advances
10. Lives decrease when enemy reaches exit
11. Game over screen when lives reach 0
12. Victory screen after all waves cleared
13. At least 3 maps selectable
14. Can pause and resume
15. Game speed toggle works (1x/2x/3x)

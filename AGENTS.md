# Agent Guidelines

## Before You Start
1. Read `SPEC.md` fully — it is your single source of truth
2. Run `git log --oneline -20` to see what has been built
3. Only work on your assigned task

## Code Standards
- TypeScript strict mode (`npx tsc --noEmit` must pass)
- Commit format: `feat: <description>` or `fix: <description>`
- One commit per task
- Named exports only (no `export default`)
- No `any`, `@ts-ignore`, or `@ts-expect-error`
- No TODO, FIXME, or placeholder code
- Max 200 lines per file
- All game entities extend the base classes defined in src/game/entities/

## Type Imports
Always import types from `src/types/index.ts`:
```typescript
import { TowerStats, EnemyStats, Position } from '../../types'
```

## Tower Implementation Pattern
Every tower file must export:
```typescript
import { TowerStats } from '../../types'
export const arrowTowerStats: TowerStats = { ... }
export const renderArrowTower = (ctx: CanvasRenderingContext2D, x: number, y: number, level: number) => { ... }
```

## Enemy Implementation Pattern
Every enemy file must export:
```typescript
import { EnemyStats } from '../../types'
export const basicEnemyStats: EnemyStats = { ... }
export const renderBasicEnemy = (ctx: CanvasRenderingContext2D, x: number, y: number, hp: number, maxHP: number) => { ... }
```

## Map Implementation Pattern
Every map file must export:
```typescript
import { GameMap } from '../../types'
export const grasslandsMap: GameMap = { ... }
```

## Projectile Pattern
```typescript
export const renderArrow = (ctx: CanvasRenderingContext2D, x: number, y: number, angle: number) => { ... }
```

## Effect Pattern
```typescript
export const renderExplosion = (ctx: CanvasRenderingContext2D, x: number, y: number, progress: number) => { ... }
```

## Task Workflow
1. `git clone <repo> /workspace && cd /workspace`
2. `git checkout -b task-<id>`
3. `npm install` (if node_modules missing)
4. Implement your task following the patterns above
5. `git add <your files>`
6. `git commit -m "feat: <description>"`
7. `git push origin task-<id>`

## Boundaries
- Do NOT modify files outside your assigned scope
- Import types from `src/types/index.ts` — do not redefine them
- Follow the exact file paths specified in SPEC.md

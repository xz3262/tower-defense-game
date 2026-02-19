import { EnemyType, EnemyStats } from '../../types'
import { basicEnemyStats, renderBasicEnemy } from './BasicEnemy'
import { fastEnemyStats, renderFastEnemy } from './FastEnemy'
import { tankEnemyStats, renderTankEnemy } from './TankEnemy'
import { flyingEnemyStats, renderFlyingEnemy } from './FlyingEnemy'
import { stealthEnemyStats, renderStealthEnemy } from './StealthEnemy'
import { healerEnemyStats, renderHealerEnemy } from './HealerEnemy'
import { splitterEnemyStats, renderSplitterEnemy } from './SplitterEnemy'
import { shieldEnemyStats, renderShieldEnemy } from './ShieldEnemy'
import { speedAuraEnemyStats, renderSpeedAuraEnemy } from './SpeedAuraEnemy'
import { bossGolemStats, renderBossGolem } from './BossGolem'
import { bossDragonStats, renderBossDragon } from './BossDragon'
import { bossNecromancerStats, renderBossNecromancer } from './BossNecromancer'

export type EnemyRenderer = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  hp: number,
  maxHP: number,
  ...args: unknown[]
) => void

interface EnemyEntry {
  stats: EnemyStats
  renderer: EnemyRenderer
}

const enemyRegistry: Record<EnemyType, EnemyEntry> = {
  basic: { stats: basicEnemyStats, renderer: renderBasicEnemy },
  fast: { stats: fastEnemyStats, renderer: renderFastEnemy },
  tank: { stats: tankEnemyStats, renderer: renderTankEnemy },
  flying: { stats: flyingEnemyStats, renderer: renderFlyingEnemy },
  stealth: { stats: stealthEnemyStats, renderer: renderStealthEnemy },
  healer: { stats: healerEnemyStats, renderer: renderHealerEnemy },
  splitter: { stats: splitterEnemyStats, renderer: renderSplitterEnemy },
  shield: { stats: shieldEnemyStats, renderer: renderShieldEnemy },
  speedaura: { stats: speedAuraEnemyStats, renderer: renderSpeedAuraEnemy },
  boss_golem: { stats: bossGolemStats, renderer: renderBossGolem },
  boss_dragon: { stats: bossDragonStats, renderer: renderBossDragon },
  boss_necromancer: { stats: bossNecromancerStats, renderer: renderBossNecromancer }
}

export const getEnemyRenderer = (type: EnemyType): EnemyRenderer | undefined => {
  return enemyRegistry[type]?.renderer
}

export const getEnemyStats = (type: EnemyType): EnemyStats | undefined => {
  return enemyRegistry[type]?.stats
}

export const getAllEnemyStats = (): EnemyStats[] => {
  return Object.values(enemyRegistry).map(entry => entry.stats)
}

export const hasEnemy = (type: EnemyType): boolean => {
  return type in enemyRegistry
}

export const getEnemyCount = (): number => {
  return Object.keys(enemyRegistry).length
}

import { TowerType, TowerStats } from '../../types'
import { arrowTowerStats, renderArrowTower } from './ArrowTower'
import { bombTowerStats, renderBombTower } from './BombTower'
import { cannonTowerStats, renderCannonTower } from './CannonTower'
import { fireTowerStats, renderFireTower } from './FireTower'
import { goldMineStats, renderGoldMine } from './GoldMine'
import { iceTowerStats, renderIceTower } from './IceTower'
import { laserTowerStats, renderLaserTower } from './LaserTower'
import { lightningTowerStats, renderLightningTower } from './LightningTower'
import { poisonTowerStats, renderPoisonTower } from './PoisonTower'
import { slowTowerStats, renderSlowTower } from './SlowTower'
import { sniperTowerStats, renderSniperTower } from './SniperTower'
import { teslaTowerStats, renderTeslaTower } from './TeslaTower'

export type TowerRenderer = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  level: number,
  ...args: unknown[]
) => void

interface TowerEntry {
  stats: TowerStats
  renderer: TowerRenderer
}

const towerRegistry: Record<TowerType, TowerEntry> = {
  arrow: { stats: arrowTowerStats, renderer: renderArrowTower },
  cannon: { stats: cannonTowerStats, renderer: renderCannonTower },
  ice: { stats: iceTowerStats, renderer: renderIceTower },
  fire: { stats: fireTowerStats, renderer: renderFireTower },
  lightning: { stats: lightningTowerStats, renderer: renderLightningTower },
  poison: { stats: poisonTowerStats, renderer: renderPoisonTower },
  sniper: { stats: sniperTowerStats, renderer: renderSniperTower },
  laser: { stats: laserTowerStats, renderer: renderLaserTower },
  bomb: { stats: bombTowerStats, renderer: renderBombTower },
  slow: { stats: slowTowerStats, renderer: renderSlowTower },
  goldmine: { stats: goldMineStats, renderer: renderGoldMine },
  tesla: { stats: teslaTowerStats, renderer: renderTeslaTower }
}

export const getTowerRenderer = (type: TowerType): TowerRenderer => {
  return towerRegistry[type]?.renderer
}

export const getTowerStats = (type: TowerType): TowerStats => {
  return towerRegistry[type]?.stats
}

export const getAllTowerStats = (): TowerStats[] => {
  return Object.values(towerRegistry).map(entry => entry.stats)
}

export const getAllTowerRenderers = (): Record<TowerType, TowerRenderer> => {
  const renderers: Partial<Record<TowerType, TowerRenderer>> = {}
  for (const type of Object.keys(towerRegistry) as TowerType[]) {
    renderers[type] = towerRegistry[type].renderer
  }
  return renderers as Record<TowerType, TowerRenderer>
}

export const hasTower = (type: TowerType): boolean => {
  return type in towerRegistry
}

export const getTowerCount = (): number => {
  return Object.keys(towerRegistry).length
}

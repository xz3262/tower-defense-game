import { TowerInstance, TowerType, TowerStats } from '../../types'
import { TowerConfig, getTowerDamage, getTowerRange, getTowerUpgradeCost } from '../config/TowerConfig'
import { UPGRADE_LEVEL_MAX } from '../config/GameConstants'

export const canUpgrade = (tower: TowerInstance): boolean => {
  return tower.level < UPGRADE_LEVEL_MAX
}

export const getUpgradeStats = (towerType: TowerType, level: number): TowerStats | null => {
  if (level >= UPGRADE_LEVEL_MAX) return null
  
  const baseStats = TowerConfig[towerType]
  const nextLevel = level + 1
  
  return {
    ...baseStats,
    damage: getTowerDamage(towerType, nextLevel),
    range: getTowerRange(towerType, nextLevel),
    level: nextLevel
  }
}

export const applyUpgrade = (tower: TowerInstance): boolean => {
  if (!canUpgrade(tower)) return false
  
  tower.level += 1
  return true
}

export type UpgradePreview = {
  current: TowerStats
  next: TowerStats | null
  cost: number
  costDiff: number
  damageDiff: number
  rangeDiff: number
}

export const getUpgradePreview = (towerType: TowerType, currentLevel: number): UpgradePreview | null => {
  if (currentLevel >= UPGRADE_LEVEL_MAX) return null
  
  const baseStats = TowerConfig[towerType]
  const currentStats: TowerStats = {
    ...baseStats,
    damage: getTowerDamage(towerType, currentLevel),
    range: getTowerRange(towerType, currentLevel),
    level: currentLevel
  }
  
  const nextStats = getUpgradeStats(towerType, currentLevel)
  if (!nextStats) return null
  
  const cost = getTowerUpgradeCost(towerType, currentLevel)
  
  return {
    current: currentStats,
    next: nextStats,
    cost: cost,
    costDiff: cost - (currentLevel > 1 ? getTowerUpgradeCost(towerType, currentLevel - 1) : baseStats.cost),
    damageDiff: nextStats.damage - currentStats.damage,
    rangeDiff: nextStats.range - currentStats.range
  }
}

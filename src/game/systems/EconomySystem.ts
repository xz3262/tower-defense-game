import { TowerInstance, TowerType } from '../../types'
import { TowerConfig, getTowerStats } from '../config/TowerConfig'
import { SELL_REFUND_RATIO, STARTING_GOLD } from '../config/GameConstants'

export const canAfford = (cost: number, gold: number): boolean => {
  return gold >= cost
}

export const purchaseTower = (cost: number, currentGold: number): number => {
  if (!canAfford(cost, currentGold)) {
    return currentGold
  }
  return currentGold - cost
}

export const calculateTotalInvested = (tower: TowerInstance): number => {
  const stats = getTowerStats(tower.type)
  let total = stats.cost
  
  for (let i = 1; i < tower.level; i++) {
    total += stats.upgradeCosts[i - 1]
  }
  
  return total
}

export const sellTower = (tower: TowerInstance): number => {
  const totalInvested = calculateTotalInvested(tower)
  return Math.floor(totalInvested * SELL_REFUND_RATIO)
}

export const getUpgradeCost = (tower: TowerInstance): number => {
  if (tower.level >= 4) {
    return 0
  }
  
  const stats = getTowerStats(tower.type)
  return stats.upgradeCosts[tower.level - 1]
}

export const calculateWaveBonus = (waveNumber: number): number => {
  const baseBonus = 25
  const waveMultiplier = 1 + (waveNumber - 1) * 0.15
  return Math.floor(baseBonus * waveMultiplier)
}

export const calculateKillReward = (
  enemyReward: number,
  waveNumber: number,
  isBoss: boolean
): number => {
  let reward = enemyReward
  
  if (isBoss) {
    reward *= 2
  }
  
  const waveScaling = 1 + (waveNumber - 1) * 0.05
  return Math.floor(reward * waveScaling)
}

export const getStartingGold = (): number => STARTING_GOLD

export const calculateGoldMineIncome = (level: number): number => {
  const baseIncome = 10
  return baseIncome * level
}

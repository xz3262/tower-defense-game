import { TowerStats, TowerType } from '../../types'

export const TowerConfig: Record<TowerType, TowerStats> = {
  arrow: {
    type: 'arrow',
    name: 'Arrow Tower',
    cost: 50,
    damage: 10,
    range: 3,
    fireRate: 2,
    projectileSpeed: 8,
    upgradeCosts: [30, 60, 100],
    damagePerLevel: 5,
    rangePerLevel: 0.5,
    special: 'Fast attack, low damage, cheap',
    color: '#8B4513',
    canTargetFlying: true
  },
  cannon: {
    type: 'cannon',
    name: 'Cannon Tower',
    cost: 100,
    damage: 30,
    range: 2.5,
    fireRate: 0.8,
    projectileSpeed: 5,
    upgradeCosts: [60, 120, 200],
    damagePerLevel: 15,
    rangePerLevel: 0.3,
    special: 'Splash damage to enemies in radius',
    color: '#2F4F4F',
    canTargetFlying: false
  },
  ice: {
    type: 'ice',
    name: 'Ice Tower',
    cost: 120,
    damage: 8,
    range: 2.5,
    fireRate: 1.5,
    projectileSpeed: 6,
    upgradeCosts: [70, 140, 220],
    damagePerLevel: 4,
    rangePerLevel: 0.3,
    special: 'Slows enemies by 40%',
    color: '#ADD8E6',
    canTargetFlying: true
  },
  fire: {
    type: 'fire',
    name: 'Fire Tower',
    cost: 150,
    damage: 15,
    range: 2.5,
    fireRate: 1,
    projectileSpeed: 5,
    upgradeCosts: [90, 180, 280],
    damagePerLevel: 8,
    rangePerLevel: 0.3,
    special: 'Applies burn DoT (5 damage/sec for 3s)',
    color: '#FF4500',
    canTargetFlying: true
  },
  lightning: {
    type: 'lightning',
    name: 'Lightning Tower',
    cost: 180,
    damage: 25,
    range: 3,
    fireRate: 1.2,
    projectileSpeed: 15,
    upgradeCosts: [100, 200, 320],
    damagePerLevel: 12,
    rangePerLevel: 0.5,
    special: 'Chains to up to 3 nearby enemies',
    color: '#FFD700',
    canTargetFlying: true
  },
  poison: {
    type: 'poison',
    name: 'Poison Tower',
    cost: 160,
    damage: 5,
    range: 2.5,
    fireRate: 1.5,
    projectileSpeed: 4,
    upgradeCosts: [90, 180, 290],
    damagePerLevel: 3,
    rangePerLevel: 0.3,
    special: 'Creates poison cloud, damages all in area',
    color: '#32CD32',
    canTargetFlying: false
  },
  sniper: {
    type: 'sniper',
    name: 'Sniper Tower',
    cost: 200,
    damage: 80,
    range: 5,
    fireRate: 0.4,
    projectileSpeed: 20,
    upgradeCosts: [120, 240, 380],
    damagePerLevel: 40,
    rangePerLevel: 0.5,
    special: 'Long range, high damage, slow fire rate',
    color: '#4B0082',
    canTargetFlying: true
  },
  laser: {
    type: 'laser',
    name: 'Laser Tower',
    cost: 220,
    damage: 20,
    range: 3,
    fireRate: 10,
    projectileSpeed: 0,
    upgradeCosts: [130, 260, 400],
    damagePerLevel: 10,
    rangePerLevel: 0.5,
    special: 'Continuous beam, instant damage',
    color: '#FF0000',
    canTargetFlying: true
  },
  bomb: {
    type: 'bomb',
    name: 'Bomb Tower',
    cost: 180,
    damage: 50,
    range: 2,
    fireRate: 0.6,
    projectileSpeed: 4,
    upgradeCosts: [100, 200, 320],
    damagePerLevel: 25,
    rangePerLevel: 0.2,
    special: 'High splash damage, area explosion',
    color: '#000000',
    canTargetFlying: false
  },
  slow: {
    type: 'slow',
    name: 'Slow Tower',
    cost: 140,
    damage: 2,
    range: 3,
    fireRate: 0,
    projectileSpeed: 0,
    upgradeCosts: [80, 160, 260],
    damagePerLevel: 1,
    rangePerLevel: 0.5,
    special: 'Aura slows all enemies in range by 30%',
    color: '#87CEEB',
    canTargetFlying: true
  },
  goldmine: {
    type: 'goldmine',
    name: 'Gold Mine',
    cost: 250,
    damage: 0,
    range: 0,
    fireRate: 0,
    projectileSpeed: 0,
    upgradeCosts: [150, 300, 450],
    damagePerLevel: 0,
    rangePerLevel: 0,
    special: 'Generates 10 gold per second',
    color: '#DAA520',
    canTargetFlying: false
  },
  tesla: {
    type: 'tesla',
    name: 'Tesla Tower',
    cost: 300,
    damage: 35,
    range: 2.5,
    fireRate: 2,
    projectileSpeed: 0,
    upgradeCosts: [180, 360, 540],
    damagePerLevel: 20,
    rangePerLevel: 0.3,
    special: 'Area shock, damages all in range',
    color: '#00FFFF',
    canTargetFlying: true
  }
}

export const getTowerStats = (type: TowerType): TowerStats => TowerConfig[type]

export const getTowerUpgradeCost = (type: TowerType, currentLevel: number): number => {
  const stats = TowerConfig[type]
  if (currentLevel >= 4) return 0
  return stats.upgradeCosts[currentLevel - 1]
}

export const getTowerDamage = (type: TowerType, level: number): number => {
  const stats = TowerConfig[type]
  return stats.damage + (level - 1) * stats.damagePerLevel
}

export const getTowerRange = (type: TowerType, level: number): number => {
  const stats = TowerConfig[type]
  return stats.range + (level - 1) * stats.rangePerLevel
}

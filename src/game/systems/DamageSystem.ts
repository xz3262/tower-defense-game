import { EnemyInstance, StatusEffect, TowerInstance, TowerType } from '../../types'
import { getTowerDamage } from '../config/TowerConfig'

export interface DamageResult {
  actualDamage: number
  killed: boolean
}

export const applyDamage = (
  enemy: EnemyInstance,
  damage: number,
  armor: number
): DamageResult => {
  const effectiveDamage = Math.max(1, damage - armor)
  const newHP = enemy.hp - effectiveDamage
  const killed = newHP <= 0

  return {
    actualDamage: effectiveDamage,
    killed
  }
}

export const applyStatusEffect = (
  enemy: EnemyInstance,
  effect: StatusEffect
): void => {
  // Check if enemy already has this type of effect
  const existingIndex = enemy.effects.findIndex(e => e.type === effect.type)

  if (existingIndex >= 0) {
    // Refresh duration and potentially increase magnitude
    const existing = enemy.effects[existingIndex]
    if (effect.duration > existing.duration) {
      enemy.effects[existingIndex] = {
        ...effect,
        magnitude: Math.max(existing.magnitude, effect.magnitude)
      }
    }
  } else {
    // Add new effect
    enemy.effects.push({ ...effect })
  }
}

export const updateStatusEffects = (
  enemy: EnemyInstance,
  dt: number
): number => {
  let totalDotDamage = 0
  let slowMagnitude = 0

  // Filter out expired effects and accumulate damage
  enemy.effects = enemy.effects.filter(effect => {
    effect.duration -= dt

    if (effect.duration <= 0) {
      return false
    }

    // Apply DoT damage for burn and poison
    if (effect.type === 'burn' || effect.type === 'poison') {
      // Damage per second * dt (in seconds)
      totalDotDamage += effect.magnitude * dt
    }

    // Track slow magnitude (use highest slow)
    if (effect.type === 'slow') {
      slowMagnitude = Math.max(slowMagnitude, effect.magnitude)
    }

    return true
  })

  // Apply DoT damage
  if (totalDotDamage > 0) {
    enemy.hp -= totalDotDamage
  }

  // Return slow magnitude to be applied to enemy speed
  return slowMagnitude
}

export const calculateTowerDamage = (tower: TowerInstance): number => {
  return getTowerDamage(tower.type, tower.level)
}

export const getStatusEffectDamagePerSecond = (
  effectType: 'burn' | 'poison'
): number => {
  switch (effectType) {
    case 'burn':
      return 5 // 5 damage per second
    case 'poison':
      return 3 // 3 damage per second
    default:
      return 0
  }
}

export const getStatusEffectDuration = (
  effectType: 'burn' | 'poison' | 'slow' | 'stun'
): number => {
  switch (effectType) {
    case 'burn':
      return 3 // 3 seconds
    case 'poison':
      return 4 // 4 seconds
    case 'slow':
      return 2 // 2 seconds
    case 'stun':
      return 1 // 1 second
    default:
      return 0
  }
}

export const createBurnEffect = (sourceId: string): StatusEffect => ({
  type: 'burn',
  duration: getStatusEffectDuration('burn'),
  magnitude: getStatusEffectDamagePerSecond('burn'),
  sourceId
})

export const createPoisonEffect = (sourceId: string): StatusEffect => ({
  type: 'poison',
  duration: getStatusEffectDuration('poison'),
  magnitude: getStatusEffectDamagePerSecond('poison'),
  sourceId
})

export const createSlowEffect = (sourceId: string, magnitude: number): StatusEffect => ({
  type: 'slow',
  duration: getStatusEffectDuration('slow'),
  magnitude,
  sourceId
})

export const createStunEffect = (sourceId: string): StatusEffect => ({
  type: 'stun',
  duration: getStatusEffectDuration('stun'),
  magnitude: 1, // 100% slow when stunned
  sourceId
})

import { ProjectileInstance, EnemyInstance, StatusEffect } from '../../types'
import { distance } from '../../utils/math'

export type HitPair = {
  projectile: ProjectileInstance
  enemy: EnemyInstance
}

const HIT_RADIUS = 15

export const checkProjectileHits = (
  projectiles: ProjectileInstance[],
  enemies: EnemyInstance[]
): { hits: HitPair[]; projectilesToRemove: string[] } => {
  const hits: HitPair[] = []
  const projectilesToRemove: string[] = []
  const processedProjectiles = new Set<string>()

  for (const projectile of projectiles) {
    if (processedProjectiles.has(projectile.id)) continue

    const targetEnemy = enemies.find(
      (e) => e.id === projectile.targetId && e.isAlive
    )

    if (!targetEnemy) continue

    const dist = distance(
      { x: projectile.x, y: projectile.y },
      { x: targetEnemy.x, y: targetEnemy.y }
    )

    if (dist < HIT_RADIUS) {
      hits.push({ projectile, enemy: targetEnemy })
      processedProjectiles.add(projectile.id)
      projectilesToRemove.push(projectile.id)

      if (projectile.isAoE && projectile.aoERadius > 0) {
        for (const enemy of enemies) {
          if (enemy.id !== targetEnemy.id && enemy.isAlive) {
            const aoeDist = distance(
              { x: targetEnemy.x, y: targetEnemy.y },
              { x: enemy.x, y: enemy.y }
            )
            if (aoeDist <= projectile.aoERadius) {
              const splashHit: HitPair = {
                projectile,
                enemy,
              }
              if (!hits.some(
                (h) => h.projectile.id === projectile.id && h.enemy.id === enemy.id
              )) {
                hits.push(splashHit)
              }
            }
          }
        }
      }
    }
  }

  return { hits, projectilesToRemove }
}

export const applyStatusEffect = (
  enemy: EnemyInstance,
  effect: StatusEffect | null
): void => {
  if (!effect) return

  const existingEffect = enemy.effects.find((e) => e.type === effect.type)

  if (existingEffect) {
    existingEffect.duration = effect.duration
    existingEffect.magnitude = Math.max(existingEffect.magnitude, effect.magnitude)
  } else {
    enemy.effects.push({ ...effect })
  }
}

export const checkEnemyCollision = (
  enemies: EnemyInstance[],
  radius: number
): { enemyA: EnemyInstance; enemyB: EnemyInstance }[] => {
  const collisions: { enemyA: EnemyInstance; enemyB: EnemyInstance }[] = []

  for (let i = 0; i < enemies.length; i++) {
    for (let j = i + 1; j < enemies.length; j++) {
      const enemyA = enemies[i]
      const enemyB = enemies[j]

      if (!enemyA.isAlive || !enemyB.isAlive) continue

      const dist = distance(
        { x: enemyA.x, y: enemyA.y },
        { x: enemyB.x, y: enemyB.y }
      )

      if (dist < radius * 2) {
        collisions.push({ enemyA, enemyB })
      }
    }
  }

  return collisions
}

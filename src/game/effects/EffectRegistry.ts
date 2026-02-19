import { renderBurnEffect } from './BurnEffect'
import { renderDeathEffect } from './DeathEffect'
import { renderExplosion } from './ExplosionEffect'
import { renderHitNumber } from './HitEffect'
import { renderLevelUpEffect } from './LevelUpEffect'
import { renderPoisonEffect, renderPoisonCloud, renderPoisonImpact } from './PoisonEffect'
import { renderSlowEffect, renderSlowEffectWithRadius } from './SlowEffect'
import { renderSpawnEffect } from './SpawnEffect'

export type EffectRenderer = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  progress: number,
  ...args: unknown[]
) => void

export type EffectType =
  | 'burn'
  | 'death'
  | 'explosion'
  | 'hit'
  | 'levelup'
  | 'poison'
  | 'slow'
  | 'spawn'

const effectRenderers: Record<EffectType, EffectRenderer> = {
  burn: renderBurnEffect,
  death: renderDeathEffect,
  explosion: renderExplosion,
  hit: renderHitNumber,
  levelup: renderLevelUpEffect,
  poison: renderPoisonEffect,
  slow: renderSlowEffect,
  spawn: renderSpawnEffect
}

const explosionRenderer = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  progress: number,
  radius: number = 30
): void => {
  renderExplosion(ctx, x, y, radius, progress)
}

const hitRenderer = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  progress: number,
  damage: number
): void => {
  renderHitNumber(ctx, x, y, damage, progress)
}

const poisonCloudRenderer = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  progress: number,
  radius: number
): void => {
  renderPoisonCloud(ctx, x, y, radius, progress)
}

const poisonImpactRenderer = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  progress: number
): void => {
  renderPoisonImpact(ctx, x, y, progress)
}

const slowRadiusRenderer = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  progress: number,
  radius: number
): void => {
  renderSlowEffectWithRadius(ctx, { x, y }, progress, radius)
}

export const getEffectRenderer = (type: EffectType): EffectRenderer | undefined => {
  return effectRenderers[type]
}

export const getExplosionRenderer = (): typeof explosionRenderer => explosionRenderer

export const getHitRenderer = (): typeof hitRenderer => hitRenderer

export const getPoisonCloudRenderer = (): typeof poisonCloudRenderer => poisonCloudRenderer

export const getPoisonImpactRenderer = (): typeof poisonImpactRenderer => poisonImpactRenderer

export const getSlowRadiusRenderer = (): typeof slowRadiusRenderer => slowRadiusRenderer

export const renderEffect = (
  ctx: CanvasRenderingContext2D,
  type: EffectType,
  x: number,
  y: number,
  progress: number,
  ...args: unknown[]
): void => {
  const renderer = getEffectRenderer(type)
  if (renderer) {
    renderer(ctx, x, y, progress, ...args)
  }
}

export const effectDurations: Record<EffectType, number> = {
  burn: 1,
  death: 0.5,
  explosion: 0.5,
  hit: 0.8,
  levelup: 1,
  poison: 1,
  slow: 1,
  spawn: 0.8
}

export const getEffectDuration = (type: EffectType): number => {
  return effectDurations[type] ?? 1
}

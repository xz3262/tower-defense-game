import { ProjectileRenderer } from '../../types'
import { renderArrow } from './Arrow'
import { renderBullet } from './Bullet'
import { renderCannonball } from './Cannonball'
import { renderFireball } from './Fireball'
import { renderIceShard } from './IceShard'
import { renderLaserBeam } from './LaserBeam'
import { renderLightningBolt } from './LightningBolt'
import { renderPoisonCloud } from './PoisonCloud'

export type ProjectileRenderer = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  angleOrTargetX: number,
  targetY?: number
) => void

const projectileRenderers: Record<string, ProjectileRenderer> = {
  arrow: renderArrow,
  cannon: renderCannonball,
  ice: renderIceShard,
  fire: renderFireball,
  lightning: renderLightningBolt,
  poison: renderPoisonCloud,
  sniper: renderBullet,
  laser: renderLaserBeam,
  bomb: renderCannonball,
  slow: renderCannonball,
  tesla: renderLightningBolt
}

export const getProjectileRenderer = (type: string): ProjectileRenderer | undefined => {
  return projectileRenderers[type]
}

export const hasProjectileRenderer = (type: string): boolean => {
  return type in projectileRenderers
}

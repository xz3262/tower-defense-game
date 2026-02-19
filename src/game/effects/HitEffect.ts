import { Position } from '../../types'

/**
 * Renders a floating damage number that drifts upward and fades.
 * Used to display damage dealt to enemies.
 * 
 * @param ctx - Canvas 2D rendering context
 * @param x - X position in pixels
 * @param y - Y position in pixels (starting position)
 * @param damage - The damage amount to display
 * @param progress - Animation progress from 0 (start) to 1 (end)
 */
export const renderHitNumber = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  damage: number,
  progress: number
): void => {
  // Clamp progress to valid range
  const clampedProgress = Math.max(0, Math.min(1, progress))
  
  // Calculate vertical offset (drifts upward)
  const driftDistance = 30 // pixels to drift upward
  const offsetY = -driftDistance * clampedProgress
  
  // Calculate alpha (fades out)
  const alpha = 1 - clampedProgress
  
  // Calculate scale (slightly larger at start, then normal)
  const scale = 1 + (1 - clampedProgress) * 0.3
  
  // Render position
  const renderY = y + offsetY
  
  // Draw text shadow for better visibility
  ctx.font = `bold ${14 * scale}px system-ui`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  
  // Shadow
  ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.5})`
  ctx.fillText(
    `-${Math.round(damage)}`,
    x + 1,
    renderY + 1
  )
  
  // Main text in red
  ctx.fillStyle = `rgba(239, 68, 68, ${alpha})` // #ef4444 with alpha
  ctx.fillText(
    `-${Math.round(damage)}`,
    x,
    renderY
  )
  
  // Add a subtle glow effect at the start
  if (clampedProgress < 0.3) {
    const glowAlpha = (0.3 - clampedProgress) / 0.3 * alpha * 0.5
    ctx.fillStyle = `rgba(252, 165, 165, ${glowAlpha})`
    ctx.fillText(
      `-${Math.round(damage)}`,
      x,
      renderY
    )
  }
}

/**
 * Creates hit effect data for tracking in the game
 */
export interface HitEffectData {
  id: string
  x: number
  y: number
  damage: number
  progress: number
  duration: number
}

/**
 * Creates a new hit effect instance
 */
export const createHitEffect = (
  id: string,
  x: number,
  y: number,
  damage: number,
  duration: number = 0.8
): HitEffectData => ({
  id,
  x,
  y,
  damage,
  progress: 0,
  duration
})

/**
 * Updates hit effect progress
 */
export const updateHitEffect = (
  effect: HitEffectData,
  dt: number
): HitEffectData => {
  const newProgress = effect.progress + dt / effect.duration
  return {
    ...effect,
    progress: Math.min(1, newProgress)
  }
}

/**
 * Checks if hit effect is complete
 */
export const isHitEffectComplete = (effect: HitEffectData): boolean => {
  return effect.progress >= 1
}

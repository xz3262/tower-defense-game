import { EnemyStats } from '../../types'
import { enemyConfig } from '../config/EnemyConfig'
import { drawRect, drawCircle, drawHealthBar } from '../../utils/canvas'

// Boss Golem is 3x the normal enemy size (normal = 12px, boss = 36px)
const BOSS_SIZE = 36
const BOSS_COLOR = '#78716c'
const BOSS_DARK = '#57534e'
const BOSS_LIGHT = '#a8a29e'
const ROCK_COLOR = '#6b7280'
const ROCK_DARK = '#4b5563'

export const bossGolemStats: EnemyStats = enemyConfig.boss_golem

export const renderBossGolem = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  hp: number,
  maxHP: number
): void => {
  const halfSize = BOSS_SIZE
  const squareSize = halfSize * 2

  // Draw shadow beneath
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)'
  ctx.beginPath()
  ctx.ellipse(x, y + halfSize + 4, halfSize * 0.8, halfSize * 0.3, 0, 0, Math.PI * 2)
  ctx.fill()

  // Draw main body - large brown/gray square
  drawRect(
    ctx,
    x - halfSize,
    y - halfSize,
    squareSize,
    squareSize,
    BOSS_COLOR,
    BOSS_DARK,
    4 // Thick border
  )

  // Draw rocky texture pattern - multiple smaller rectangles
  drawRockyTexture(ctx, x, y, halfSize)

  // Draw face/head area - lighter center
  const faceSize = halfSize * 0.6
  drawRect(
    ctx,
    x - faceSize / 2,
    y - faceSize / 2 - halfSize * 0.2,
    faceSize,
    faceSize * 0.8,
    BOSS_LIGHT,
    BOSS_DARK,
    2
  )

  // Draw eyes - glowing red
  const eyeY = y - halfSize * 0.1
  const eyeSpacing = halfSize * 0.25
  const eyeSize = 4

  // Eye glow
  ctx.beginPath()
  ctx.arc(x - eyeSpacing, eyeY, eyeSize + 3, 0, Math.PI * 2)
  ctx.fillStyle = 'rgba(239, 68, 68, 0.4)'
  ctx.fill()
  ctx.beginPath()
  ctx.arc(x + eyeSpacing, eyeY, eyeSize + 3, 0, Math.PI * 2)
  ctx.fillStyle = 'rgba(239, 68, 68, 0.4)'
  ctx.fill()

  // Eyes
  drawCircle(ctx, x - eyeSpacing, eyeY, eyeSize, '#ef4444', '#991b1b', 1)
  drawCircle(ctx, x + eyeSpacing, eyeY, eyeSize, '#ef4444', '#991b1b', 1)

  // Eye highlights
  drawCircle(ctx, x - eyeSpacing - 1, eyeY - 1, 1.5, '#ffffff')
  drawCircle(ctx, x + eyeSpacing - 1, eyeY - 1, 1.5, '#ffffff')

  // Draw thick health bar above enemy - boss has thicker bar
  const healthBarWidth = BOSS_SIZE * 2.5
  const healthBarHeight = 8 // Thicker than normal (normal is 4)
  const healthBarY = y - halfSize - 16

  drawHealthBar(
    ctx,
    x,
    healthBarY,
    healthBarWidth,
    healthBarHeight,
    hp,
    maxHP
  )

  // Draw boss label
  ctx.fillStyle = '#fbbf24'
  ctx.font = 'bold 10px system-ui'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('BOSS', x, healthBarY - 8)
}

const drawRockyTexture = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  halfSize: number
): void => {
  // Draw rocky texture pattern using small rectangles
  const rockCount = 8
  const padding = halfSize * 0.15
  const rockSize = halfSize * 0.35

  // Top row rocks
  drawRock(ctx, x - halfSize * 0.5, y - halfSize * 0.6, rockSize * 0.8, rockSize * 0.6)
  drawRock(ctx, x + halfSize * 0.3, y - halfSize * 0.5, rockSize * 0.7, rockSize * 0.5)

  // Middle rocks
  drawRock(ctx, x - halfSize * 0.7, y - halfSize * 0.1, rockSize * 0.6, rockSize * 0.7)
  drawRock(ctx, x - halfSize * 0.2, y + halfSize * 0.1, rockSize * 0.9, rockSize * 0.5)
  drawRock(ctx, x + halfSize * 0.5, y, rockSize * 0.6, rockSize * 0.8)

  // Bottom rocks
  drawRock(ctx, x - halfSize * 0.4, y + halfSize * 0.5, rockSize * 0.7, rockSize * 0.6)
  drawRock(ctx, x + halfSize * 0.2, y + halfSize * 0.6, rockSize * 0.8, rockSize * 0.5)
  drawRock(ctx, x - halfSize * 0.6, y + halfSize * 0.3, rockSize * 0.5, rockSize * 0.5)
}

const drawRock = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number
): void => {
  drawRect(
    ctx,
    x - width / 2,
    y - height / 2,
    width,
    height,
    ROCK_COLOR,
    ROCK_DARK,
    1
  )
}

// Screen shake effect - this would be called when the boss spawns
export const triggerBossSpawnEffect = (
  canvas: HTMLCanvasElement,
  duration: number = 500
): void => {
  const originalTransform = canvas.style.transform
  const startTime = Date.now()

  const shake = () => {
    const elapsed = Date.now() - startTime
    if (elapsed >= duration) {
      canvas.style.transform = originalTransform
      return
    }

    // Decrease shake intensity over time
    const intensity = 1 - elapsed / duration
    const offsetX = (Math.random() - 0.5) * 20 * intensity
    const offsetY = (Math.random() - 0.5) * 20 * intensity

    canvas.style.transform = `translate(${offsetX}px, ${offsetY}px)`
    requestAnimationFrame(shake)
  }

  shake()
}

import { Position } from '../../types'
import { angleBetween } from '../../utils/math'

/**
 * Renders an arrow projectile as a small brown line with a triangle head
 * pointing in the direction of travel.
 * 
 * @param ctx - Canvas 2D rendering context
 * @param x - Current x position of the projectile
 * @param y - Current y position of the projectile
 * @param angle - Direction the arrow is traveling (radians)
 */
export const renderArrow = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  angle: number
): void => {
  const ARROW_LENGTH = 10
  const ARROW_HEAD_SIZE = 5
  const ARROW_COLOR = '#8B4513'
  const ARROW_HEAD_COLOR = '#A0522D'

  // Draw the main shaft of the arrow
  const tailX = x - Math.cos(angle) * ARROW_LENGTH
  const tailY = y - Math.sin(angle) * ARROW_LENGTH

  ctx.beginPath()
  ctx.moveTo(x, y)
  ctx.lineTo(tailX, tailY)
  ctx.strokeStyle = ARROW_COLOR
  ctx.lineWidth = 2
  ctx.lineCap = 'round'
  ctx.stroke()

  // Draw the arrowhead as a triangle pointing in the direction
  const headAngle1 = angle + Math.PI / 6
  const headAngle2 = angle - Math.PI / 6

  const head1X = x - Math.cos(headAngle1) * ARROW_HEAD_SIZE
  const head1Y = y - Math.sin(headAngle1) * ARROW_HEAD_SIZE
  const head2X = x - Math.cos(headAngle2) * ARROW_HEAD_SIZE
  const head2Y = y - Math.sin(headAngle2) * ARROW_HEAD_SIZE

  ctx.beginPath()
  ctx.moveTo(x, y)
  ctx.lineTo(head1X, head1Y)
  ctx.lineTo(head2X, head2Y)
  ctx.closePath()
  ctx.fillStyle = ARROW_HEAD_COLOR
  ctx.fill()
  ctx.strokeStyle = '#5D3A1A'
  ctx.lineWidth = 1
  ctx.stroke()
}

/**
 * Renders an arrow projectile targeting a specific position
 * 
 * @param ctx - Canvas 2D rendering context
 * @param x - Current x position of the projectile
 * @param y - Current y position of the projectile
 * @param targetPos - Position the arrow is flying toward
 */
export const renderArrowToTarget = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  targetPos: Position
): void => {
  const angle = angleBetween({ x, y }, targetPos)
  renderArrow(ctx, x, y, angle)
}

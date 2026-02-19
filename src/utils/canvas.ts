import { Position } from '../types'
import { UI_HEALTH, UI_HEALTH_DAMAGED, UI_BACKGROUND } from './colors'

export const drawCircle = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  fillColor: string,
  strokeColor?: string,
  lineWidth?: number
): void => {
  ctx.beginPath()
  ctx.arc(x, y, radius, 0, Math.PI * 2)
  ctx.fillStyle = fillColor
  ctx.fill()
  if (strokeColor) {
    ctx.strokeStyle = strokeColor
    ctx.lineWidth = lineWidth ?? 2
    ctx.stroke()
  }
}

export const drawRect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  fillColor: string,
  strokeColor?: string,
  lineWidth?: number,
  cornerRadius?: number
): void => {
  ctx.beginPath()
  if (cornerRadius && cornerRadius > 0) {
    const r = Math.min(cornerRadius, width / 2, height / 2)
    ctx.moveTo(x + r, y)
    ctx.lineTo(x + width - r, y)
    ctx.quadraticCurveTo(x + width, y, x + width, y + r)
    ctx.lineTo(x + width, y + height - r)
    ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height)
    ctx.lineTo(x + r, y + height)
    ctx.quadraticCurveTo(x, y + height, x, y + height - r)
    ctx.lineTo(x, y + r)
    ctx.quadraticCurveTo(x, y, x + r, y)
  } else {
    ctx.rect(x, y, width, height)
  }
  ctx.fillStyle = fillColor
  ctx.fill()
  if (strokeColor) {
    ctx.strokeStyle = strokeColor
    ctx.lineWidth = lineWidth ?? 1
    ctx.stroke()
  }
}

export const drawHealthBar = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  currentHP: number,
  maxHP: number
): void => {
  const barWidth = width
  const barHeight = height
  const hpPercent = Math.max(0, Math.min(1, currentHP / maxHP))

  // Background
  ctx.fillStyle = UI_BACKGROUND
  ctx.fillRect(x - barWidth / 2 - 1, y - barHeight / 2 - 1, barWidth + 2, barHeight + 2)

  // Health bar
  const healthColor = hpPercent > 0.5 ? UI_HEALTH : hpPercent > 0.25 ? UI_HEALTH_DAMAGED : '#ef4444'
  ctx.fillStyle = healthColor
  ctx.fillRect(x - barWidth / 2, y - barHeight / 2, barWidth * hpPercent, barHeight)

  // Border
  ctx.strokeStyle = '#1f2937'
  ctx.lineWidth = 1
  ctx.strokeRect(x - barWidth / 2, y - barHeight / 2, barWidth, barHeight)
}

export const drawText = (
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  options?: {
    font?: string
    color?: string
    align?: CanvasTextAlign
    baseline?: CanvasTextBaseline
    shadow?: boolean
    shadowColor?: string
    shadowBlur?: number
  }
): void => {
  const {
    font = '16px system-ui',
    color = '#f8fafc',
    align = 'center',
    baseline = 'middle',
    shadow = false,
    shadowColor = 'rgba(0, 0, 0, 0.5)',
    shadowBlur = 4
  } = options || {}

  ctx.font = font
  ctx.fillStyle = color
  ctx.textAlign = align
  ctx.textBaseline = baseline

  if (shadow) {
    ctx.shadowColor = shadowColor
    ctx.shadowBlur = shadowBlur
  }

  ctx.fillText(text, x, y)

  // Reset shadow
  ctx.shadowColor = 'transparent'
  ctx.shadowBlur = 0
}

export const drawLine = (
  ctx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  color: string,
  lineWidth: number = 2
): void => {
  ctx.beginPath()
  ctx.moveTo(startX, startY)
  ctx.lineTo(endX, endY)
  ctx.strokeStyle = color
  ctx.lineWidth = lineWidth
  ctx.stroke()
}

export const drawPolygon = (
  ctx: CanvasRenderingContext2D,
  points: Position[],
  fillColor: string,
  strokeColor?: string,
  lineWidth?: number
): void => {
  if (points.length < 3) return

  ctx.beginPath()
  ctx.moveTo(points[0].x, points[0].y)
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y)
  }
  ctx.closePath()
  ctx.fillStyle = fillColor
  ctx.fill()
  if (strokeColor) {
    ctx.strokeStyle = strokeColor
    ctx.lineWidth = lineWidth ?? 2
    ctx.stroke()
  }
}

export const clearCanvas = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
): void => {
  ctx.clearRect(0, 0, width, height)
}

export const drawRing = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  innerRadius: number,
  outerRadius: number,
  fillColor: string
): void => {
  ctx.beginPath()
  ctx.arc(x, y, outerRadius, 0, Math.PI * 2)
  ctx.arc(x, y, innerRadius, 0, Math.PI * 2, true)
  ctx.fillStyle = fillColor
  ctx.fill()
}

import { Position } from '../types'

export const distance = (a: Position, b: Position): number => {
  const dx = b.x - a.x
  const dy = b.y - a.y
  return Math.sqrt(dx * dx + dy * dy)
}

export const angleBetween = (a: Position, b: Position): number => {
  return Math.atan2(b.y - a.y, b.x - a.x)
}

export const normalize = (v: Position): Position => {
  const len = Math.sqrt(v.x * v.x + v.y * v.y)
  if (len === 0) return { x: 0, y: 0 }
  return { x: v.x / len, y: v.y / len }
}

export const lerp = (a: number, b: number, t: number): number => {
  return a + (b - a) * t
}

export const lerpPosition = (a: Position, b: Position, t: number): Position => {
  return {
    x: lerp(a.x, b.x, t),
    y: lerp(a.y, b.y, t)
  }
}

export const gridToPixel = (gx: number, gy: number): Position => {
  return {
    x: gx * 40 + 20,
    y: gy * 40 + 20
  }
}

export const pixelToGrid = (px: number, py: number): Position => {
  return {
    x: Math.floor(px / 40),
    y: Math.floor(py / 40)
  }
}

export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max)
}

export const randomRange = (min: number, max: number): number => {
  return Math.random() * (max - min) + min
}

export const randomInt = (min: number, max: number): number => {
  return Math.floor(randomRange(min, max + 1))
}

export const easeOutQuad = (t: number): number => {
  return t * (2 - t)
}

export const easeInOutCubic = (t: number): number => {
  return t < 0.5
    ? 4 * t * t * t
    : 1 - Math.pow(-2 * t + 2, 3) / 2
}

import { EnemyInstance, Position, StatusEffect } from '../../types'
import { TILE_SIZE } from '../config/GameConstants'

/**
 * Applies status effect speed modifications to the base speed
 */
const calculateEffectiveSpeed = (
  baseSpeed: number,
  effects: StatusEffect[]
): number => {
  let multiplier = 1
  
  for (const effect of effects) {
    if (effect.duration > 0) {
      switch (effect.type) {
        case 'slow':
          // Magnitude is a percentage (e.g., 0.4 for 40% slow)
          multiplier *= (1 - effect.magnitude)
          break
        case 'stun':
          // Stun completely stops movement
          multiplier = 0
          break
        // burn, poison don't affect movement speed
      }
    }
  }
  
  return baseSpeed * Math.max(0, multiplier)
}

/**
 * Converts grid position to pixel position (center of tile)
 */
const gridToPixel = (gridPos: Position): Position => ({
  x: gridPos.x * TILE_SIZE + TILE_SIZE / 2,
  y: gridPos.y * TILE_SIZE + TILE_SIZE / 2
})

/**
 * Calculates distance between two grid positions in pixels
 */
const getWaypointDistance = (a: Position, b: Position): number => {
  const pixelA = gridToPixel(a)
  const pixelB = gridToPixel(b)
  const dx = pixelB.x - pixelA.x
  const dy = pixelB.y - pixelA.y
  return Math.sqrt(dx * dx + dy * dy)
}

/**
 * Moves an enemy along a path by interpolating between waypoints.
 * 
 * @param enemy - The enemy instance to move
 * @param dt - Delta time in seconds
 * @param path - Array of grid positions representing the path
 * @returns true if the enemy has reached the exit, false otherwise
 */
export const moveAlongPath = (
  enemy: EnemyInstance,
  dt: number,
  path: Position[]
): boolean => {
  // Cannot move if dead or no valid path
  if (!enemy.isAlive || !path || path.length < 2) {
    return false
  }
  
  // Check if already at or past the end of the path
  if (enemy.pathIndex >= path.length - 1) {
    return true
  }
  
  // Calculate effective speed with status effects
  const effectiveSpeed = calculateEffectiveSpeed(enemy.speed, enemy.effects)
  
  // Convert speed from tiles/second to pixels/second
  const pixelSpeed = effectiveSpeed * TILE_SIZE
  
  // Get current and next waypoint positions
  const currentWaypoint = path[enemy.pathIndex]
  const nextWaypoint = path[enemy.pathIndex + 1]
  
  if (!currentWaypoint || !nextWaypoint) {
    return true
  }
  
  // Calculate distance between waypoints
  const waypointDistance = getWaypointDistance(currentWaypoint, nextWaypoint)
  
  // Prevent division by zero
  if (waypointDistance === 0) {
    enemy.pathIndex++
    enemy.progress = 0
    return enemy.pathIndex >= path.length - 1
  }
  
  // Update progress based on movement speed
  const progressDelta = (pixelSpeed * dt) / waypointDistance
  enemy.progress += progressDelta
  
  // Interpolate position between current and next waypoint
  const startPixel = gridToPixel(currentWaypoint)
  const endPixel = gridToPixel(nextWaypoint)
  
  const clampedProgress = Math.min(enemy.progress, 1)
  enemy.x = startPixel.x + (endPixel.x - startPixel.x) * clampedProgress
  enemy.y = startPixel.y + (endPixel.y - startPixel.y) * clampedProgress
  
  // Check if we've reached the next waypoint
  if (enemy.progress >= 1) {
    enemy.pathIndex++
    enemy.progress = 0
    
    // Check if we've reached the exit
    if (enemy.pathIndex >= path.length - 1) {
      return true
    }
  }
  
  return false
}

/**
 * Gets the current position of an enemy on the path
 */
export const getEnemyPosition = (
  enemy: EnemyInstance,
  path: Position[]
): Position => {
  if (!path || path.length < 2 || enemy.pathIndex >= path.length - 1) {
    return { x: enemy.x, y: enemy.y }
  }
  
  const currentWaypoint = path[enemy.pathIndex]
  const nextWaypoint = path[enemy.pathIndex + 1]
  
  const startPixel = gridToPixel(currentWaypoint)
  const endPixel = gridToPixel(nextWaypoint)
  
  return {
    x: startPixel.x + (endPixel.x - startPixel.x) * enemy.progress,
    y: startPixel.y + (endPixel.y - startPixel.y) * enemy.progress
  }
}

/**
 * Calculates the total path length in pixels
 */
export const getPathLength = (path: Position[]): number => {
  if (!path || path.length < 2) return 0
  
  let totalLength = 0
  for (let i = 0; i < path.length - 1; i++) {
    totalLength += getWaypointDistance(path[i], path[i + 1])
  }
  
  return totalLength
}

/**
 * Calculates how far along the path an enemy is (0-1)
 */
export const getPathProgress = (
  enemy: EnemyInstance,
  path: Position[]
): number => {
  if (!path || path.length < 2) return 0
  
  let totalProgress = enemy.pathIndex
  
  // Add current segment progress
  for (let i = 0; i < enemy.pathIndex; i++) {
    const segmentLength = getWaypointDistance(path[i], path[i + 1])
    totalProgress += segmentLength
  }
  
  // Add current waypoint progress
  if (enemy.pathIndex < path.length - 1) {
    const segmentLength = getWaypointDistance(
      path[enemy.pathIndex],
      path[enemy.pathIndex + 1]
    )
    totalProgress += enemy.progress * segmentLength
  }
  
  const totalLength = getPathLength(path)
  
  return totalLength > 0 ? totalProgress / totalLength : 0
}
import { GameMap } from '../../types'

const mapRegistry = new Map<string, GameMap>()

export function registerMap(map: GameMap): void {
  mapRegistry.set(map.id, map)
}

export function getMap(id: string): GameMap | undefined {
  return mapRegistry.get(id)
}

export function getAllMaps(): GameMap[] {
  return Array.from(mapRegistry.values())
}

export function getMapList(): { id: string; name: string }[] {
  return Array.from(mapRegistry.values()).map((map) => ({
    id: map.id,
    name: map.name,
  }))
}

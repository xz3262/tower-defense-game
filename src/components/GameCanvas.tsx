import { useRef, useEffect, useCallback } from 'react'
import { useGameStore } from '../store/gameStore'
import { createGameLoop } from '../game/engine/GameLoop'
import { createRenderer } from '../game/engine/Renderer'
import { createInputHandler } from '../game/engine/InputHandler'
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../game/config/GameConstants'
import type { GameLoop } from '../game/engine/GameLoop'
import type { Renderer } from '../game/engine/Renderer'
import type { InputHandler } from '../game/engine/InputHandler'
import type { InputEvent } from '../game/engine/InputHandler'

interface GameCanvasProps {
  onTowerPlace?: (gridX: number, gridY: number) => void
}

export function GameCanvas({ onTowerPlace }: GameCanvasProps): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const gameLoopRef = useRef<GameLoop | null>(null)
  const rendererRef = useRef<Renderer | null>(null)
  const inputHandlerRef = useRef<InputHandler | null>(null)

  const gameState = useGameStore(s => s.gameState)
  const currentMap = useGameStore(s => s.currentMap)
  const towers = useGameStore(s => s.towers)
  const enemies = useGameStore(s => s.enemies)
  const projectiles = useGameStore(s => s.projectiles)
  const selectedTower = useGameStore(s => s.selectedTower)
  const gold = useGameStore(s => s.gold)
  const placeTower = useGameStore(s => s.placeTower)
  const selectTower = useGameStore(s => s.selectTower)
  const tick = useGameStore(s => s.tick)

  const handleInputEvent = useCallback((event: InputEvent) => {
    if (event.type === 'tile_click' && selectedTower) {
      const canAfford = gold >= 50
      if (canAfford && onTowerPlace) {
        onTowerPlace(event.gridX, event.gridY)
      }
    }
  }, [selectedTower, gold, onTowerPlace])


  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    canvas.width = CANVAS_WIDTH
    canvas.height = CANVAS_HEIGHT

    const gameLoop = createGameLoop(canvas)
    const renderer = createRenderer(canvas)
    const inputHandler = createInputHandler(canvas)

    gameLoopRef.current = gameLoop
    rendererRef.current = renderer
    inputHandlerRef.current = inputHandler

    inputHandler.onInputEvent(handleInputEvent)

    gameLoop.setUpdateCallback((dt) => {
      tick(dt * 1000)
    })

    gameLoop.setRenderCallback(() => {
      if (!rendererRef.current) return

      const store = useGameStore.getState()
      rendererRef.current.setMap(store.currentMap)
      rendererRef.current.setEntities(
        store.towers,
        store.enemies,
        store.projectiles,
        []
      )
      rendererRef.current.render()
    })


    if (gameState === 'playing') {
      gameLoop.start()
    }

    return () => {
      gameLoop.stop()
      inputHandler.destroy()
    }
  }, [])

  useEffect(() => {
    if (!gameLoopRef.current) return

    if (gameState === 'playing') {
      gameLoopRef.current.resume()
    } else if (gameState === 'paused') {
      gameLoopRef.current.pause()
    }
  }, [gameState])


  useEffect(() => {
    if (!rendererRef.current || !currentMap) return
    rendererRef.current.setMap(currentMap)
    inputHandlerRef.current?.setMap(currentMap)
  }, [currentMap])

  useEffect(() => {
    if (!rendererRef.current) return
    rendererRef.current.setEntities(towers, enemies, projectiles, [])
  }, [towers, enemies, projectiles])

  useEffect(() => {
    if (inputHandlerRef.current) {
      inputHandlerRef.current.selectTower(selectedTower)
    }
  }, [selectedTower])


  return (
    <div className="game-container relative bg-gray-900 rounded-lg overflow-hidden">
      <canvas
        ref={canvasRef}
        className="block cursor-crosshair"
        style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT }}
      />
      {gameState !== 'playing' && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <span className="text-white text-xl font-semibold">
            {gameState === 'menu' && 'Main Menu'}
            {gameState === 'paused' && 'Paused'}
            {gameState === 'victory' && 'Victory!'}
            {gameState === 'defeat' && 'Game Over'}
            {gameState === 'map_select' && 'Select Map'}
          </span>
        </div>
      )}
    </div>
  )
}
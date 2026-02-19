import { useGameStore } from './store/gameStore'
import { MainMenu } from './components/MainMenu'
import { MapSelect } from './components/MapSelect'
import { GameCanvas } from './components/GameCanvas'
import { HUD } from './components/HUD'
import { TowerShop } from './components/TowerShop'
import { TowerInfo } from './components/TowerInfo'
import { WaveIndicator } from './components/WaveIndicator'
import { PauseMenu } from './components/PauseMenu'
import { VictoryScreen } from './components/VictoryScreen'
import { DefeatScreen } from './components/DefeatScreen'

export function App(): JSX.Element {
  const gameState = useGameStore(s => s.gameState)
  const selectedTower = useGameStore(s => s.selectedTower)
  const gold = useGameStore(s => s.gold)
  const placeTower = useGameStore(s => s.placeTower)

  const handleTowerPlace = (gridX: number, gridY: number): void => {
    if (selectedTower) {
      placeTower(selectedTower, gridX, gridY)
    }
  }

  // Main menu
  if (gameState === 'menu') {
    return <MainMenu />
  }

  // Map selection
  if (gameState === 'map_select') {
    return <MapSelect />
  }

  // Game playing, paused, victory, or defeat
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      {/* HUD at top */}
      <HUD />

      {/* Main game area */}
      <div className="relative flex">
        {/* Canvas on left */}
        <div className="game-canvas-container">
          <GameCanvas onTowerPlace={handleTowerPlace} />
          
          {/* Wave indicator overlay */}
          <WaveIndicator />
        </div>

        {/* Tower shop on right */}
        <TowerShop />

        {/* Tower info panel (when tower selected) */}
        <TowerInfo />
      </div>

      {/* Pause menu overlay */}
      {gameState === 'paused' && <PauseMenu />}

      {/* Victory screen overlay */}
      {gameState === 'victory' && <VictoryScreen />}

      {/* Defeat screen overlay */}
      {gameState === 'defeat' && <DefeatScreen />}
    </div>
  )
}

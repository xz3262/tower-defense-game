import { useGameStore } from '../store/gameStore'
import { Play, RotateCcw, Home, Coins, Waves, Castle } from 'lucide-react'

export const PauseMenu = (): JSX.Element | null => {
  const gameState = useGameStore(s => s.gameState)
  const gold = useGameStore(s => s.gold)
  const currentWave = useGameStore(s => s.currentWave)
  const totalWaves = useGameStore(s => s.totalWaves)
  const towers = useGameStore(s => s.towers)
  const currentMap = useGameStore(s => s.currentMap)
  const togglePause = useGameStore(s => s.togglePause)
  const startGame = useGameStore(s => s.startGame)

  if (gameState !== 'paused') {
    return null
  }

  const handleResume = (): void => {
    togglePause()
  }

  const handleRestart = (): void => {
    if (currentMap) {
      startGame(currentMap.id)
    }
  }

  const handleQuit = (): void => {
    useGameStore.setState({
      gameState: 'menu',
      currentMap: null,
      gold: 200,
      lives: 20,
      currentWave: 0,
      totalWaves: 0,
      score: 0,
      towers: [],
      enemies: [],
      projectiles: []
    })
  }

  const towersPlaced = towers.length

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 w-96 shadow-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white tracking-wider mb-2">
            PAUSED
          </h1>
          <div className="h-1 w-24 bg-amber-500 mx-auto rounded-full" />
        </div>

        {/* Stats Display */}
        <div className="bg-slate-800/50 rounded-xl p-4 mb-6 border border-slate-700">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Game Stats
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Coins className="w-4 h-4 text-amber-400" />
                <span className="text-amber-400 font-bold text-lg">{gold}</span>
              </div>
              <span className="text-xs text-slate-500">Gold</span>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Waves className="w-4 h-4 text-blue-400" />
                <span className="text-blue-400 font-bold text-lg">
                  {currentWave}/{totalWaves}
                </span>
              </div>
              <span className="text-xs text-slate-500">Wave</span>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Castle className="w-4 h-4 text-purple-400" />
                <span className="text-purple-400 font-bold text-lg">{towersPlaced}</span>
              </div>
              <span className="text-xs text-slate-500">Towers</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleResume}
            className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-emerald-600/25"
          >
            <Play className="w-5 h-5" />
            Resume Game
          </button>

          <button
            onClick={handleRestart}
            className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-amber-600/25"
          >
            <RotateCcw className="w-5 h-5" />
            Restart
          </button>

          <button
            onClick={handleQuit}
            className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg"
          >
            <Home className="w-5 h-5" />
            Quit to Menu
          </button>
        </div>

        {/* Keyboard hint */}
        <p className="text-center text-slate-500 text-sm mt-6">
          Press <kbd className="px-2 py-1 bg-slate-800 rounded text-slate-400">ESC</kbd> to resume
        </p>
      </div>
    </div>
  )
}
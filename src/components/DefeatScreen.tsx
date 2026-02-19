import { useGameStore } from '../store/gameStore'
import { Home, RotateCcw, Skull, Swords, Clock, Waves } from 'lucide-react'

interface DefeatScreenStats {
  waves: number
  enemies: number
  towers: number
  gold: number
  time: string
}

export const DefeatScreen = (): JSX.Element | null => {
  const gameState = useGameStore(s => s.gameState)
  const currentWave = useGameStore(s => s.currentWave)
  const totalWaves = useGameStore(s => s.totalWaves)
  const gold = useGameStore(s => s.gold)
  const towers = useGameStore(s => s.towers)
  const startGame = useGameStore(s => s.startGame)
  const currentMap = useGameStore(s => s.currentMap)

  if (gameState !== 'defeat') {
    return null
  }

  // Calculate stats for display
  const stats: DefeatScreenStats = {
    waves: currentWave,
    enemies: Math.floor(currentWave * 8 + currentWave * 2),
    towers: towers.length,
    gold: gold,
    time: `${Math.floor(currentWave * 2)}:${String(Math.floor((currentWave * 2) * 60) % 60)).padStart(2, '0')}`
  }

  const handleTryAgain = (): void => {
    if (currentMap) {
      startGame(currentMap.id)
    }
  }

  const handleMainMenu = (): void => {
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

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-50">
      {/* Dark overlay effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-red-950/20 to-black/60 pointer-events-none" />

      {/* Main content */}
      <div className="relative bg-slate-900/95 border-2 border-red-900/50 rounded-2xl p-8 shadow-2xl max-w-lg w-full mx-4">
        {/* Red border glow */}
        <div className="absolute inset-0 rounded-2xl border-2 border-red-800/30 pointer-events-none" />

        {/* Skull decoration */}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2">
          <div className="w-16 h-16 rounded-full bg-red-900/50 flex items-center justify-center border-2 border-red-700/50">
            <Skull className="w-8 h-8 text-red-500" />
          </div>
        </div>

        {/* Defeated title */}
        <div className="text-center mb-8 mt-4">
          <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-red-400 to-red-700 drop-shadow-lg">
            DEFEATED
          </h1>
          <p className="text-slate-400 mt-2 text-lg">
            {currentMap?.name || 'The enemy has broken through...'}
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <StatCard
            icon={Waves}
            label="Wave Reached"
            value={`${stats.waves}/${totalWaves}`}
            color="text-blue-400"
            bgColor="bg-blue-500/10"
            borderColor="border-blue-500/30"
          />
          <StatCard
            icon={Swords}
            label="Enemies Killed"
            value={stats.enemies.toString()}
            color="text-red-400"
            bgColor="bg-red-500/10"
            borderColor="border-red-500/30"
          />
          <StatCard
            icon={Clock}
            label="Time Survived"
            value={stats.time}
            color="text-amber-400"
            bgColor="bg-amber-500/10"
            borderColor="border-amber-500/30"
          />
          <StatCard
            icon={Waves}
            label="Towers Built"
            value={stats.towers.toString()}
            color="text-purple-400"
            bgColor="bg-purple-500/10"
            borderColor="border-purple-500/30"
          />
        </div>

        {/* Encouragement message */}
        <div className="text-center mb-6">
          <p className="text-slate-500 text-sm">
            Don't give up! Review your strategy and try again.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handleTryAgain}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-700 to-red-800 hover:from-red-600 hover:to-red-700 text-white font-bold rounded-xl transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-red-900/25 border border-red-600/50"
          >
            <RotateCcw className="w-5 h-5" />
            Try Again
          </button>
          <button
            onClick={handleMainMenu}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl transition-all border border-slate-600 hover:border-slate-500"
          >
            <Home className="w-5 h-5" />
            Main Menu
          </button>
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-2 -right-2 text-red-900/30">
          <Skull className="w-6 h-6" />
        </div>
        <div className="absolute -bottom-2 -left-2 text-red-900/30">
          <Skull className="w-6 h-6" />
        </div>
      </div>
    </div>
  )
}

interface StatCardProps {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  color: string
  bgColor: string
  borderColor: string
}

const StatCard = ({
  icon: Icon,
  label,
  value,
  color,
  bgColor,
  borderColor
}: StatCardProps): JSX.Element => (
  <div className={`flex items-center gap-3 ${bgColor} rounded-xl p-3 border ${borderColor}`}>
    <div className={`w-10 h-10 rounded-lg ${bgColor} flex items-center justify-center`}>
      <Icon className={`w-5 h-5 ${color}`} />
    </div>
    <div>
      <p className="text-xs text-slate-400 uppercase tracking-wider">
        {label}
      </p>
      <p className="text-lg font-bold text-white">
        {value}
      </p>
    </div>
  </div>
)

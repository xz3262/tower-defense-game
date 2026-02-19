import { useGameStore } from '../store/gameStore'
import { Coin, Heart, Pause, Play, Zap } from 'lucide-react'

export const HUD = (): JSX.Element => {
  const { gold, lives, currentWave, totalWaves, speed, gameState, togglePause, setSpeed } = useGameStore()

  const isPlaying = gameState === 'playing'
  const isPaused = gameState === 'paused'

  const speedButtons = [1, 2, 3] as const

  return (
    <div className="fixed top-0 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-4 px-6 py-3 bg-slate-900/90 backdrop-blur-sm rounded-b-xl border border-slate-700 border-t-0 shadow-lg">
        {/* Gold Display */}
        <div className="flex items-center gap-2 min-w-[100px]">
          <Coin className="w-5 h-5 text-amber-400" />
          <span className="text-amber-400 font-bold text-lg">{gold}</span>
        </div>

        {/* Divider */}
        <div className="w-px h-8 bg-slate-600" />

        {/* Lives Display */}
        <div className="flex items-center gap-2 min-w-[100px]">
          <Heart className="w-5 h-5 text-red-500" />
          <span className="text-red-500 font-bold text-lg">{lives}</span>
        </div>

        {/* Divider */}
        <div className="w-px h-8 bg-slate-600" />

        {/* Wave Display */}
        <div className="flex items-center gap-2 min-w-[120px]">
          <Zap className="w-5 h-5 text-blue-400" />
          <span className="text-blue-400 font-bold text-lg">
            {currentWave}/{totalWaves}
          </span>
        </div>

        {/* Divider */}
        <div className="w-px h-8 bg-slate-600" />

        {/* Speed Buttons */}
        <div className="flex items-center gap-1">
          {speedButtons.map((s) => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              className={`px-3 py-1.5 rounded-lg font-bold text-sm transition-all ${
                speed === s
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>

        {/* Divider */}
        <div className="w-px h-8 bg-slate-600" />

        {/* Pause/Resume Button */}
        <button
          onClick={togglePause}
          disabled={!isPlaying && !isPaused}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all ${
            isPlaying
              ? 'bg-amber-600 hover:bg-amber-500 text-white'
              : isPaused
              ? 'bg-green-600 hover:bg-green-500 text-white'
              : 'bg-slate-700 text-slate-500 cursor-not-allowed'
          }`}
        >
          {isPaused ? (
            <>
              <Play className="w-4 h-4" />
              Resume
            </>
          ) : (
            <>
              <Pause className="w-4 h-4" />
              Pause
            </>
          )}
        </button>
      </div>
    </div>
  )
}
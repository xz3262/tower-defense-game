import { useGameStore } from '../store/gameStore'
import { getWavesForMap, getWaveEnemyTypes, getWaveEnemyCount } from '../game/config/WaveConfig'
import { enemyConfig } from '../game/config/EnemyConfig'
import { Play, Skull, Ghost, Wind, Heart, Shield, Users, Flame, Leaf, Bolt, Target, Crown, Zap } from 'lucide-react'
import type { EnemyType } from '../types'

const enemyIcons: Record<EnemyType, React.ComponentType<{ className?: string }>> = {
  basic: Target,
  fast: Wind,
  tank: Shield,
  flying: Ghost,
  stealth: Users,
  healer: Heart,
  splitter: Leaf,
  shield: Shield,
  speedaura: Bolt,
  boss_golem: Crown,
  boss_dragon: Flame,
  boss_necromancer: Skull
}

const enemyColors: Record<EnemyType, string> = {
  basic: '#22c55e',
  fast: '#eab308',
  tank: '#78716c',
  flying: '#a855f7',
  stealth: '#64748b',
  healer: '#10b981',
  splitter: '#14b8a6',
  shield: '#3b82f6',
  speedaura: '#f97316',
  boss_golem: '#78716c',
  boss_dragon: '#dc2626',
  boss_necromancer: '#7c3aed'
}

export const WaveIndicator = (): JSX.Element => {
  const currentWave = useGameStore(s => s.currentWave)
  const totalWaves = useGameStore(s => s.totalWaves)
  const gameState = useGameStore(s => s.gameState)
  const startWave = useGameStore(s => s.startWave)
  const enemies = useGameStore(s => s.enemies)
  const currentMap = useGameStore(s => s.currentMap)

  const isPlaying = gameState === 'playing'
  const canStartWave = isPlaying && currentWave < totalWaves
  const isWaveInProgress = isPlaying && enemies.length > 0

  const nextWaveNumber = currentWave + 1
  const waves = currentMap ? getWavesForMap(currentMap.id) : []
  const nextWave = nextWaveNumber <= waves.length ? waves[nextWaveNumber - 1] : null
  const enemyTypes = nextWave ? getWaveEnemyTypes(nextWave) : []
  const totalEnemiesInWave = nextWave ? getWaveEnemyCount(nextWave) : 0

  const progress = totalEnemiesInWave > 0
    ? Math.min(100, ((totalEnemiesInWave - enemies.length) / totalEnemiesInWave) * 100)
    : 0

  const isBossWave = nextWave?.groups.some(g =>
    g.enemyType === 'boss_golem' ||
    g.enemyType === 'boss_dragon' ||
    g.enemyType === 'boss_necromancer'
  ) ?? false

  return (
    <div className="absolute top-20 left-1/2 -translate-x-1/2 z-40">
      <div className="flex flex-col items-center gap-3">
        {/* Wave Display */}
        <div className={`px-6 py-3 rounded-xl border-2 backdrop-blur-sm transition-all ${
          canStartWave 
            ? 'bg-slate-800/90 border-amber-500 animate-pulse shadow-lg shadow-amber-500/30' 
            : isWaveInProgress
              ? 'bg-slate-800/90 border-indigo-500 shadow-lg shadow-indigo-500/20'
              : 'bg-slate-800/90 border-slate-600'
        }`}>
          <div className="flex items-center gap-3">
            <Zap className={`w-5 h-5 ${canStartWave ? 'text-amber-400' : 'text-blue-400'}`} />
            <span className="text-2xl font-bold text-white">
              Wave {currentWave > 0 ? currentWave : 0} / {totalWaves}
            </span>
            {isBossWave && (
              <span className="px-2 py-0.5 bg-red-600 text-white text-xs font-bold rounded animate-pulse">
                BOSS
              </span>
            )}
          </div>
        </div>

        {/* Start Wave Button */}
        {canStartWave && (
          <button
            onClick={startWave}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-bold rounded-lg shadow-lg hover:shadow-amber-500/40 transition-all transform hover:scale-105 active:scale-95"
          >
            <Play className="w-5 h-5" />
            Start Wave {nextWaveNumber}
          </button>
        )}

        {/* Progress Bar */}
        {isWaveInProgress && (
          <div className="w-64">
            <div className="flex justify-between text-xs text-slate-400 mb-1">
              <span>Enemies: {enemies.length}</span>
              <span>Progress: {Math.round(progress)}%</span>
            </div>
            <div className="h-3 bg-slate-700 rounded-full overflow-hidden border border-slate-600">
              <div 
                className="h-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all duration-300 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Enemy Preview */}
        {canStartWave && nextWave && enemyTypes.length > 0 && (
          <div className="flex flex-col items-center gap-2 mt-1">
            <span className="text-xs text-slate-400 uppercase tracking-wide">
              Next Wave Enemies
            </span>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800/80 rounded-lg border border-slate-700">
              {enemyTypes.map((type, index) => {
                const Icon = enemyIcons[type] || Target
                const color = enemyColors[type] || '#22c55e'
                const stats = enemyConfig[type]
                const count = nextWave.groups.find(g => g.enemyType === type)?.count || 0

                return (
                  <div key={type} className="flex items-center gap-1">
                    {index > 0 && <span className="text-slate-600 text-xs">+</span>}
                    <div 
                      className="w-7 h-7 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: `${color}20`, border: `2px solid ${color}` }}
                    >
                      <Icon className="w-3.5 h-3.5" style={{ color }} />
                    </div>
                    <span className="text-xs text-slate-300 font-medium">x{count}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Victory Message */}
        {currentWave >= totalWaves && !isWaveInProgress && (
          <div className="mt-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg shadow-lg">
            <span className="text-white font-bold">All Waves Complete!</span>
          </div>
        )}
      </div>
    </div>
  )
}
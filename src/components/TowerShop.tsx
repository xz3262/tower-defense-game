import { useGameStore } from '../store/gameStore'
import { TowerType, TowerStats } from '../types'
import { TowerConfig } from '../game/config/TowerConfig'
import { Shield, Zap, Flame, Snowflake, Crosshair, Target, Bomb, Coins, Waves, Mountain, Trees, Crown } from 'lucide-react'

const towerIcons: Record<TowerType, React.ComponentType<{ className?: string }>> = {
  arrow: Target,
  cannon: Bomb,
  ice: Snowflake,
  fire: Flame,
  lightning: Zap,
  poison: Waves,
  sniper: Crosshair,
  laser: Shield,
  bomb: Bomb,
  slow: Snowflake,
  goldmine: Coins,
  tesla: Zap
}

const towerOrder: TowerType[] = [
  'arrow',
  'cannon',
  'ice',
  'fire',
  'lightning',
  'poison',
  'sniper',
  'laser',
  'bomb',
  'slow',
  'goldmine',
  'tesla'
]

export const TowerShop = (): JSX.Element => {
  const { gold, selectedTower, selectTower } = useGameStore()

  const handleTowerClick = (type: TowerType): void => {
    if (gold >= TowerConfig[type].cost) {
      selectTower(selectedTower === type ? null : type)
    }
  }

  return (
    <div className="absolute left-0 top-0 bottom-0 w-64 bg-slate-900/95 border-r border-slate-700 flex flex-col">
      <div className="p-4 border-b border-slate-700">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Crown className="w-5 h-5 text-amber-400" />
          Tower Shop
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Gold: <span className="text-amber-400 font-bold">{gold}</span>
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {towerOrder.map((type) => {
          const stats = TowerConfig[type]
          const canAfford = gold >= stats.cost
          const isSelected = selectedTower === type
          const IconComponent = towerIcons[type]

          return (
            <button
              key={type}
              onClick={() => handleTowerClick(type)}
              disabled={!canAfford}
              className={`
                w-full p-3 rounded-lg border-2 transition-all duration-200
                flex items-start gap-3 text-left
                ${isSelected
                  ? 'border-indigo-500 bg-indigo-500/20 shadow-lg shadow-indigo-500/30'
                  : canAfford
                    ? 'border-slate-600 bg-slate-800/50 hover:border-slate-500 hover:bg-slate-700/50 cursor-pointer'
                    : 'border-slate-700 bg-slate-800/30 opacity-50 cursor-not-allowed'
                }
              `}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: stats.color }}
              >
                <IconComponent className="w-5 h-5 text-white" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className={`font-semibold text-sm ${isSelected ? 'text-indigo-300' : 'text-slate-200'}`}>
                    {stats.name}
                  </h3>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${canAfford ? 'bg-amber-500/20 text-amber-400' : 'bg-red-500/20 text-red-400'}`}>
                    {stats.cost}g
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                  {stats.special}
                </p>
                <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                  <span>DMG: {stats.damage}</span>
                  <span>RNG: {stats.range}</span>
                  <span>SPD: {stats.fireRate}/s</span>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      <div className="p-3 border-t border-slate-700 text-xs text-slate-500 text-center">
        Click a tower to select it for placement
      </div>
    </div>
  )
}
import { TowerType, TowerStats } from '../types'
import { TowerConfig } from '../game/config/TowerConfig'

interface TooltipProps {
  x: number
  y: number
  towerType?: TowerType
  towerName?: string
  towerCost?: number
  towerDamage?: number
  towerRange?: number
  towerFireRate?: number
  towerSpecial?: string
  towerLevel?: number
  visible: boolean
}

const formatNumber = (num: number): string => {
  return num.toFixed(1)
}

export const Tooltip = ({
  x,
  y,
  towerType,
  towerName,
  towerCost,
  towerDamage,
  towerRange,
  towerFireRate,
  towerSpecial,
  towerLevel = 1,
  visible
}: TooltipProps): JSX.Element | null => {
  if (!visible || !towerType) return null

  const stats = TowerConfig[towerType]
  const name = towerName || stats.name
  const cost = towerCost ?? stats.cost
  const damage = towerDamage ?? (stats.damage + (towerLevel - 1) * stats.damagePerLevel)
  const range = towerRange ?? (stats.range + (towerLevel - 1) * stats.rangePerLevel)
  const fireRate = towerFireRate ?? stats.fireRate
  const special = towerSpecial ?? stats.special

  // Calculate tooltip position to stay within viewport
  const tooltipWidth = 220
  const tooltipHeight = 180
  const padding = 15
  const offset = 15

  let posX = x + offset
  let posY = y + offset

  // Adjust if would overflow right edge
  if (posX + tooltipWidth > window.innerWidth - padding) {
    posX = x - tooltipWidth - offset
  }

  // Adjust if would overflow bottom edge
  if (posY + tooltipHeight > window.innerHeight - padding) {
    posY = y - tooltipHeight - offset
  }

  // Adjust if would overflow left edge
  if (posX < padding) {
    posX = padding
  }

  // Adjust if would overflow top edge
  if (posY < padding) {
    posY = padding
  }

  return (
    <div
      className="fixed z-50 pointer-events-none"
      style={{
        left: posX,
        top: posY,
        transform: 'translate(0, 0)'
      }}
    >
      <div
        className="bg-slate-900/95 backdrop-blur-sm rounded-lg shadow-xl border border-slate-700 overflow-hidden"
        style={{ width: tooltipWidth }}
      >
        {/* Header */}
        <div
          className="px-3 py-2 border-b border-slate-700 flex items-center gap-2"
          style={{ backgroundColor: stats.color }}
        >
          <span className="text-white font-semibold text-sm">{name}</span>
          {towerLevel > 1 && (
            <span className="ml-auto text-xs bg-black/30 px-1.5 py-0.5 rounded text-white">
              Lv.{towerLevel}
            </span>
          )}
        </div>

        {/* Stats Table */}
        <div className="px-3 py-2">
          <table className="w-full text-xs">
            <tbody>
              <tr className="flex justify-between py-1">
                <td className="text-slate-400">Damage</td>
                <td className="text-red-400 font-medium">{damage}</td>
              </tr>
              <tr className="flex justify-between py-1">
                <td className="text-slate-400">Range</td>
                <td className="text-blue-400 font-medium">{formatNumber(range)}</td>
              </tr>
              <tr className="flex justify-between py-1">
                <td className="text-slate-400">Speed</td>
                <td className="text-green-400 font-medium">{formatNumber(fireRate)}/s</td>
              </tr>
              <tr className="flex justify-between py-1 border-t border-slate-700/50">
                <td className="text-slate-400">Cost</td>
                <td className="text-amber-400 font-medium">{cost}g</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Special Ability */}
        <div className="px-3 py-2 border-t border-slate-700/50">
          <p className="text-xs text-slate-300 leading-relaxed">
            {special}
          </p>
        </div>

        {/* Upgrade Info */}
        {towerLevel < 4 && (
          <div className="px-3 py-2 border-t border-slate-700/50 bg-slate-800/50">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Next Upgrade</span>
              <span className="text-amber-400 font-medium">
                {stats.upgradeCosts[towerLevel - 1]}g
              </span>
            </div>
            <div className="flex gap-1 mt-1">
              {[1, 2, 3, 4].map((lvl) => (
                <div
                  key={lvl}
                  className={`w-4 h-1.5 rounded-full ${
                    lvl <= towerLevel
                      ? 'bg-indigo-500'
                      : 'bg-slate-600'
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Hook for managing tooltip state
interface UseTooltipReturn {
  tooltipData: TooltipProps
  showTooltip: (e: MouseEvent, towerType: TowerType, level?: number) => void
  hideTooltip: () => void
}

export const useTooltip = (): UseTooltipReturn => {
  const tooltipData: TooltipProps = {
    x: 0,
    y: 0,
    towerType: undefined,
    visible: false
  }


  const showTooltip = (_e: MouseEvent, _towerType: TowerType, _level?: number): void => {
    // This would be implemented with state management
    // For now, the component handles its own positioning
  }

  const hideTooltip = (): void => {
    // This would be implemented with state management
  }

  return {
    tooltipData,
    showTooltip,
    hideTooltip
  }
}

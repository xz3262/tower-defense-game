import { useGameStore } from '../store/gameStore'
import { TowerConfig, getTowerDamage, getTowerRange, getTowerUpgradeCost } from '../game/config/TowerConfig'
import { SELL_REFUND_RATIO } from '../game/config/GameConstants'
import { ArrowUp, Trash2, Crosshair, Zap, Target, Shield } from 'lucide-react'

export const TowerInfo = (): JSX.Element | null => {
  const { selectedPlacedTower, gold, upgradeTower, sellTower, selectPlacedTower } = useGameStore()

  if (!selectedPlacedTower) {
    return null
  }

  const towerStats = TowerConfig[selectedPlacedTower.type]
  const damage = getTowerDamage(selectedPlacedTower.type, selectedPlacedTower.level)
  const range = getTowerRange(selectedPlacedTower.type, selectedPlacedTower.level)
  const upgradeCost = getTowerUpgradeCost(selectedPlacedTower.type, selectedPlacedTower.level)
  const isMaxLevel = selectedPlacedTower.level >= 4
  const canAffordUpgrade = gold >= upgradeCost

  // Calculate sell value (60% of total invested)
  const totalInvested = towerStats.cost + 
    selectedPlacedTower.level > 1 ? towerStats.upgradeCosts.slice(0, selectedPlacedTower.level - 1).reduce((a, b) => a + b, 0) : 0
  const sellValue = Math.floor(totalInvested * SELL_REFUND_RATIO)

  const handleUpgrade = () => {
    if (canAffordUpgrade && !isMaxLevel) {
      upgradeTower(selectedPlacedTower.id)
    }
  }

  const handleSell = () => {
    sellTower(selectedPlacedTower.id)
  }

  const handleClose = () => {
    selectPlacedTower(null)
  }

  return (
    <div className="absolute right-0 top-0 bottom-0 w-64 bg-slate-900/95 border-l border-slate-700 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-slate-700 flex items-center justify-between">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Crosshair className="w-5 h-5 text-indigo-400" />
          Tower Info
        </h2>
        <button
          onClick={handleClose}
          className="text-slate-400 hover:text-white transition-colors text-xl leading-none"
        >
          ×
        </button>
      </div>

      {/* Tower Icon & Name */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{ backgroundColor: towerStats.color }}
          >
            <Target className="w-7 h-7 text-white" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg">{towerStats.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-slate-400 text-sm">Level</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((lvl) => (
                  <div
                    key={lvl}
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                      lvl <= selectedPlacedTower.level
                        ? 'bg-indigo-500 text-white'
                        : 'bg-slate-700 text-slate-500'
                    }`}
                  >
                    {lvl}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="p-4 border-b border-slate-700 space-y-3">
        <h4 className="text-slate-400 text-sm font-medium uppercase tracking-wider">Stats</h4>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-800/50 rounded-lg p-3">
            <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
              <Zap className="w-3 h-3" />
              Damage
            </div>
            <div className="text-white font-bold text-lg">{damage}</div>
          </div>

          <div className="bg-slate-800/50 rounded-lg p-3">
            <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
              <Target className="w-3 h-3" />
              Range
            </div>
            <div className="text-white font-bold text-lg">{range.toFixed(1)}</div>
          </div>
        </div>

        <div className="bg-slate-800/50 rounded-lg p-3">
          <div className="text-slate-400 text-xs mb-1">Fire Rate</div>
          <div className="text-white font-bold">{towerStats.fireRate}/sec</div>
        </div>
      </div>

      {/* Combat Stats */}
      <div className="p-4 border-b border-slate-700 space-y-3">
        <h4 className="text-slate-400 text-sm font-medium uppercase tracking-wider">Combat</h4>
        
        <div className="flex justify-between items-center">
          <span className="text-slate-400 text-sm">Total Kills</span>
          <span className="text-white font-semibold">{selectedPlacedTower.totalKills}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-slate-400 text-sm">Total Damage</span>
          <span className="text-white font-semibold">{Math.floor(selectedPlacedTower.totalDamageDealt)}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 flex-1 flex flex-col gap-3">
        {/* Upgrade Button */}
        <button
          onClick={handleUpgrade}
          disabled={isMaxLevel || !canAffordUpgrade}
          className={`w-full p-3 rounded-lg border-2 transition-all flex items-center justify-between ${
            isMaxLevel
              ? 'border-slate-700 bg-slate-800/50 cursor-not-allowed opacity-50'
              : canAffordUpgrade
                ? 'border-indigo-500 bg-indigo-500/20 hover:bg-indigo-500/30 cursor-pointer'
                : 'border-red-500/50 bg-red-500/10 cursor-not-allowed opacity-50'
          }`}
        >
          <div className="flex items-center gap-2">
            <ArrowUp className={`w-5 h-5 ${isMaxLevel ? 'text-slate-500' : 'text-indigo-400'}`} />
            <span className={`font-semibold ${isMaxLevel ? 'text-slate-500' : 'text-white'}`}>
              {isMaxLevel ? 'Max Level' : 'Upgrade'}
            </span>
          </div>
          {!isMaxLevel && (
            <span className={`font-bold ${canAffordUpgrade ? 'text-amber-400' : 'text-red-400'}`}>
              {upgradeCost}g
            </span>
          )}
        </button>

        {/* Sell Button */}
        <button
          onClick={handleSell}
          className="w-full p-3 rounded-lg border-2 border-red-500/50 bg-red-500/10 hover:bg-red-500/20 transition-all flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <Trash2 className="w-5 h-5 text-red-400" />
            <span className="font-semibold text-white">Sell</span>
          </div>
          <span className="font-bold text-amber-400">+{sellValue}g</span>
        </button>

        {/* Info Text */}
        <p className="text-xs text-slate-500 text-center mt-2">
          {isMaxLevel
            ? 'This tower is at maximum level'
            : `Upgrade to level ${selectedPlacedTower.level + 1} for +${towerStats.damagePerLevel} damage`}
        </p>
      </div>
    </div>
  )
}
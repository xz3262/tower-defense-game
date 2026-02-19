import { useState } from 'react'
import { useGameStore } from '../store/gameStore'
import { Volume2, VolumeX, Eye, EyeOff, Heart, Zap, DollarSign, Settings, X, Play } from 'lucide-react'

interface SettingsPanelProps {
  isOpen: boolean
  onClose: () => void
}

export const SettingsPanel = ({ isOpen, onClose }: SettingsPanelProps): JSX.Element | null => {
  const [localSettings, setLocalSettings] = useState({
    soundEnabled: true,
    showRangeCircles: true,
    showHealthBars: true,
    showDamageNumbers: true,
    defaultSpeed: 1
  })

  if (!isOpen) return null

  const toggleSound = () => {
    setLocalSettings(prev => ({ ...prev, soundEnabled: !prev.soundEnabled }))
  }

  const toggleRangeCircles = () => {
    setLocalSettings(prev => ({ ...prev, showRangeCircles: !prev.showRangeCircles }))
  }

  const toggleHealthBars = () => {
    setLocalSettings(prev => ({ ...prev, showHealthBars: !prev.showHealthBars }))
  }

  const toggleDamageNumbers = () => {
    setLocalSettings(prev => ({ ...prev, showDamageNumbers: !prev.showDamageNumbers }))
  }

  const setDefaultSpeed = (speed: number) => {
    setLocalSettings(prev => ({ ...prev, defaultSpeed: speed }))
  }

  const handleSave = () => {
    // In a full implementation, this would save to localStorage or game store
    console.log('Settings saved:', localSettings)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl w-[480px] max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700 bg-slate-800/50">
          <div className="flex items-center gap-3">
            <Settings className="w-6 h-6 text-indigo-400" />
            <h2 className="text-xl font-bold text-white">Game Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[60vh]">
          {/* Audio Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
              Audio
            </h3>
            <button
              onClick={toggleSound}
              className={`w-full flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                localSettings.soundEnabled
                  ? 'border-indigo-500 bg-indigo-500/10'
                  : 'border-slate-600 bg-slate-800/50 hover:border-slate-500'
              }`}
            >
              <div className="flex items-center gap-3">
                {localSettings.soundEnabled ? (
                  <Volume2 className="w-5 h-5 text-indigo-400" />
                ) : (
                  <VolumeX className="w-5 h-5 text-slate-500" />
                )}
                <span className="text-white font-medium">Sound Effects</span>
              </div>
              <div className={`w-12 h-6 rounded-full transition-colors ${
                localSettings.soundEnabled ? 'bg-indigo-500' : 'bg-slate-600'
              }`}>
                <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                  localSettings.soundEnabled ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </div>
            </button>
          </div>

          {/* Display Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
              Display
            </h3>
            
            {/* Range Circles Toggle */}
            <button
              onClick={toggleRangeCircles}
              className={`w-full flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                localSettings.showRangeCircles
                  ? 'border-indigo-500 bg-indigo-500/10'
                  : 'border-slate-600 bg-slate-800/50 hover:border-slate-500'
              }`}
            >
              <div className="flex items-center gap-3">
                <Eye className={`w-5 h-5 ${localSettings.showRangeCircles ? 'text-indigo-400' : 'text-slate-500'}`} />
                <span className="text-white font-medium">Show Range Circles</span>
              </div>
              <div className={`w-12 h-6 rounded-full transition-colors ${
                localSettings.showRangeCircles ? 'bg-indigo-500' : 'bg-slate-600'
              }`}>
                <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                  localSettings.showRangeCircles ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </div>
            </button>

            {/* Health Bars Toggle */}
            <button
              onClick={toggleHealthBars}
              className={`w-full flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                localSettings.showHealthBars
                  ? 'border-indigo-500 bg-indigo-500/10'
                  : 'border-slate-600 bg-slate-800/50 hover:border-slate-500'
              }`}
            >
              <div className="flex items-center gap-3">
                <Heart className={`w-5 h-5 ${localSettings.showHealthBars ? 'text-red-400' : 'text-slate-500'}`} />
                <span className="text-white font-medium">Show Health Bars</span>
              </div>
              <div className={`w-12 h-6 rounded-full transition-colors ${
                localSettings.showHealthBars ? 'bg-indigo-500' : 'bg-slate-600'
              }`}>
                <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                  localSettings.showHealthBars ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </div>
            </button>

            {/* Damage Numbers Toggle */}
            <button
              onClick={toggleDamageNumbers}
              className={`w-full flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                localSettings.showDamageNumbers
                  ? 'border-indigo-500 bg-indigo-500/10'
                  : 'border-slate-600 bg-slate-800/50 hover:border-slate-500'
              }`}
            >
              <div className="flex items-center gap-3">
                <DollarSign className={`w-5 h-5 ${localSettings.showDamageNumbers ? 'text-amber-400' : 'text-slate-500'}`} />
                <span className="text-white font-medium">Show Damage Numbers</span>
              </div>
              <div className={`w-12 h-6 rounded-full transition-colors ${
                localSettings.showDamageNumbers ? 'bg-indigo-500' : 'bg-slate-600'
              }`}>
                <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                  localSettings.showDamageNumbers ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </div>
            </button>
          </div>

          {/* Game Speed Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
              Default Game Speed
            </h3>
            <div className="flex gap-2">
              {[1, 2, 3].map((speed) => (
                <button
                  key={speed}
                  onClick={() => setDefaultSpeed(speed)}
                  className={`flex-1 py-3 px-4 rounded-lg font-bold text-sm transition-all ${
                    localSettings.defaultSpeed === speed
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  {speed}x Speed
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-slate-700 bg-slate-800/50">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-lg font-semibold text-slate-300 bg-slate-700 hover:bg-slate-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors"
          >
            <Play className="w-4 h-4" />
            Save & Resume
          </button>
        </div>
      </div>
    </div>
  )
}

// Hook for managing settings state
export const useGameSettings = () => {
  const settings = useGameStore(s => (s as Record<string, unknown>).gameSettings)
  const updateSettings = useGameStore(s => (s as Record<string, unknown>).updateGameSettings)

  return {
    soundEnabled: settings?.soundEnabled ?? true,
    showRangeCircles: settings?.showRangeCircles ?? true,
    showHealthBars: settings?.showHealthBars ?? true,
    showDamageNumbers: settings?.showDamageNumbers ?? true,
    defaultSpeed: settings?.defaultSpeed ?? 1,
    updateSettings: updateSettings || (() => {})
  }
}

import { useGameStore } from '../store/gameStore'
import { getAllMaps } from '../game/maps/MapData'
import { ArrowLeft, Star, Map, Waves } from 'lucide-react'

interface MapCardData {
  id: string
  name: string
  difficulty: number
  waves: number
  thumbnailColor: string
}

const mapThumbnails: Record<string, string> = {
  grasslands: '#4a7c23',
  desert: '#c4a35a',
  snowfield: '#e5e7eb',
  swamp: '#3b82f6',
  volcano: '#dc2626',
  castle: '#6b7280'
}

const mapDifficulties: Record<string, number> = {
  grasslands: 1,
  desert: 2,
  snowfield: 3,
  swamp: 3,
  volcano: 4,
  castle: 5
}

export const MapSelect = (): JSX.Element => {
  const startGame = useGameStore(s => s.startGame)
  const setGameState = useGameStore(s => s.gameState)
  
  const maps = getAllMaps()
  
  const mapData: MapCardData[] = maps.map(map => ({
    id: map.id,
    name: map.name,
    difficulty: mapDifficulties[map.id] || 2,
    waves: map.waves.length,
    thumbnailColor: mapThumbnails[map.id] || '#4a7c23'
  }))

  const handleMapSelect = (mapId: string): void => {
    startGame(mapId)
  }

  const handleBack = (): void => {
    setGameState('menu')
  }

  const renderStars = (difficulty: number): JSX.Element[] => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < difficulty
            ? 'text-amber-400 fill-amber-400'
            : 'text-slate-600'
        }`}
      />
    ))
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-white mb-2">Select Map</h1>
        <p className="text-slate-400">Choose a battlefield to defend</p>
      </div>

      {/* Map Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl">
        {mapData.map(map => (
          <button
            key={map.id}
            onClick={() => handleMapSelect(map.id)}
            className="group bg-slate-800 border-2 border-slate-700 rounded-xl overflow-hidden
              hover:border-indigo-500 hover:shadow-lg hover:shadow-indigo-500/20
              transition-all duration-300 transform hover:-translate-y-1 w-72"
          >
            {/* Thumbnail */}
            <div
              className="h-32 w-full relative"
              style={{ backgroundColor: map.thumbnailColor }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <Map className="w-12 h-12 text-white/50" />
              </div>
              {/* Grid pattern overlay */}
              <div className="absolute inset-0 opacity-20">
                <div className="grid grid-cols-5 grid-rows-4 h-full w-full">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <div
                      key={i}
                      className="border border-white/30"
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="p-4">
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">
                {map.name}
              </h3>
              
              <div className="flex items-center justify-between text-sm">
                {/* Difficulty */}
                <div className="flex items-center gap-1">
                  {renderStars(map.difficulty)}
                </div>
                
                {/* Waves */}
                <div className="flex items-center gap-1 text-slate-400">
                  <Waves className="w-4 h-4" />
                  <span>{map.waves} waves</span>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Back Button */}
      <button
        onClick={handleBack}
        className="mt-8 flex items-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600
          text-white font-semibold rounded-lg transition-colors duration-200"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Menu
      </button>
    </div>
  )
}
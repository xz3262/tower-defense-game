import { useEffect, useRef, useState } from 'react'
import { useGameStore } from '../store/gameStore'
import { Star, Trophy, Zap, Target, Coins, Clock, Home, RotateCcw } from 'lucide-react'

interface Particle {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
  alpha: number
  life: number
}

const PARTICLE_COLORS = [
  '#fbbf24', // Gold
  '#fcd34d', // Light gold
  '#f59e0b', // Amber
  '#ef4444', // Red
  '#22c55e', // Green
  '#3b82f6', // Blue
  '#a855f7', // Purple
]

const STAT_ICONS = {
  waves: Zap,
  towers: Target,
  enemies: Trophy,
  gold: Coins,
  time: Clock,
}

const STAT_LABELS = {
  waves: 'Waves Survived',
  towers: 'Towers Placed',
  enemies: 'Enemies Killed',
  gold: 'Gold Earned',
  time: 'Time Taken',
}

export function VictoryScreen(): JSX.Element {
  const gameState = useGameStore(s => s.gameState)
  const currentWave = useGameStore(s => s.currentWave)
  const totalWaves = useGameStore(s => s.totalWaves)
  const gold = useGameStore(s => s.gold)
  const towers = useGameStore(s => s.towers)
  const startGame = useGameStore(s => s.startGame)
  const currentMap = useGameStore(s => s.currentMap)

  const [particles, setParticles] = useState<Particle[]>([])
  const [starRotation, setStarRotation] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)

  // Stats (these would ideally come from tracking during gameplay)
  const stats = {
    waves: currentWave,
    towers: towers.length,
    enemies: Math.floor(currentWave * 8 + currentWave * 2),
    gold: gold,
    time: `${Math.floor(currentWave * 2)}:${String(Math.floor((currentWave * 2) * 60) % 60)).padStart(2, '0')}`,
  }

  // Particle animation
  useEffect(() => {
    if (gameState !== 'victory') return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = 800
    canvas.height = 600

    const createParticle = (): Particle => ({
      id: Math.random(),
      x: Math.random() * canvas.width,
      y: canvas.height + 10,
      vx: (Math.random() - 0.5) * 4,
      vy: -Math.random() * 8 - 4,
      size: Math.random() * 6 + 2,
      color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
      alpha: 1,
      life: 1,
    })

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Create new particles
      if (Math.random() < 0.3) {
        setParticles(prev => [...prev.slice(-50), createParticle()])
      }

      // Update and draw particles
      setParticles(prev =>
        prev
          .map(p => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.1,
            life: p.life - 0.01,
            alpha: p.life,
          }))
          .filter(p => p.life > 0)
      )

      particles.forEach(p => {
        // Glow
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2)
        ctx.fillStyle = `${p.color}${Math.floor(p.alpha * 50).toString(16).padStart(2, '0')}`
        ctx.fill()

        // Core
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.globalAlpha = p.alpha
        ctx.fill()
        ctx.globalAlpha = 1
      })


      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationRef.current)
    }
  }, [gameState])

  // Star rotation animation
  useEffect(() => {
    if (gameState !== 'victory') return

    const interval = setInterval(() => {
      setStarRotation(prev => prev + 2)
    }, 50)


    return () => clearInterval(interval)
  }, [gameState])

  const handlePlayAgain = () => {
    if (currentMap) {
      startGame(currentMap.id)
    }
  }

  const handleMainMenu = () => {
    useGameStore.setState({ gameState: 'menu' })
  }

  if (gameState !== 'victory') {
    return <div />
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50">
      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ width: '800px', height: '600px' }}
      />

      {/* Main content */}
      <div className="relative bg-slate-900/95 border-4 border-amber-500/50 rounded-2xl p-8 shadow-2xl max-w-lg w-full mx-4">
        {/* Golden border glow */}
        <div className="absolute inset-0 rounded-2xl border-4 border-amber-400/30 pointer-events-none" />

        {/* Victory title with star */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative">
            {/* Rotating star */}
            <div
              className="absolute -top-8 left-1/2 -translate-x-1/2 text-amber-400"
              style={{ transform: `rotate(${starRotation}deg)` }}
            >
              <Star className="w-16 h-16 fill-amber-400" />
            </div>

            {/* Glow behind title */}
            <div className="absolute inset-0 blur-2xl bg-amber-500/30 rounded-full scale-150" />
          </div>

          <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 drop-shadow-lg">
            VICTORY!
          </h1>
          <p className="text-slate-400 mt-2 text-lg">
            {currentMap?.name || 'Game'} Complete!
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {Object.entries(stats).map(([key, value]) => {
            const Icon = STAT_ICONS[key as keyof typeof STAT_ICONS]
            return (
              <div
                key={key}
                className="flex items-center gap-3 bg-slate-800/50 rounded-xl p-3 border border-slate-700/50"
              >
                <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider">
                    {STAT_LABELS[key as keyof typeof STAT_LABELS]}
                  </p>
                  <p className="text-lg font-bold text-white">
                    {value}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handlePlayAgain}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white font-bold rounded-xl transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-amber-500/25"
          >
            <RotateCcw className="w-5 h-5" />
            Play Again
          </button>
          <button
            onClick={handleMainMenu}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl transition-all border border-slate-600 hover:border-slate-500"
          >
            <Home className="w-5 h-5" />
            Main Menu
          </button>
        </div>

        {/* Decorative stars */}
        <div className="absolute -top-4 -right-4 text-amber-400/50">
          <Star className="w-8 h-8 fill-amber-400/50" />
        </div>
        <div className="absolute -bottom-4 -left-4 text-amber-400/50">
          <Star className="w-8 h-8 fill-amber-400/50" />
        </div>
      </div>
    </div>
  )
}
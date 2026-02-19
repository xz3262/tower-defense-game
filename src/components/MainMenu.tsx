import { useEffect, useRef, useState } from 'react'
import { useGameStore } from '../store/gameStore'
import { Play, Settings, Info } from 'lucide-react'

interface Particle {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  size: number
  alpha: number
  color: string
}

const PARTICLE_COUNT = 50
const COLORS = ['#4f46e5', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b']
const VERSION = '1.0.0'

export const MainMenu = (): JSX.Element => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)
  const [particles, setParticles] = useState<Particle[]>([])
  const setGameState = useGameStore(s => s.gameState)

  const handlePlay = (): void => {
    setGameState('map_select')
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = 800
    canvas.height = 600

    const initParticles = (): Particle[] => {
      return Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
        id: i,
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 3 + 1,
        alpha: Math.random() * 0.5 + 0.2,
        color: COLORS[Math.floor(Math.random() * COLORS.length)]
      }))
    }

    let currentParticles = initParticles()
    setParticles(currentParticles)

    const animate = (): void => {
      ctx.fillStyle = '#0f172a'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw gradient overlay
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, canvas.width * 0.7
      )
      gradient.addColorStop(0, 'rgba(79, 70, 229, 0.15)')
      gradient.addColorStop(0.5, 'rgba(139, 92, 246, 0.08)')
      gradient.addColorStop(1, 'rgba(15, 23, 42, 0)')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Update and draw particles
      currentParticles = currentParticles.map(p => {
        let newX = p.x + p.vx
        let newY = p.y + p.vy

        if (newX < 0 || newX > canvas.width) p.vx *= -1
        if (newY < 0 || newY > canvas.height) p.vy *= -1

        newX = Math.max(0, Math.min(canvas.width, newX))
        newY = Math.max(0, Math.min(canvas.height, newY))

        return { ...p, x: newX, y: newY }
      })

      currentParticles.forEach(p => {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.globalAlpha = p.alpha
        ctx.fill()
        ctx.globalAlpha = 1
      })

      // Draw connections between nearby particles
      currentParticles.forEach((p1, i) => {
        currentParticles.slice(i + 1).forEach(p2 => {
          const dx = p1.x - p2.x
          const dy = p1.y - p2.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < 100) {
            ctx.beginPath()
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.strokeStyle = `rgba(139, 92, 246, ${0.15 * (1 - dist / 100)})`
            ctx.lineWidth = 1
            ctx.stroke()
          }
        })
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationRef.current)
    }
  }, [])

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Particle Canvas Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ width: '100%', height: '100%' }}
      />

      {/* Version Number */}
      <div className="absolute top-4 right-4 flex items-center gap-2 text-slate-500 text-sm">
        <Info className="w-4 h-4" />
        <span>v{VERSION}</span>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Title */}
        <div className="mb-12 text-center">
          <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 drop-shadow-lg tracking-wider">
            TOWER DEFENSE
          </h1>
          <p className="text-slate-400 mt-2 text-lg">
            Defend your kingdom from incoming waves
          </p>
        </div>

        {/* Tower Icons Decoration */}
        <div className="flex items-center gap-4 mb-8">
          {['🏹', '💣', '⚡', '🔥', '❄️'].map((icon, i) => (
            <span
              key={i}
              className="text-3xl animate-pulse"
              style={{ animationDelay: `${i * 0.2}s` }}
            >
              {icon}
            </span>
          ))}
        </div>

        {/* Play Button */}
        <button
          onClick={handlePlay}
          className="group relative px-12 py-4 bg-gradient-to-r from-indigo-600 to-purple-600
            hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xl
            rounded-full shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50
            transition-all duration-300 transform hover:scale-105 active:scale-95
            flex items-center gap-3"
        >
          <Play className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          PLAY
        </button>

        {/* Decorative Lines */}
        <div className="flex items-center gap-4 mt-8">
          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent to-indigo-500" />
          <span className="text-slate-500 text-sm">DEFEND THE REALM</span>
          <div className="w-24 h-0.5 bg-gradient-to-l from-transparent to-indigo-500" />
        </div>

        {/* Footer */}
        <div className="mt-12 text-slate-500 text-sm">
          <p>Build towers • Stop enemies • Survive waves</p>
        </div>
      </div>

      {/* Bottom Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500" />
    </div>
  )
}
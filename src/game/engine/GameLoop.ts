import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../config/GameConstants'

type UpdateCallback = (deltaTime: number) => void
type RenderCallback = (ctx: CanvasRenderingContext2D) => void

export class GameLoop {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private lastTime: number = 0
  private isRunning: boolean = false
  private isPaused: boolean = false
  private speed: number = 1
  private animationId: number = 0
  private updateCallback: UpdateCallback | null = null
  private renderCallback: RenderCallback | null = null

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    const context = canvas.getContext('2d')
    if (!context) {
      throw new Error('Failed to get 2D context')
    }
    this.ctx = context
  }

  public setUpdateCallback(callback: UpdateCallback): void {
    this.updateCallback = callback
  }

  public setRenderCallback(callback: RenderCallback): void {
    this.renderCallback = callback
  }

  public start(): void {
    if (this.isRunning) return
    this.isRunning = true
    this.isPaused = false
    this.lastTime = performance.now()
    this.loop()
  }

  public stop(): void {
    this.isRunning = false
    if (this.animationId) {
      cancelAnimationFrame(this.animationId)
    }
  }

  public pause(): void {
    this.isPaused = true
  }

  public resume(): void {
    if (!this.isPaused) return
    this.isPaused = false
    this.lastTime = performance.now()
    this.loop()
  }

  public togglePause(): void {
    if (this.isPaused) {
      this.resume()
    } else {
      this.pause()
    }
  }

  public setSpeed(speed: number): void {
    this.speed = Math.max(1, Math.min(3, speed))
  }

  public getSpeed(): number {
    return this.speed
  }

  public isPausedState(): boolean {
    return this.isPaused
  }

  public isRunningState(): boolean {
    return this.isRunning
  }

  private loop = (): void => {
    if (!this.isRunning || this.isPaused) return

    const currentTime = performance.now()
    let deltaTime = (currentTime - this.lastTime) / 1000
    this.lastTime = currentTime

    // Apply speed modifier
    deltaTime *= this.speed

    // Cap deltaTime to prevent spiral of death
    deltaTime = Math.min(deltaTime, 0.1)

    if (this.updateCallback) {
      this.updateCallback(deltaTime)
    }

    if (this.renderCallback) {
      this.renderCallback(this.ctx)
    }

    this.animationId = requestAnimationFrame(this.loop)
  }
}

export const createGameLoop = (canvas: HTMLCanvasElement): GameLoop => {
  return new GameLoop(canvas)
}

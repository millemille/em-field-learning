import { Component, Suspense, type ReactNode } from 'react'
import { Canvas } from '@react-three/fiber'
import { Bloom, EffectComposer } from '@react-three/postprocessing'
import { FieldLabScene } from '@/components/lab/FieldLabScene'
import { CircuitLabScene } from '@/components/lab/CircuitLabScene'
import { useLabStore } from '@/hooks/useLabStore'

class WebGLErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) return this.props.fallback
    return this.props.children
  }
}

function SceneContent() {
  const activeTab = useLabStore((s) => s.activeTab)
  return activeTab === 'field' ? <FieldLabScene /> : <CircuitLabScene />
}

function PostFX() {
  return (
    <EffectComposer>
      <Bloom
        luminanceThreshold={0.15}
        luminanceSmoothing={0.9}
        intensity={1.15}
        mipmapBlur
      />
    </EffectComposer>
  )
}

export function LabCanvas() {
  return (
    <WebGLErrorBoundary
      fallback={
        <div className="flex h-full min-h-[280px] items-center justify-center p-6 text-center text-[var(--muted)]">
          WebGL is required for the interactive lab. Try a browser with hardware
          acceleration enabled.
          <br />
          互動實驗需要 WebGL，請使用已啟用硬體加速的瀏覽器。
        </div>
      }
    >
      <Canvas
        className="!h-full !w-full"
        dpr={[1, 2]}
        camera={{ position: [14, 10, 14], fov: 42, near: 0.1, far: 200 }}
        gl={{ antialias: true, alpha: false }}
      >
        <color attach="background" args={['#06080c']} />
        <fog attach="fog" args={['#06080c', 18, 55]} />
        <Suspense fallback={null}>
          <SceneContent />
          <PostFX />
        </Suspense>
      </Canvas>
    </WebGLErrorBoundary>
  )
}

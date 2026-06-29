import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Grid, Line, OrbitControls, Text } from '@react-three/drei'
import * as THREE from 'three'
import { useLabStore } from '@/hooks/useLabStore'
import { VIZ } from '@/lib/theme'
import { solveDcCircuit } from '@/lib/physics/dcPower'

const WIRE_POINTS: [number, number, number][] = [
  [-4, -1, 0],
  [-4, 2, 0],
  [4, 2, 0],
  [4, -1, 0],
  [-4, -1, 0],
]

function ElectronFlow({ speed }: { speed: number }) {
  const count = 48
  const ref = useRef<THREE.InstancedMesh>(null)
  const temp = useMemo(() => new THREE.Object3D(), [])
  const offsets = useMemo(() => Array.from({ length: count }, (_, i) => i / count), [count])
  const curve = useMemo(() => {
    const pts = WIRE_POINTS.map((p) => new THREE.Vector3(...p))
    return new THREE.CatmullRomCurve3(pts, true, 'catmullrom', 0.15)
  }, [])

  useFrame(() => {
    const mesh = ref.current
    if (!mesh) return
    const t = performance.now() * 0.001 * speed

    offsets.forEach((offset, i) => {
      const u = (offset + t * 0.15) % 1
      const p = curve.getPointAt(u)
      const tangent = curve.getTangentAt(u).normalize()
      temp.position.copy(p)
      temp.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), tangent)
      temp.scale.setScalar(0.06)
      temp.updateMatrix()
      mesh.setMatrixAt(i, temp.matrix)
    })
    mesh.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshStandardMaterial
        color={VIZ.accent}
        emissive={VIZ.accentEmissive}
        emissiveIntensity={0.65}
      />
    </instancedMesh>
  )
}

function BatteryMesh() {
  return (
    <group position={[-4, 0.5, 0]}>
      <mesh>
        <boxGeometry args={[0.6, 1.8, 0.9]} />
        <meshStandardMaterial
          color="#2a3344"
          metalness={0.6}
          roughness={0.35}
          emissive={VIZ.accentEmissive}
          emissiveIntensity={0.08}
        />
      </mesh>
      <mesh position={[0, 1.05, 0]}>
        <boxGeometry args={[0.25, 0.2, 0.25]} />
        <meshStandardMaterial color={VIZ.warm} metalness={0.8} roughness={0.2} />
      </mesh>
      <Text position={[0, -1.35, 0]} fontSize={0.28} color={VIZ.muted} anchorX="center">
        V+
      </Text>
    </group>
  )
}

function ResistorMesh({ heat }: { heat: number }) {
  const glow = Math.min(heat, 1)
  return (
    <group position={[0, 2, 0]}>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[2.2, 0.55, 0.55]} />
        <meshStandardMaterial
          color="#3d2a22"
          emissive="#ff6b4a"
          emissiveIntensity={0.2 + glow * 1.2}
          metalness={0.3}
          roughness={0.5}
        />
      </mesh>
      <Text position={[0, 0.75, 0]} fontSize={0.3} color={VIZ.warm} anchorX="center">
        R
      </Text>
    </group>
  )
}

export function CircuitLabScene() {
  const voltage = useLabStore((s) => s.voltage)
  const resistance = useLabStore((s) => s.resistance)
  const { current, power } = solveDcCircuit(voltage, resistance)
  const flowSpeed = Math.min(Math.max(current * 8, 0.2), 4)
  const heat = Math.min(power / 120, 1)

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[6, 8, 6]} intensity={0.75} color={VIZ.warm} />
      <pointLight position={[-6, 2, -4]} intensity={0.35} color={VIZ.accent} />

      <Grid
        args={[16, 16]}
        cellSize={1}
        cellThickness={0.2}
        cellColor="#2a2826"
        sectionSize={4}
        sectionThickness={0.4}
        sectionColor="#3a3834"
        fadeDistance={22}
        infiniteGrid
        position={[0, -1.5, 0]}
      />

      <Line
        points={WIRE_POINTS}
        color={VIZ.accent}
        lineWidth={2}
        transparent
        opacity={0.85}
      />

      <BatteryMesh />
      <ResistorMesh heat={heat} />
      <ElectronFlow speed={flowSpeed} />

      <Text position={[0, -2.2, 0]} fontSize={0.35} color={VIZ.warm} anchorX="center">
        {`I = ${current.toFixed(2)} A   P = ${power.toFixed(1)} W`}
      </Text>

      <OrbitControls
        enableDamping
        dampingFactor={0.06}
        minDistance={8}
        maxDistance={24}
        target={[0, 0.5, 0]}
      />
    </>
  )
}

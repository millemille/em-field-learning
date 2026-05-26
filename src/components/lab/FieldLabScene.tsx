import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { Grid, Line, OrbitControls, Stars } from '@react-three/drei'
import * as THREE from 'three'
import {
  chargeInteractionLabel,
  distanceBetween,
  electricFieldAt,
  forceOnTestCharge,
  sampleFieldGrid,
  vecLen,
  vecNormalize,
  type FieldSample,
} from '@/lib/physics/coulomb'
import { useLabStore } from '@/hooks/useLabStore'

const GRID_DIV = 8
const BOUNDS = { min: -5, max: 5 }
const ARROW_MIN = 0.35
const ARROW_MAX = 1.35

function FieldArrows({ samples }: { samples: FieldSample[] }) {
  const ref = useRef<THREE.InstancedMesh>(null)
  const temp = useMemo(() => new THREE.Object3D(), [])
  const up = useMemo(() => new THREE.Vector3(0, 1, 0), [])
  const dir = useMemo(() => new THREE.Vector3(), [])

  useLayoutEffect(() => {
    const mesh = ref.current
    if (!mesh) return

    const maxMag = samples.reduce((max, s) => Math.max(max, s.magnitude), 0)
    if (maxMag < 1e-12) return

    samples.forEach((s, i) => {
      const t = s.magnitude / maxMag
      const len = ARROW_MIN + t * (ARROW_MAX - ARROW_MIN)
      dir.set(s.field.x, s.field.y, s.field.z).normalize()
      temp.position.set(s.position.x, s.position.y, s.position.z)
      temp.quaternion.setFromUnitVectors(up, dir)
      temp.scale.set(0.09, len, 0.09)
      temp.updateMatrix()
      mesh.setMatrixAt(i, temp.matrix)
    })
    mesh.instanceMatrix.needsUpdate = true
  }, [samples, temp, up, dir])

  if (samples.length === 0) return null

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, samples.length]} frustumCulled={false}>
      <coneGeometry args={[0.08, 1, 6]} />
      <meshStandardMaterial
        color="#4fd1ff"
        emissive="#4fd1ff"
        emissiveIntensity={1.1}
        transparent
        opacity={0.9}
      />
    </instancedMesh>
  )
}

function FieldLines({ seedCount = 10 }: { seedCount?: number }) {
  const charges = useLabStore((s) => s.charges)
  const lines = useMemo(() => {
    const curves: THREE.Vector3[][] = []
    const seeds: THREE.Vector3[] = []

    for (const c of charges) {
      const r = 0.55
      for (let i = 0; i < seedCount; i++) {
        const angle = (i / seedCount) * Math.PI * 2
        seeds.push(
          new THREE.Vector3(
            c.x + Math.cos(angle) * r,
            c.y,
            c.z + Math.sin(angle) * r,
          ),
        )
      }
    }

    for (const seed of seeds) {
      const pts: THREE.Vector3[] = []
      let p = seed.clone()
      const sign = charges.reduce((s, c) => s + Math.sign(c.q), 0) >= 0 ? 1 : -1
      const step = 0.35 * sign

      for (let n = 0; n < 48; n++) {
        pts.push(p.clone())
        const e = electricFieldAt(charges, { x: p.x, y: p.y, z: p.z })
        const el = vecLen(e)
        if (el < 1e-4) break
        const d = vecNormalize(e)
        p.x += d.x * step
        p.y += d.y * step
        p.z += d.z * step
        if (Math.abs(p.x) > 7 || Math.abs(p.y) > 7 || Math.abs(p.z) > 7) break
      }
      if (pts.length > 2) curves.push(pts)
    }

    return curves
  }, [charges, seedCount])

  return (
    <group>
      {lines.map((pts, i) => (
        <Line
          key={i}
          points={pts}
          color="#b8c0d0"
          transparent
          opacity={0.35}
          lineWidth={1}
        />
      ))}
    </group>
  )
}

function ChargeSphere({
  position,
  q,
}: {
  position: [number, number, number]
  q: number
}) {
  const positive = q >= 0
  const color = positive ? '#5dffb0' : '#ff6b8a'
  const scale = 0.35 + Math.min(Math.abs(q) * 1e5, 0.45)

  return (
    <mesh position={position} scale={scale}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={1.2}
        metalness={0.4}
        roughness={0.25}
      />
    </mesh>
  )
}

function ForceArrow({
  origin,
  force,
}: {
  origin: [number, number, number]
  force: { x: number; y: number; z: number }
}) {
  const mag = vecLen(force)
  const arrow = useMemo(() => {
    if (mag < 1e-12) return null
    const dir = vecNormalize(force)
    const len = Math.min(mag * 8e7, 2.5)
    const dirVec = new THREE.Vector3(dir.x, dir.y, dir.z)
    const originVec = new THREE.Vector3(origin[0], origin[1], origin[2])
    return new THREE.ArrowHelper(dirVec, originVec, len, 0xffe566, 0.22, 0.14)
  }, [force, mag, origin])

  if (!arrow) return null
  return <primitive object={arrow} />
}

function MetricsSync() {
  const charges = useLabStore((s) => s.charges)
  const testChargeQ = useLabStore((s) => s.testChargeQ)
  const testPos = useLabStore((s) => s.testPos)
  const setFieldMetrics = useLabStore((s) => s.setFieldMetrics)

  useEffect(() => {
    const e = electricFieldAt(charges, testPos)
    const f = forceOnTestCharge(charges, testChargeQ, testPos)
    setFieldMetrics({
      fieldMagnitude: vecLen(e),
      forceMagnitude: vecLen(f),
      interaction: chargeInteractionLabel(charges),
      chargeDistance: charges.length >= 2 ? distanceBetween(charges[0], charges[1]) : 0,
    })
  }, [charges, testChargeQ, testPos, setFieldMetrics])

  return null
}

export function FieldLabScene() {
  const charges = useLabStore((s) => s.charges)
  const testChargeQ = useLabStore((s) => s.testChargeQ)
  const testPos = useLabStore((s) => s.testPos)

  const samples = useMemo(
    () => sampleFieldGrid(charges, BOUNDS, GRID_DIV),
    [charges],
  )

  const force = useMemo(
    () => forceOnTestCharge(charges, testChargeQ, testPos),
    [charges, testChargeQ, testPos],
  )

  const testOrigin: [number, number, number] = [testPos.x, testPos.y, testPos.z]

  return (
    <>
      <MetricsSync />
      <ambientLight intensity={0.35} />
      <pointLight position={[10, 12, 8]} intensity={1.2} color="#4fd1ff" />
      <pointLight position={[-8, 4, -6]} intensity={0.5} color="#b8c0d0" />
      <Stars radius={80} depth={40} count={1200} factor={3} fade speed={0.6} />
      <Grid
        args={[20, 20]}
        cellSize={1}
        cellThickness={0.4}
        sectionSize={5}
        sectionThickness={0.8}
        fadeDistance={28}
        infiniteGrid
        position={[0, -0.01, 0]}
      />

      {charges.map((c) => (
        <ChargeSphere key={c.id} position={[c.x, c.y, c.z]} q={c.q} />
      ))}

      <mesh position={testOrigin} scale={0.28}>
        <sphereGeometry args={[1, 24, 24]} />
        <meshStandardMaterial
          color="#ffe566"
          emissive="#ffe566"
          emissiveIntensity={0.9}
          metalness={0.3}
          roughness={0.3}
        />
      </mesh>

      <FieldArrows samples={samples} />
      <FieldLines />
      <ForceArrow origin={testOrigin} force={force} />

      <OrbitControls
        enableDamping
        dampingFactor={0.06}
        minDistance={6}
        maxDistance={28}
        maxPolarAngle={Math.PI * 0.48}
        target={[0, 0, 0]}
      />
    </>
  )
}

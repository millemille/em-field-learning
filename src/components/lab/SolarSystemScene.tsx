import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Grid, Line, OrbitControls, Stars, Text } from '@react-three/drei'
import * as THREE from 'three'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import { useLabStore } from '@/hooks/useLabStore'
import {
  ASTEROID_BELT,
  FOCUS_CAMERA,
  OVERVIEW_CAMERA,
  MOON,
  PLANETS,
  SUN,
  SUN_LIGHT,
  auToScene,
  getBodyWorldPosition,
  moonLocalPosition,
  orbitalPosition,
  periodFromSemiMajorAxisAu,
  spinRate,
} from '@/lib/physics/orbits'

const SURFACE_ROUGHNESS: Record<string, number> = {
  mercury: 0.58,
  venus: 0.42,
  earth: 0.48,
  mars: 0.56,
  jupiter: 0.38,
  saturn: 0.36,
  uranus: 0.32,
  neptune: 0.3,
  moon: 0.62,
}

const GAS_GIANT_IDS = new Set(['jupiter', 'saturn', 'uranus', 'neptune'])

/** Sun-only lighting: parallel rays from the origin; decay 0 avoids false dimming at distance. */
function Sunlight() {
  return (
    <pointLight
      position={[0, 0, 0]}
      intensity={SUN_LIGHT.intensity}
      color={SUN_LIGHT.color}
      decay={0}
      distance={0}
    />
  )
}

/** Duration of camera fly-to when focus changes (seconds). */
const FOCUS_TRANSITION_SEC = 0.75

const FOCUS_VIEW_OFFSET = new THREE.Vector3(1, 0.7, 1).normalize()

function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3
}

type FocusTransition = {
  active: boolean
  elapsed: number
  fromTarget: THREE.Vector3
  fromPosition: THREE.Vector3
  bodyId: string
}

function applyFocusCamera(
  bodyId: string,
  elapsedSec: number,
  timeScale: number,
  target: THREE.Vector3,
  position: THREE.Vector3,
) {
  const p = getBodyWorldPosition(bodyId, elapsedSec, timeScale)
  target.set(p.x, p.y, p.z)
  const dist = (FOCUS_CAMERA[bodyId] ?? FOCUS_CAMERA.earth).distance
  position.copy(target).addScaledVector(FOCUS_VIEW_OFFSET, dist)
}

function SolarOrbitControls({
  focusId,
  elapsedRef,
  timeScale,
}: {
  focusId: string | null
  elapsedRef: React.MutableRefObject<number>
  timeScale: number
}) {
  const setSolarFocusId = useLabStore((s) => s.setSolarFocusId)
  const controlsRef = useRef<OrbitControlsImpl>(null)
  const focusPos = useMemo(() => new THREE.Vector3(), [])
  const goalTarget = useMemo(() => new THREE.Vector3(), [])
  const goalPosition = useMemo(() => new THREE.Vector3(), [])
  const desiredDist = useRef(FOCUS_CAMERA.sun.distance)
  const transitionRef = useRef<FocusTransition | null>(null)

  const camSettings = focusId ? (FOCUS_CAMERA[focusId] ?? FOCUS_CAMERA.earth) : null

  useEffect(() => {
    const controls = controlsRef.current
    if (!focusId || !controls) {
      transitionRef.current = null
      return
    }

    const settings = FOCUS_CAMERA[focusId] ?? FOCUS_CAMERA.earth
    desiredDist.current = settings.distance

    const camera = controls.object as THREE.PerspectiveCamera
    transitionRef.current = {
      active: true,
      elapsed: 0,
      fromTarget: controls.target.clone(),
      fromPosition: camera.position.clone(),
      bodyId: focusId,
    }
  }, [focusId])

  const releaseFocusOnUserInput = () => {
    transitionRef.current = null
    if (focusId) setSolarFocusId(null)
  }

  useFrame((_, delta) => {
    const controls = controlsRef.current
    if (!controls) return

    const camera = controls.object as THREE.PerspectiveCamera
    const trans = transitionRef.current
    const isTransitioning = Boolean(
      trans?.active && focusId && trans.bodyId === focusId,
    )
    controls.enabled = !isTransitioning

    if (isTransitioning && trans && focusId) {
      const bodyId = focusId
      const settings = FOCUS_CAMERA[bodyId] ?? FOCUS_CAMERA.earth
      controls.minDistance = settings.minDistance
      controls.maxDistance = settings.maxDistance

      trans.elapsed += delta
      const u = easeOutCubic(Math.min(trans.elapsed / FOCUS_TRANSITION_SEC, 1))

      applyFocusCamera(bodyId, elapsedRef.current, timeScale, goalTarget, goalPosition)
      controls.target.lerpVectors(trans.fromTarget, goalTarget, u)
      camera.position.lerpVectors(trans.fromPosition, goalPosition, u)

      if (trans.elapsed >= FOCUS_TRANSITION_SEC) {
        trans.active = false
      }

      controls.update()
      return
    }

    if (!focusId) {
      controls.minDistance = OVERVIEW_CAMERA.minDistance
      controls.maxDistance = OVERVIEW_CAMERA.maxDistance
      controls.update()
      return
    }

    const p = getBodyWorldPosition(focusId, elapsedRef.current, timeScale)
    focusPos.set(p.x, p.y, p.z)

    const settings = camSettings ?? FOCUS_CAMERA.earth
    controls.target.lerp(focusPos, 0.14)
    const offset = camera.position.clone().sub(controls.target)
    const dist = offset.length()
    if (dist > 1e-4) {
      const newDist = THREE.MathUtils.lerp(dist, desiredDist.current, 0.1)
      offset.normalize().multiplyScalar(newDist)
      camera.position.copy(controls.target).add(offset)
    }

    controls.minDistance = settings.minDistance
    controls.maxDistance = settings.maxDistance
    controls.update()
  })

  const minDist = focusId ? (camSettings?.minDistance ?? 2) : OVERVIEW_CAMERA.minDistance
  const maxDist = focusId ? (camSettings?.maxDistance ?? 16) : OVERVIEW_CAMERA.maxDistance

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.06}
      minDistance={minDist}
      maxDistance={maxDist}
      maxPolarAngle={Math.PI * 0.48}
      onStart={releaseFocusOnUserInput}
    />
  )
}

function OrbitPath({
  radius,
  visible,
  color = '#4fd1ff',
}: {
  radius: number
  visible: boolean
  color?: string
}) {
  const points = useMemo(() => {
    const segments = 128
    const pts: THREE.Vector3[] = []
    for (let i = 0; i <= segments; i++) {
      const t = (i / segments) * Math.PI * 2
      pts.push(new THREE.Vector3(radius * Math.cos(t), 0, radius * Math.sin(t)))
    }
    return pts
  }, [radius])

  if (!visible) return null

  return (
    <Line
      points={points}
      color={color}
      opacity={0.35}
      transparent
      lineWidth={1}
    />
  )
}

function CelestialBody({
  radius,
  color,
  emissive,
  emissiveIntensity,
  spinRadPerSec,
  focused = false,
  name,
  nameZh,
  bodyId,
  isStar = false,
}: {
  radius: number
  color: string
  emissive: string
  emissiveIntensity: number
  spinRadPerSec: number
  focused?: boolean
  name?: string
  nameZh?: string
  bodyId?: string
  isStar?: boolean
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const roughness = bodyId ? (SURFACE_ROUGHNESS[bodyId] ?? 0.48) : 0.48

  useFrame((_, delta) => {
    if (meshRef.current) meshRef.current.rotation.y += spinRadPerSec * delta
  })

  const focusLabel = focused && name && nameZh ? `${name} / ${nameZh}` : null

  return (
    <group>
      <mesh ref={meshRef}>
        <sphereGeometry args={[radius, 48, 48]} />
        {isStar ? (
          <meshStandardMaterial
            color={color}
            emissive={emissive}
            emissiveIntensity={emissiveIntensity}
            metalness={0}
            roughness={0.35}
          />
        ) : (
          <meshPhysicalMaterial
            color={color}
            roughness={roughness}
            metalness={bodyId && GAS_GIANT_IDS.has(bodyId) ? 0.02 : 0.01}
            clearcoat={bodyId && GAS_GIANT_IDS.has(bodyId) ? 0.12 : 0.04}
            clearcoatRoughness={0.4}
            emissive="#000000"
            emissiveIntensity={0}
            specularIntensity={1}
            envMapIntensity={0}
          />
        )}
      </mesh>
      {focusLabel && (
        <Text
          position={[0, radius * 1.45, 0]}
          fontSize={0.3}
          color="#f0f4fc"
          outlineWidth={0.025}
          outlineColor="#06080c"
          anchorX="center"
          anchorY="bottom"
          textAlign="center"
        >
          {focusLabel}
        </Text>
      )}
    </group>
  )
}

/** Saturn ring plane tilt vs ecliptic (~26.7°), matching typical photographs. */
const SATURN_RING_TILT = (26.7 * Math.PI) / 180

function SaturnRingBand({
  inner,
  outer,
  color,
  opacity,
  renderOrder,
}: {
  inner: number
  outer: number
  color: string
  opacity: number
  renderOrder: number
}) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} renderOrder={renderOrder}>
      <ringGeometry args={[inner, outer, 128]} />
      <meshStandardMaterial
        color={color}
        roughness={0.32}
        metalness={0.06}
        transparent
        opacity={opacity}
        side={THREE.DoubleSide}
        depthWrite={opacity > 0.7}
      />
    </mesh>
  )
}

function SaturnRings() {
  return (
    <group rotation={[SATURN_RING_TILT, 0, 0.1]}>
      {/* B ring — broad bright inner band */}
      <SaturnRingBand inner={1.12} outer={1.38} color="#f7eed8" opacity={0.92} renderOrder={1} />
      {/* Cassini division — narrow darker gap is the space between bands */}
      {/* A ring — main outer band */}
      <SaturnRingBand inner={1.52} outer={2.08} color="#efe4c8" opacity={0.9} renderOrder={2} />
      {/* Faint outer edge */}
      <SaturnRingBand inner={2.1} outer={2.28} color="#d8ccb0" opacity={0.65} renderOrder={3} />
    </group>
  )
}

function PlanetGroup({
  planet,
  elapsedRef,
  timeScale,
  showOrbits,
  focusId,
}: {
  planet: (typeof PLANETS)[number]
  elapsedRef: React.MutableRefObject<number>
  timeScale: number
  showOrbits: boolean
  focusId: string | null
}) {
  const groupRef = useRef<THREE.Group>(null)
  const orbitR = auToScene(planet.semiMajorAxisAu)
  const spin = spinRate(planet.rotationPeriodDays, timeScale)
  const isEarth = planet.id === 'earth'
  const isSaturn = planet.id === 'saturn'
  const focused = focusId === planet.id

  useFrame(() => {
    const g = groupRef.current
    if (!g) return
    const pos = orbitalPosition(
      planet.semiMajorAxisAu,
      planet.orbitalPeriodYears,
      elapsedRef.current,
      timeScale,
      planet.id === 'earth' ? 0 : planet.id.charCodeAt(0) * 0.02,
    )
    g.position.set(pos.x, pos.y, pos.z)
  })

  return (
    <>
      <OrbitPath radius={orbitR} visible={showOrbits} />
      <group ref={groupRef}>
        <group scale={planet.visualRadius}>
          <CelestialBody
            radius={1}
            color={planet.color}
            emissive={planet.emissive}
            emissiveIntensity={planet.emissiveIntensity}
            spinRadPerSec={spin}
            focused={focused}
            name={planet.name}
            nameZh={planet.nameZh}
            bodyId={planet.id}
          />
          {isSaturn && <SaturnRings />}
        </group>
        {isEarth && (
          <MoonGroup
            elapsedRef={elapsedRef}
            timeScale={timeScale}
            showOrbits={showOrbits}
          />
        )}
      </group>
    </>
  )
}

function MoonOrbitPath({ visible }: { visible: boolean }) {
  const points = useMemo(() => {
    const segments = 96
    const r = MOON.orbitSceneRadius
    const tilt = 0.14
    const pts: THREE.Vector3[] = []
    for (let i = 0; i <= segments; i++) {
      const t = (i / segments) * Math.PI * 2
      const x = r * Math.cos(t)
      const z = r * Math.sin(t)
      pts.push(new THREE.Vector3(x, z * tilt, z))
    }
    return pts
  }, [])

  if (!visible) return null

  return (
    <Line
      points={points}
      color="#b8c0d0"
      opacity={0.5}
      transparent
      lineWidth={1}
    />
  )
}

function MoonGroup({
  elapsedRef,
  timeScale,
  showOrbits,
}: {
  elapsedRef: React.MutableRefObject<number>
  timeScale: number
  showOrbits: boolean
}) {
  const moonRef = useRef<THREE.Group>(null)
  const moonSpin = spinRate(MOON.rotationPeriodDays, timeScale)
  useFrame(() => {
    const m = moonRef.current
    if (!m) return
    const local = moonLocalPosition(elapsedRef.current, timeScale, 1.2)
    m.position.set(local.x, local.y, local.z)
  })

  return (
    <>
      <MoonOrbitPath visible={showOrbits} />
      <group ref={moonRef}>
        <CelestialBody
          radius={MOON.visualRadius}
          color={MOON.color}
          emissive={MOON.emissive}
          emissiveIntensity={MOON.emissiveIntensity}
          spinRadPerSec={moonSpin}
          bodyId="moon"
        />
      </group>
    </>
  )
}

function AsteroidBelt({
  elapsedRef,
  timeScale,
  showOrbits,
}: {
  elapsedRef: React.MutableRefObject<number>
  timeScale: number
  showOrbits: boolean
}) {
  const ref = useRef<THREE.InstancedMesh>(null)
  const { innerAu, outerAu, count } = ASTEROID_BELT
  const temp = useMemo(() => new THREE.Object3D(), [])

  const seeds = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const rng = (n: number) => {
        const x = Math.sin(n * 12.9898 + i * 78.233) * 43758.5453
        return x - Math.floor(x)
      }
      const t = rng(i)
      const au = innerAu + t * (outerAu - innerAu)
      const phase = rng(i + 1000) * Math.PI * 2
      const y = (rng(i + 2000) - 0.5) * 0.15
      const size = 0.04 + rng(i + 3000) * 0.06
      return { au, phase, y, size }
    })
  }, [count, innerAu, outerAu])

  useFrame(() => {
    const mesh = ref.current
    if (!mesh) return
    const t = elapsedRef.current

    seeds.forEach((s, i) => {
      const period = periodFromSemiMajorAxisAu(s.au)
      const pos = orbitalPosition(s.au, period, t, timeScale, s.phase)
      temp.position.set(pos.x, s.y, pos.z)
      temp.scale.setScalar(s.size)
      temp.updateMatrix()
      mesh.setMatrixAt(i, temp.matrix)
    })
    mesh.instanceMatrix.needsUpdate = true
  })

  const innerR = auToScene(innerAu)
  const outerR = auToScene(outerAu)

  return (
    <>
      <OrbitPath radius={innerR} visible={showOrbits} color="#6a5a48" />
      <OrbitPath radius={outerR} visible={showOrbits} color="#6a5a48" />
      <instancedMesh ref={ref} args={[undefined, undefined, count]}>
        <sphereGeometry args={[1, 6, 6]} />
        <meshPhysicalMaterial
          color="#8b7a68"
          roughness={0.7}
          metalness={0.01}
          clearcoat={0.03}
          emissive="#000000"
          emissiveIntensity={0}
          envMapIntensity={0}
        />
      </instancedMesh>
    </>
  )
}

function SunMesh({ timeScale, focusId }: { timeScale: number; focusId: string | null }) {
  const spin = spinRate(SUN.rotationPeriodDays, timeScale)
  const focused = focusId === 'sun'

  return (
    <group>
      <CelestialBody
        radius={SUN.visualRadius}
        color={SUN.color}
        emissive={SUN.emissive}
        emissiveIntensity={SUN.emissiveIntensity}
        spinRadPerSec={spin}
        focused={focused}
        name="Sun"
        nameZh="太陽"
        bodyId="sun"
        isStar
      />
    </group>
  )
}

function ElapsedClock({ elapsedRef }: { elapsedRef: React.MutableRefObject<number> }) {
  useFrame((_, delta) => {
    elapsedRef.current += delta
  })
  return null
}

export function SolarSystemScene() {
  const timeScale = useLabStore((s) => s.solarTimeScale)
  const showOrbits = useLabStore((s) => s.solarShowOrbits)
  const focusId = useLabStore((s) => s.solarFocusId)
  const elapsedRef = useRef(0)

  return (
    <>
      <ElapsedClock elapsedRef={elapsedRef} />
      <Sunlight />
      <Stars radius={120} depth={40} count={1200} factor={2} fade speed={0.3} />

      <Grid
        args={[80, 80]}
        cellSize={2}
        cellThickness={0.3}
        sectionSize={8}
        fadeDistance={90}
        fadeStrength={1.2}
        infiniteGrid
        position={[0, -0.02, 0]}
      />

      <SunMesh timeScale={timeScale} focusId={focusId} />

      <AsteroidBelt
        elapsedRef={elapsedRef}
        timeScale={timeScale}
        showOrbits={showOrbits}
      />

      {PLANETS.map((planet) => (
        <PlanetGroup
          key={planet.id}
          planet={planet}
          elapsedRef={elapsedRef}
          timeScale={timeScale}
          showOrbits={showOrbits}
          focusId={focusId}
        />
      ))}

      <SolarOrbitControls
        focusId={focusId}
        elapsedRef={elapsedRef}
        timeScale={timeScale}
      />
    </>
  )
}

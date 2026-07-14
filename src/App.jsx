import { Suspense, useRef, useMemo, useEffect, useState, useCallback } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, MeshDistortMaterial, Sparkles, Trail, useGLTF } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import * as THREE from 'three'
import './App.css'

const MODEL_URL = '/model.glb'

const COLORS = {
  pink: '#F4A0B5',
  rose: '#FFB4A5',
  crimson: '#C8102E',
  ember: '#FF3047',
  lilac: '#D4A0D4',
  cream: '#F2E9DE',
  deepPink: '#8B0A3A',
  green: '#2D5A3D',
}

function FlowerModel({ onLoaded }) {
  const { scene } = useGLTF(MODEL_URL)
  const ref = useRef()

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        if (child.material.emissive) {
          child.material.emissive = new THREE.Color(COLORS.pink)
          child.material.emissiveIntensity = 0.08
        }
      }
    })
    if (onLoaded) onLoaded()
  }, [scene, onLoaded])

  useFrame((state) => {
    if (ref.current) ref.current.rotation.y = state.clock.elapsedTime * 0.06
  })

  const box = new THREE.Box3().setFromObject(scene)
  const size = box.getSize(new THREE.Vector3())
  const maxDim = Math.max(size.x, size.y, size.z)
  const scale = 3 / maxDim

  return <primitive ref={ref} object={scene} scale={scale} position={[0, -1.2, 0]} />
}

function OrganicCore() {
  const ref = useRef()
  useFrame((state) => {
    ref.current.rotation.y = state.clock.elapsedTime * 0.05
    ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.15) * 0.1
  })
  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[1.1, 6]} />
      <MeshDistortMaterial
        color={COLORS.deepPink}
        emissive={COLORS.crimson}
        emissiveIntensity={0.25}
        roughness={0.3}
        metalness={0.5}
        distort={0.3}
        speed={1.5}
        transparent
        opacity={0.6}
      />
    </mesh>
  )
}

function BloomPetals({ count = 22 }) {
  const petals = useMemo(() => {
    const arr = []
    const colors = [COLORS.pink, COLORS.rose, COLORS.lilac, COLORS.cream, COLORS.ember]
    for (let i = 0; i < count; i++) {
      const phi = (i / count) * Math.PI * 2
      const theta = Math.acos(1 - 2 * (i + 0.5) / count)
      arr.push({
        id: i, color: colors[i % colors.length],
        size: 0.04 + Math.sin(i * 1.7) * 0.04,
        orbit: 2 + Math.sin(i * 2.3) * 0.7,
        phi, theta, speed: 0.1 + Math.sin(i) * 0.07, phase: i * 0.4,
      })
    }
    return arr
  }, [count])
  return petals.map((p) => <Petal key={p.id} {...p} />)
}

function Petal({ color, size, orbit, phi, theta, speed, phase }) {
  const ref = useRef()
  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    const a = phi + t * speed
    ref.current.position.set(
      Math.sin(theta) * Math.cos(a) * orbit,
      Math.cos(theta) * orbit * 0.6 + Math.sin(t * 0.4 + phase) * 0.2,
      Math.sin(theta) * Math.sin(a) * orbit
    )
    ref.current.scale.setScalar(1 + Math.sin(t * 1.5 + phase) * 0.2)
  })
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[size, 10, 8]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} roughness={0.4} transparent opacity={0.8} />
    </mesh>
  )
}

function Tendrils({ count = 8 }) {
  const tendrils = useMemo(() => {
    const arr = []
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2
      const len = 2.5 + Math.sin(i * 3.1) * 0.5
      const pts = []
      for (let t = 0; t <= 1; t += 0.04) {
        pts.push(new THREE.Vector3(
          Math.cos(angle + t * 2.5) * t * len * 0.4,
          (t - 0.5) * len,
          Math.sin(angle + t * 2.5) * t * len * 0.4
        ))
      }
      arr.push({ id: i, curve: new THREE.CatmullRomCurve3(pts) })
    }
    return arr
  }, [count])
  return tendrils.map(({ id, curve }) => (
    <mesh key={id}>
      <tubeGeometry args={[curve, 40, 0.01, 6, false]} />
      <meshStandardMaterial color={COLORS.green} emissive={COLORS.green} emissiveIntensity={0.12} roughness={0.7} transparent opacity={0.45} />
    </mesh>
  ))
}

function Halos() {
  const colors = [COLORS.pink, COLORS.lilac, COLORS.rose]
  const refs = [useRef(), useRef(), useRef()]
  useFrame(({ clock }) => {
    refs.forEach((r, i) => { if (r.current) r.current.rotation.z = clock.elapsedTime * 0.02 * (i + 1) })
  })
  return colors.map((color, i) => (
    <mesh key={i} ref={refs[i]} rotation={[Math.PI / 2 + i * 0.4, 0, i * 0.6]}>
      <torusGeometry args={[2.2 + i * 0.5, 0.005, 8, 128]} />
      <meshBasicMaterial color={color} transparent opacity={0.1 + i * 0.04} />
    </mesh>
  ))
}

function FloatingOrb({ color, radius, speed }) {
  const ref = useRef()
  useFrame(({ clock }) => {
    const t = clock.elapsedTime * speed
    ref.current.position.set(Math.sin(t) * radius, Math.cos(t * 0.7) * radius * 0.4, Math.cos(t) * radius)
  })
  return (
    <Trail width={0.12} length={5} color={color} attenuation={(t) => t * t}>
      <mesh ref={ref}>
        <sphereGeometry args={[0.02, 8, 6]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </Trail>
  )
}

function InteractiveGroup({ children }) {
  const groupRef = useRef()
  const mouse = useRef({ x: 0, y: 0 })
  const smooth = useRef({ x: 0, y: 0 })
  const scrollY = useRef(0)

  useEffect(() => {
    const onMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2
    }
    const onScroll = () => { scrollY.current = window.scrollY }
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  useFrame(() => {
    smooth.current.x += (mouse.current.x - smooth.current.x) * 0.03
    smooth.current.y += (mouse.current.y - smooth.current.y) * 0.03
    const scrollRot = scrollY.current * 0.002
    groupRef.current.rotation.y += smooth.current.x * 0.006
    groupRef.current.rotation.x += smooth.current.y * 0.003
    groupRef.current.rotation.y += (scrollRot - groupRef.current.rotation.y) * 0.02
  })

  return <group ref={groupRef}>{children}</group>
}

function CameraRig() {
  const { camera } = useThree()
  const mouse = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const h = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('pointermove', h, { passive: true })
    return () => window.removeEventListener('pointermove', h)
  }, [])

  useFrame(() => {
    const dist = Math.sqrt(mouse.current.x ** 2 + mouse.current.y ** 2)
    const tz = 5.5 - dist * 0.5
    camera.position.z += (tz - camera.position.z) * 0.025
    camera.position.x += (-mouse.current.x * 0.25 - camera.position.x) * 0.02
    camera.position.y += (-mouse.current.y * 0.15 - camera.position.y) * 0.02
    camera.lookAt(0, 0, 0)
  })
  return null
}

function SceneContent({ onLoaded }) {
  return (
    <>
      <CameraRig />
      <ambientLight intensity={0.25} color="#1a0a12" />
      <pointLight position={[3, 4, 5]} intensity={3} color={COLORS.pink} distance={20} />
      <pointLight position={[-4, 2, 3]} intensity={2} color={COLORS.lilac} distance={18} />
      <pointLight position={[0, -3, -4]} intensity={1.5} color={COLORS.ember} distance={15} />
      <pointLight position={[2, 5, -2]} intensity={1.2} color={COLORS.cream} distance={14} />

      <InteractiveGroup>
        <Float speed={0.8} rotationIntensity={0.2} floatIntensity={0.3}>
          <Suspense fallback={null}>
            <FlowerModel onLoaded={onLoaded} />
          </Suspense>
        </Float>

        <OrganicCore />
        <BloomPetals />
        <Tendrils />
        <Halos />

        <Sparkles count={150} scale={6} size={2} speed={0.25} color={COLORS.pink} opacity={0.4} />
        <Sparkles count={80} scale={5} size={2.5} speed={0.15} color={COLORS.lilac} opacity={0.25} />

        {[COLORS.pink, COLORS.rose, COLORS.ember, COLORS.lilac].map((c, i) => (
          <FloatingOrb key={i} color={c} radius={2.8 + i * 0.3} speed={0.12 + i * 0.04} />
        ))}
      </InteractiveGroup>

      <EffectComposer>
        <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} intensity={1.2} radius={0.8} />
        <Vignette eskil={false} offset={0.15} darkness={0.85} />
      </EffectComposer>
    </>
  )
}

export default function App() {
  const [loaded, setLoaded] = useState(false)
  const handleLoaded = useCallback(() => setLoaded(true), [])

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 5000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="app">
      <div className={`loader ${loaded ? 'done' : ''}`}>LOADING...</div>

      <div className="canvas-container">
        <Canvas
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
          camera={{ position: [0, 0, 5.5], fov: 45 }}
          dpr={[1, 2]}
          gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.3 }}
        >
          <color attach="background" args={['#050208']} />
          <fog attach="fog" args={['#050208', 7, 16]} />
          <SceneContent onLoaded={handleLoaded} />
        </Canvas>
      </div>

      <header className="overlay-header">
        <div className="logo">
          <span className="logo-dot" />
          <span className="logo-text">AMAI</span>
        </div>
        <nav className="nav">
          <a href="#services">УСЛУГИ</a>
          <a href="#process">ПРОЦЕСС</a>
          <a href="#cases">КЕЙСЫ</a>
          <a href="#pricing">ФОРМАТЫ</a>
          <a href="#contact">КОНТАКТЫ</a>
        </nav>
        <a href="#contact" className="nav-cta">ОСТАВИТЬ ЗАЯВКУ</a>
      </header>

      <div className="hero-content">
        <p className="eyebrow">AESTHETIC MIND AI — SMM & PRODUCT AGENCY</p>
        <h1 className="hero-title">
          <span>Создаём бренды</span>
          <span>в <em>латентном</em> пространстве —</span>
          <span>выводим их в продажи.</span>
        </h1>
      </div>

      <div className="hero-stats">
        <div className="stat"><span className="stat-value">47+</span><span className="stat-label">ПРОЕКТОВ</span></div>
        <div className="stat"><span className="stat-value">12</span><span className="stat-label">ЭКСПЕРТОВ</span></div>
        <div className="stat"><span className="stat-value">98%</span><span className="stat-label">ДОВОЛЬНЫ</span></div>
      </div>

      <div className="scroll-spacer" />
    </div>
  )
}

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

/**
 * Professional Luxury 3D Atmosphere
 * - Organic undulating silk/fabric geometry with subtle gold sheen
 * - Delicate stardust particle field with gentle mouse repulsion
 * - Blends into warm linen background (#f7f3ec) with zero clutter
 */
export default function ThreeBackground() {
  const containerRef = useRef(null)

  useEffect(() => {
    const canvas = document.createElement('canvas')
    canvas.id = 'three-canvas'
    canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 0;
      opacity: 0.75;
    `
    document.body.appendChild(canvas)

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    renderer.setSize(window.innerWidth, window.innerHeight)

    // Scene & Camera
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100)
    camera.position.set(0, 0, 7)

    // Ambient Lighting
    const ambient = new THREE.AmbientLight(0xfff7ed, 1.2)
    scene.add(ambient)

    const keyLight = new THREE.DirectionalLight(0xc5a062, 1.5)
    keyLight.position.set(4, 5, 4)
    scene.add(keyLight)

    const fillLight = new THREE.DirectionalLight(0x7a6448, 0.8)
    fillLight.position.set(-4, -2, 2)
    scene.add(fillLight)

    // --- 1. Undulating Silk / Fabric Mesh ---
    // High-density plane deformed smoothly like draped vintage fabric
    const fabricGeo = new THREE.PlaneGeometry(16, 12, 48, 48)
    const pos = fabricGeo.attributes.position
    const initialPositions = pos.array.slice()

    const fabricMat = new THREE.MeshStandardMaterial({
      color: 0xede4d6,
      roughness: 0.65,
      metalness: 0.25,
      wireframe: false,
      transparent: true,
      opacity: 0.22,
      side: THREE.DoubleSide,
    })

    const fabricMesh = new THREE.Mesh(fabricGeo, fabricMat)
    fabricMesh.rotation.x = -Math.PI * 0.25
    fabricMesh.position.set(1.5, -0.5, -1)
    scene.add(fabricMesh)

    // --- 2. Floating Golden Ribbon Ring (Couture Thread Motif) ---
    const ribbonGeo = new THREE.TorusGeometry(2.4, 0.025, 16, 120)
    const ribbonMat = new THREE.MeshStandardMaterial({
      color: 0xc5a062,
      metalness: 0.85,
      roughness: 0.2,
      transparent: true,
      opacity: 0.35,
    })
    const ribbon = new THREE.Mesh(ribbonGeo, ribbonMat)
    ribbon.position.set(3, 1, -2)
    ribbon.rotation.x = 1.2
    scene.add(ribbon)

    // --- 3. Subtle Luxury Aura Particles ---
    const particleCount = 100
    const particleGeo = new THREE.BufferGeometry()
    const pCoords = new Float32Array(particleCount * 3)
    const pScales = new Float32Array(particleCount)

    for (let i = 0; i < particleCount; i++) {
      pCoords[i * 3]     = (Math.random() - 0.5) * 16
      pCoords[i * 3 + 1] = (Math.random() - 0.5) * 10
      pCoords[i * 3 + 2] = (Math.random() - 0.5) * 6 - 1
      pScales[i] = Math.random() * 0.6 + 0.4
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(pCoords, 3))

    // Canvas particle texture for smooth round dots
    const pCanvas = document.createElement('canvas')
    pCanvas.width = 32
    pCanvas.height = 32
    const pCtx = pCanvas.getContext('2d')
    const grad = pCtx.createRadialGradient(16, 16, 0, 16, 16, 16)
    grad.addColorStop(0, 'rgba(197, 160, 98, 0.9)')
    grad.addColorStop(0.5, 'rgba(197, 160, 98, 0.35)')
    grad.addColorStop(1, 'rgba(197, 160, 98, 0)')
    pCtx.fillStyle = grad
    pCtx.fillRect(0, 0, 32, 32)
    const pTexture = new THREE.CanvasTexture(pCanvas)

    const particleMat = new THREE.PointsMaterial({
      size: 0.12,
      map: pTexture,
      transparent: true,
      opacity: 0.45,
      blending: THREE.NormalBlending,
      depthWrite: false,
    })
    const particles = new THREE.Points(particleGeo, particleMat)
    scene.add(particles)

    // Smooth Mouse Tracking
    let targetMouseX = 0
    let targetMouseY = 0
    let mouseX = 0
    let mouseY = 0

    const onMouseMove = (e) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2
      targetMouseY = -(e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', onMouseMove, { passive: true })

    // Resize Handler
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', onResize)

    // Animation Loop
    let animId
    const clock = new THREE.Clock()

    const animate = () => {
      animId = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()

      // Smooth mouse lerp
      mouseX += (targetMouseX - mouseX) * 0.04
      mouseY += (targetMouseY - mouseY) * 0.04

      // Camera parallax
      camera.position.x = mouseX * 0.4
      camera.position.y = mouseY * 0.3
      camera.lookAt(0, 0, 0)

      // Deform fabric like luxurious silk waving gently in the breeze
      const positions = fabricGeo.attributes.position.array
      for (let i = 0; i < positions.length; i += 3) {
        const u = initialPositions[i]
        const v = initialPositions[i + 1]
        // Gentle compound wave equation
        positions[i + 2] =
          Math.sin(u * 0.5 + t * 0.6) * 0.35 +
          Math.cos(v * 0.4 + t * 0.5) * 0.3 +
          Math.sin((u + v) * 0.3 + t * 0.4) * 0.2
      }
      fabricGeo.attributes.position.needsUpdate = true
      fabricGeo.computeVertexNormals()

      // Subtle ribbon rotation
      ribbon.rotation.z = t * 0.12
      ribbon.rotation.y = Math.sin(t * 0.2) * 0.3
      ribbon.position.y = 1 + Math.sin(t * 0.4) * 0.2

      // Drift particles gently
      particles.rotation.y = t * 0.015
      particles.rotation.x = Math.sin(t * 0.02) * 0.05

      renderer.render(scene, camera)
    }
    animate()

    // Cleanup
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
      fabricGeo.dispose()
      fabricMat.dispose()
      ribbonGeo.dispose()
      ribbonMat.dispose()
      particleGeo.dispose()
      particleMat.dispose()
      pTexture.dispose()
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas)
    }
  }, [])

  return null
}

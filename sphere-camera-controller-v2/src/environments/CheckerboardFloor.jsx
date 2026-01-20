import { useMemo } from 'react'
import { RigidBody, CuboidCollider } from '@react-three/rapier'
import * as THREE from 'three'


// Checkerboard texture generator
function createCheckerboardTexture({ size = 10, squares = 10, color1 = '#4a7c59', color2 = '#6b6b6b' } = {}) {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size * squares
  const ctx = canvas.getContext('2d')
  for (let y = 0; y < squares; y++) {
    for (let x = 0; x < squares; x++) {
      ctx.fillStyle = (x + y) % 2 === 0 ? color1 : color2
      ctx.fillRect(x * size, y * size, size, size)
    }
  }
  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(10, 10)
  return texture
}

// 1. The Floor Component
export function CheckerboardFloor(props) {
  const texture = useMemo(() => createCheckerboardTexture({ size: 32, squares: 2, color1: '#4a7c59', color2: '#6b6b6b' }), [])
  
  return (
    <RigidBody type="fixed" {...props}>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        {/* The visual representation of our collider */}
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial map={texture} />
      </mesh>
      <CuboidCollider args={[50, 0.1, 50]} position={[0, -0.1, 0]} />
    </RigidBody>
  )
}

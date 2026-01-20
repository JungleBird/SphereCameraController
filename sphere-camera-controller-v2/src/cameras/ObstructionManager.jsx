import React, { useMemo, useEffect } from 'react'
import * as THREE from 'three'
import { useThree, useFrame } from '@react-three/fiber'

export function ObstructionManager({ target }) {
  const { camera, scene } = useThree()
  const raycaster = useMemo(() => new THREE.Raycaster(), [])
  const fadedObjects = useMemo(() => [], [])
  const originalMaterials = useMemo(() => new Map(), [])
  
  // Pre-allocate vectors to avoid garbage collection
  const targetPosition = useMemo(() => new THREE.Vector3(), [])
  const direction = useMemo(() => new THREE.Vector3(), [])
  const frameCounter = useMemo(() => ({ count: 0 }), [])

  useEffect(() => {
    return () => {
      fadedObjects.forEach((obj) => {
        if (obj.material) {
          const original = originalMaterials.get(obj.uuid)
          if (original) {
            obj.material.transparent = original.transparent
            obj.material.opacity = original.opacity
            obj.material.needsUpdate = true
          } else {
            obj.material.transparent = false
            obj.material.opacity = 1.0
            obj.material.needsUpdate = true
          }
        }
      })
      originalMaterials.clear()
    }
  }, [fadedObjects, originalMaterials])

  useFrame(() => {
    // Throttle: only run every 3rd frame (20 FPS is enough for obstruction detection)
    frameCounter.count++
    if (frameCounter.count % 3 !== 0) return

    // Determine target position (reuse pre-allocated vector)
    if (target?.current) {
      target.current.getWorldPosition(targetPosition)
    } else if (target instanceof THREE.Vector3) {
      targetPosition.copy(target)
    } else {
      return
    }

    // Raycast from target to camera (reuse pre-allocated direction vector)
    direction.subVectors(camera.position, targetPosition).normalize()
    raycaster.set(targetPosition, direction)
    
    // Required for LineSegments2 (used by Drei's Line/Edges) to work correctly
    raycaster.camera = camera

    const intersects = raycaster.intersectObjects(scene.children, true)
    const distanceToCamera = targetPosition.distanceTo(camera.position)
    const currentFaded = []

    if (intersects.length > 0) {
      intersects.forEach((intersect) => {
        // Fade objects between target and camera (ignoring very close ones)
        if (intersect.distance < distanceToCamera && intersect.distance > 0.5) {
          const obj = intersect.object
          // Ensure object has material
          if (obj.material && !currentFaded.includes(obj)) {
            currentFaded.push(obj)
            
            // Store original state if not already stored
            if (!originalMaterials.has(obj.uuid)) {
              originalMaterials.set(obj.uuid, {
                transparent: obj.material.transparent,
                opacity: obj.material.opacity
              })
            }

            obj.material.transparent = true
            obj.material.opacity = 0.3
            obj.material.needsUpdate = true
          }
        }
      })
    }

    // Restore opacity for objects no longer obstructing
    fadedObjects.forEach((obj) => {
      if (!currentFaded.includes(obj) && obj.material) {
        const original = originalMaterials.get(obj.uuid)
        if (original) {
          obj.material.transparent = original.transparent
          obj.material.opacity = original.opacity
          obj.material.needsUpdate = true
        } else {
          // Fallback if original state wasn't captured (shouldn't happen)
          obj.material.transparent = false
          obj.material.opacity = 1.0
          obj.material.needsUpdate = true
        }
      }
    })

    // Update fadedObjects array in place
    fadedObjects.length = 0
    fadedObjects.push(...currentFaded)
  })

  return null
}

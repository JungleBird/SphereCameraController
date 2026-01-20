import React from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useKeyboardControls } from './useKeyboardControls'
import * as THREE from 'three'

export function useSphereController({rigidBodyRef, speed = 1}) {
    
  const keys = useKeyboardControls();
  const { camera } = useThree();

  useFrame(() => {
    if (!rigidBodyRef.current) return;

    // Get camera's forward direction
    const cameraDirection = new THREE.Vector3();
    camera.getWorldDirection(cameraDirection);
    
    // Project to horizontal plane (ignore vertical component)
    cameraDirection.y = 0;
    cameraDirection.normalize();
    
    // Get right vector (perpendicular to forward on horizontal plane)
    const rightDirection = new THREE.Vector3();
    rightDirection.crossVectors(cameraDirection, new THREE.Vector3(0, 1, 0));
    rightDirection.normalize();
    
    // Build impulse vector based on camera-relative directions
    const impulseVector = new THREE.Vector3();
    
    if (keys.current.forward) {
      impulseVector.add(cameraDirection.clone().multiplyScalar(speed * 0.1));
    }
    if (keys.current.backward) {
      impulseVector.add(cameraDirection.clone().multiplyScalar(-speed * 0.1));
    }
    if (keys.current.left) {
      impulseVector.add(rightDirection.clone().multiplyScalar(-speed * 0.1));
    }
    if (keys.current.right) {
      impulseVector.add(rightDirection.clone().multiplyScalar(speed * 0.1));
    }
    
    const impulse = {
      x: impulseVector.x,
      y: impulseVector.y,
      z: impulseVector.z
    };

    rigidBodyRef.current.applyImpulse(impulse, true);
  });
}

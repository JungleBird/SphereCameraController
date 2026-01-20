import { useEffect, useRef } from 'react';

// Keyboard input hook
export function useKeyboardControls() {
  const keys = useRef({ forward: false, backward: false, left: false, right: false })

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.code) {
        case 'ArrowUp':
        case 'KeyW':
          keys.current.forward = true
          break
        case 'ArrowDown':
        case 'KeyS':
          keys.current.backward = true
          break
        case 'ArrowLeft':
        case 'KeyA':
          keys.current.left = true
          break
        case 'ArrowRight':
        case 'KeyD':
          keys.current.right = true
          break
      }
    }

    const handleKeyUp = (e) => {
      switch (e.code) {
        case 'ArrowUp':
        case 'KeyW':
          keys.current.forward = false
          break
        case 'ArrowDown':
        case 'KeyS':
          keys.current.backward = false
          break
        case 'ArrowLeft':
        case 'KeyA':
          keys.current.left = false
          break
        case 'ArrowRight':
        case 'KeyD':
          keys.current.right = false
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  return keys
}
import React, { useRef, forwardRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import * as THREE from 'three';

const SPHERE_CONFIG = {
  radius: 0.6,
  segments: 64,
};

// Export GlassMarbleBallMesh for reuse in other components
export const GlassSphereMesh = (props) => {
  return (
    <group {...props}>
      {/* Outer Glass Shell with high refractive index */}
      <mesh castShadow receiveShadow renderOrder={2}>
        <sphereGeometry args={[SPHERE_CONFIG.radius, SPHERE_CONFIG.segments, SPHERE_CONFIG.segments]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transmission={1.0} // Fully transparent glass
          opacity={1}
          roughness={0.02} // Extremely smooth glass
          thickness={2.5} // Thick glass for strong refraction
          ior={2.4} // Very high refractive index (crown glass/crystal)
          clearcoat={1.0}
          clearcoatRoughness={0.0}
          envMapIntensity={1.8}
          depthWrite={false}
          transparent={true}
        />
      </mesh>

      {/* Inner swirl patterns - typical of glass marbles */}
      <group renderOrder={1}>
        {/* Central colorful swirl */}
        <mesh position={[0, 0, 0]}>
          <torusGeometry args={[SPHERE_CONFIG.radius * 0.3, SPHERE_CONFIG.radius * 0.08, 8, 16]} />
          <meshStandardMaterial 
            color="#4169E1" 
            transparent 
            opacity={0.7}
            emissive="#4169E1"
            emissiveIntensity={0.2}
          />
        </mesh>
        
        {/* Secondary swirl pattern */}
        <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[SPHERE_CONFIG.radius * 0.25, SPHERE_CONFIG.radius * 0.05, 6, 12]} />
          <meshStandardMaterial 
            color="#FF6347" 
            transparent 
            opacity={0.6}
            emissive="#FF6347"
            emissiveIntensity={0.15}
          />
        </mesh>
        
        {/* Tertiary swirl */}
        <mesh position={[0, 0, 0]} rotation={[0, Math.PI / 2, Math.PI / 2]}>
          <torusGeometry args={[SPHERE_CONFIG.radius * 0.2, SPHERE_CONFIG.radius * 0.03, 6, 12]} />
          <meshStandardMaterial 
            color="#32CD32" 
            transparent 
            opacity={0.5}
            emissive="#32CD32"
            emissiveIntensity={0.1}
          />
        </mesh>
      </group>
      
      {/* Subtle inner glow */}
      <pointLight 
        position={[0, 0, 0]} 
        intensity={0.2} 
        distance={SPHERE_CONFIG.radius * 2} 
        color="#ffffff"
      />
    </group>
  );
};


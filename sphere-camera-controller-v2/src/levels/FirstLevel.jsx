import React, { useRef, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import {
  Physics,
  RigidBody,
  BallCollider,
  CuboidCollider,
} from "@react-three/rapier";
import { OrbitControls } from "@react-three/drei";
import { useSphereController } from "../controls/useSphereController";
import { CheckerboardFloor } from "../environments/CheckerboardFloor";
import { GlassSphereMesh } from "../models/GlassSphere";
import { StreetLightWithCollision } from "../environments/StreetLight";
import FollowCamera from "../cameras/FollowCamera";

const BALL_CONFIG = {
  radius: 0.6,
};

function FallingBox({ position = [0, 5, 0], ...props }) {
  return (
    <RigidBody position={position} {...props}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="orange" roughness={0.4} metalness={0.2} />
      </mesh>
    </RigidBody>
  );
}

// 1. Controlled Sphere with keyboard input
function SphereController({
  rigidBodyRef,
  visualRef,
  position = [0, 2, 0],
  radius = BALL_CONFIG.radius,
  speed = 1,
  color = "#3498db",
  ...props
}) {

  useSphereController({ rigidBodyRef, speed });


  return (
    <RigidBody
      ref={rigidBodyRef}
      position={position}
      colliders={false}
      linearDamping={0.5}
      angularDamping={0.5}
      {...props}
    >
      <BallCollider args={[radius]} />
      <group ref={visualRef}>
        <GlassSphereMesh />
      </group>
    </RigidBody>
  );
}

// 2. Camera Controller Component
function CameraController({ visualRef, controlsRef, springiness = 0.1 }) {
  return (
    <>
      <OrbitControls ref={controlsRef} />
      <FollowCamera
        visualRef={visualRef}
        controlsRef={controlsRef}
        springiness={springiness}
      />
    </>
  );
}

export default function FirstLevel() {
  const rigidBodyRef = useRef(); //"Where the character IS physically in the game world"
  const visualRef = useRef(); // "What the player SEES and what the camera FOLLOWS"
  const controlsRef = useRef(); // Used to manipulate camera behavior Has methods/properties like .target, .update(), .enabled, .autoRotate

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        background: "#111",
        overflow: "hidden",
        margin: 0,
        padding: 0,
      }}
    >
      <Canvas shadows camera={{ position: [0, 5, 10], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[5, 10, 7]}
          intensity={0.1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-bias={-0.0001}
        />
        <pointLight position={[10, 10, 10]} intensity={0.5} />

        {/* Physics world provider */}
        <Physics gravity={[0, -9.81, 0]}>
          <CheckerboardFloor />
          <StreetLightWithCollision />
          <SphereController
            rigidBodyRef={rigidBodyRef}
            visualRef={visualRef}
            radius={BALL_CONFIG.radius}
            position={[0, 2, 0]}
          />
          <FallingBox position={[3, 5, 0]} />
          <FallingBox position={[-3, 7, 0]} />
        </Physics>
        <CameraController visualRef={visualRef} controlsRef={controlsRef} />
      </Canvas>
    </div>
  );
}

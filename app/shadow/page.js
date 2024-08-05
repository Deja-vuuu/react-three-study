"use client";
import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Center,
  Instance,
  Instances,
  SoftShadows,
  useScroll,
  Scroll,
  ScrollControls,
  PerspectiveCamera,
} from "@react-three/drei";
import { easing } from "maath";
import { Leaves } from "./models/Falling_leaves";
import { Flowers } from "./models/Assignment4_flowersfbx";
import styles from "./shaow.module.css";

export default function App() {
  return (
    <Canvas dpr={0.5} shadows className={styles.shadowCanvas}>
      <ambientLight intensity={Math.PI / 2} />
      <directionalLight
        castShadow
        position={[5, 5, 30]}
        intensity={1}
        shadow-mapSize={2048}
      >
        <orthographicCamera
          attach="shadow-camera"
          args={[-15, 15, 15, -15, 1, 50]}
        />
      </directionalLight>
      <ScrollControls prepend pages={2} damping={0.25}>
        <Scroll>
          <Cam />
        </Scroll>
        <Scroll html>
          <div
            style={{ position: "absolute", width: "100vw", height: "100vh" }}
          >
            <div className="absolute bottom-96">知否知否,</div>
            <div className="absolute bottom-96">应是绿肥红瘦。</div>
          </div>
        </Scroll>
        <Center rotation={[0, 0.5, 0]} position={[-10, 0, 20]}>
          <Blinds />
        </Center>
      </ScrollControls>
      <Leaves position={[0, -8, 10]} scale={40} />
      <Flowers position={[9, -0.5, 8]} rotation={[0, 0, 0.6]} scale={1.3} />
      <mesh
        receiveShadow
        scale={50}
        position={[0, 0, -0]}
        rotation={[0, 0.1, 0]}
      >
        <planeGeometry />
        <shadowMaterial transparent opacity={0.3} />
      </mesh>
      <SoftShadows size={15} focus={0} samples={32} />
    </Canvas>
  );
}

function Cam({ children }) {
  const ref = useRef();
  useFrame((state, delta) => {
    easing.damp3(
      ref.current.position,
      [state.pointer.x / 2, state.pointer.y / 2, 5],
      0.5,
      delta
    ); // Move camera
    ref.current.lookAt(0, 0, -100);
    ref.current.updateProjectionMatrix();
  });
  return (
    <PerspectiveCamera makeDefault ref={ref} position={[0, 0, 5]} fov={75}>
      {children}
    </PerspectiveCamera>
  );
}

function Blinds({ howmany = 50, ...props }) {
  const ref = useRef();
  const scroll = useScroll();
  useFrame((state) => {
    ref.current.children.forEach((child) => {
      child.rotation.x = 0.5 + scroll.offset / 1.5;
      child.rotation.z = -0.2;
      child.rotation.y = scroll.offset / 10;
    });
  });
  return (
    <Instances castShadow {...props}>
      <boxGeometry />
      <meshBasicMaterial />
      <group ref={ref}>
        {Array.from({ length: howmany }, (_, i) => (
          <Instance
            key={i}
            position={[0, i, 0]}
            scale={[100, 0.9, 0.01]}
            rotation={[0.5, 0, 0]}
          />
        ))}
      </group>
      <Instance position={[18, howmany / 2, 0]} scale={[0.2, howmany, 0.01]} />
    </Instances>
  );
}

"use client"

import { Canvas } from "@react-three/fiber"
import { OrbitControls, Stage, Environment, ContactShadows } from "@react-three/drei"
import { Suspense } from "react"
import DoorMesh from "./door-mesh"

interface DoorModel3DProps {
  config: any
}

export default function DoorModel3D({ config }: DoorModel3DProps) {
  return (
    <Canvas shadows camera={{ position: [0, 0, 5], fov: 45 }}>
      <Suspense fallback={null}>
        <Stage environment="city" intensity={0.6} contactShadow={false}>
          <DoorMesh config={config} />
        </Stage>
        <OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 1.75} />
        <Environment preset="city" />
        <ContactShadows
          opacity={0.4}
          scale={10}
          blur={2.4}
          far={0.8}
          position={[0, -1.5, 0]}
        />
      </Suspense>
    </Canvas>
  )
}

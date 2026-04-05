"use client"

import { useGLTF } from "@react-three/drei"
import { useEffect, useRef } from "react"
import * as THREE from "three"

interface DoorMeshProps {
  config: any
}

export default function DoorMesh({ config }: DoorMeshProps) {
  // Use a placeholder model or a simple box if the real model isn't available
  // In a real app, you'd load the specific model based on config.style
  const { scene } = useGLTF("/models/sample.glb")
  const meshRef = useRef<THREE.Group>(null)

  useEffect(() => {
    if (!scene) return

    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        // Apply colors/materials from config
        if (child.name.includes("frame")) {
          child.material.color.set(config.frameColor || "#000000")
        }
        if (child.name.includes("glass")) {
          child.material.color.set(config.glassColor || "#ffffff")
          child.material.transparent = true
          child.material.opacity = config.glassOpacity || 0.3
        }
      }
    })
  }, [scene, config])

  return <primitive object={scene} ref={meshRef} />
}

// Preload the sample model
useGLTF.preload("/models/sample.glb")

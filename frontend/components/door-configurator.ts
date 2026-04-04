// Door configuration types for 3D viewer

export interface DoorAddOns {
  smartLock?: boolean
  autoCloser?: boolean
  uvProtection?: boolean
  soundproof?: boolean
}

export interface DoorConfig {
  width: number // in mm
  height: number // in mm
  glassMaterial: "tempered" | "laminated" | "tinted"
  frameType: "aluminum" | "stainless-steel" | "wooden"
  addOns?: DoorAddOns
}

export interface DoorCustomization {
  width: number
  height: number
  material: string
  frame: string
  finish: string
  handle: string
  hinges: string
  glass_type: string
  tint: string
  features: string[]
}

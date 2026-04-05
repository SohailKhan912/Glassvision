"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import DoorModel3D from "./door-model-3d"

interface PreviewSectionProps {
  config: any
  onAddToCart?: () => void
}

export default function PreviewSection({ config, onAddToCart }: PreviewSectionProps) {
  return (
    <Card className="p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">3D Preview</h2>
        <Badge variant="secondary">Interactive View</Badge>
      </div>
      
      <div className="flex-grow bg-muted/30 rounded-lg overflow-hidden min-h-[400px] relative">
        <DoorModel3D config={config} />
      </div>

      <div className="mt-6 flex flex-col gap-4">
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Estimated Delivery</span>
          <span className="font-medium">10-14 Business Days</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Material Warranty</span>
          <span className="font-medium">5 Years</span>
        </div>
        {onAddToCart && (
          <Button onClick={onAddToCart} className="w-full mt-2">
            Add to Cart
          </Button>
        )}
      </div>
    </Card>
  )
}

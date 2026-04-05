"use client"

import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"

const categories = ["Pivot", "Sliding", "Framed", "Frameless", "Specialty"]
const glassTypes = ["Clear", "Frosted", "Textured", "Tinted"]
const frameFinishes = ["Black", "Silver", "Gold", "Bronze", "White"]

export default function CatalogFilters() {
  return (
    <div className="space-y-8 p-6 border rounded-2xl bg-background">
      <div>
        <h3 className="text-lg font-bold mb-4">Categories</h3>
        <div className="space-y-3">
          {categories.map((cat) => (
            <div key={cat} className="flex items-center space-x-2">
              <Checkbox id={`cat-${cat}`} />
              <Label htmlFor={`cat-${cat}`} className="text-sm font-medium leading-none cursor-pointer">
                {cat}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-bold mb-4">Price Range</h3>
        <Slider defaultValue={[20000]} max={200000} step={5000} className="mb-4" />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>₹20k</span>
          <span>₹200k+</span>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-bold mb-4">Glass Type</h3>
        <div className="space-y-3">
          {glassTypes.map((type) => (
            <div key={type} className="flex items-center space-x-2">
              <Checkbox id={`glass-${type}`} />
              <Label htmlFor={`glass-${type}`} className="text-sm font-medium leading-none cursor-pointer">
                {type}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-bold mb-4">Frame Finish</h3>
        <div className="space-y-3">
          {frameFinishes.map((finish) => (
            <div key={finish} className="flex items-center space-x-2">
              <Checkbox id={`finish-${finish}`} />
              <Label htmlFor={`finish-${finish}`} className="text-sm font-medium leading-none cursor-pointer">
                {finish}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

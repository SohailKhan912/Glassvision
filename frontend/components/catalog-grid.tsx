"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const products = [
  {
    id: "1",
    name: "Classic Pivot Door",
    category: "Pivot",
    price: 45000,
    image: "/products/pivot-1.jpg",
    badge: "Bestseller"
  },
  {
    id: "2",
    name: "Frameless Sliding System",
    category: "Sliding",
    price: 65000,
    image: "/products/sliding-1.jpg",
    badge: "New"
  },
  {
    id: "3",
    name: "Industrial Steel Frame",
    category: "Framed",
    price: 55000,
    image: "/products/framed-1.jpg"
  },
  {
    id: "4",
    name: "Textured Privacy Door",
    category: "Specialty",
    price: 48000,
    image: "/products/specialty-1.jpg"
  },
  {
    id: "5",
    name: "Minimalist Entryway",
    category: "Frameless",
    price: 75000,
    image: "/products/frameless-1.jpg",
    badge: "Premium"
  },
  {
    id: "6",
    name: "Bi-Fold Patio Door",
    category: "Sliding",
    price: 120000,
    image: "/products/sliding-2.jpg"
  }
]

export default function CatalogGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <Card key={product.id} className="overflow-hidden group">
          <Link href={`/products/${product.id}`}>
            <div className="relative aspect-[4/5] bg-muted">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
              {product.badge && (
                <Badge className="absolute top-4 left-4 z-10">{product.badge}</Badge>
              )}
            </div>
          </Link>
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground mb-2 uppercase tracking-wider">
              {product.category}
            </div>
            <h3 className="font-bold text-lg mb-2">{product.name}</h3>
            <div className="text-primary font-bold">₹{product.price.toLocaleString()}</div>
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <Button variant="outline" className="w-full" asChild>
              <Link href={`/customize/${product.id}`}>Customize</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

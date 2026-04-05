import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-muted py-12 border-t">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-bold">GlassVision</h3>
            <p className="text-sm text-muted-foreground">
              Premium glass doors for modern homes and offices. 
              Designed with precision, built for elegance.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/catalog" className="hover:underline">All Products</Link></li>
              <li><Link href="/catalog?category=frameless" className="hover:underline">Frameless Doors</Link></li>
              <li><Link href="/catalog?category=sliding" className="hover:underline">Sliding Doors</Link></li>
              <li><Link href="/catalog?category=pivot" className="hover:underline">Pivot Doors</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/contact" className="hover:underline">Contact Us</Link></li>
              <li><Link href="/shipping" className="hover:underline">Shipping Info</Link></li>
              <li><Link href="/refund-policy" className="hover:underline">Refund Policy</Link></li>
              <li><Link href="/terms-conditions" className="hover:underline">Terms of Service</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Connect</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:underline">Instagram</a></li>
              <li><a href="#" className="hover:underline">Facebook</a></li>
              <li><a href="#" className="hover:underline">LinkedIn</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} GlassVision. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

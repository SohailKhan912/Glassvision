import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function CTASection() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="bg-muted rounded-[3rem] p-12 md:p-24 text-center overflow-hidden relative">
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-8">
              Ready to transform your space?
            </h2>
            <p className="text-xl text-muted-foreground mb-12">
              Join thousands of satisfied customers and design your dream glass door today.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Button size="lg" asChild className="px-12 h-14 text-lg">
                <Link href="/customize">Get Started Now</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="px-12 h-14 text-lg">
                <Link href="/contact">Talk to an Expert</Link>
              </Button>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        </div>
      </div>
    </section>
  )
}

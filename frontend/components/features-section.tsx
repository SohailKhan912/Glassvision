import { Shield, Sparkles, Truck, Ruler } from "lucide-react"

const features = [
  {
    icon: <Shield className="w-10 h-10 text-primary" />,
    title: "Premium Quality",
    description: "Our doors are made from the highest grade tempered glass and reinforced frames."
  },
  {
    icon: <Sparkles className="w-10 h-10 text-primary" />,
    title: "Custom Design",
    description: "Personalize every detail from glass tint to handle styles and frame finishes."
  },
  {
    icon: <Ruler className="w-10 h-10 text-primary" />,
    title: "Perfect Fit",
    description: "Expert measurement services to ensure your door fits perfectly every time."
  },
  {
    icon: <Truck className="w-10 h-10 text-primary" />,
    title: "Global Delivery",
    description: "Secure, insured shipping to your doorstep, anywhere in the world."
  }
]

export default function FeaturesSection() {
  return (
    <section className="py-24 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Why Choose GlassVision?</h2>
          <p className="text-muted-foreground text-lg">Unmatched quality and service for your dream space.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-background p-8 rounded-2xl border hover:shadow-xl transition-all">
              <div className="mb-6">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

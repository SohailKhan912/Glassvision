import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Interior Designer",
    content: "The 3D customization tool made it so easy to visualize the final look. The quality of the glass is exceptional.",
    rating: 5
  },
  {
    name: "Michael Chen",
    role: "Homeowner",
    content: "Professional installation and beautiful design. Our new sliding doors have completely transformed our living room.",
    rating: 5
  },
  {
    name: "Emma Davis",
    role: "Architect",
    content: "GlassVision is my go-to for all commercial projects. Their attention to detail and technical support is unmatched.",
    rating: 5
  }
]

export default function TestimonialsSection() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">What Our Clients Say</h2>
          <p className="text-muted-foreground text-lg">Real stories from real customers.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-background p-8 rounded-2xl border flex flex-col justify-between h-full">
              <div>
                <div className="flex gap-1 mb-6 text-yellow-500">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <p className="text-lg mb-8 italic">"{testimonial.content}"</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <div className="font-bold">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

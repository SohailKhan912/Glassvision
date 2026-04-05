import { Award, CheckCircle, Clock, Users } from "lucide-react"

const stats = [
  { icon: <Users className="w-8 h-8" />, label: "Happy Customers", value: "10,000+" },
  { icon: <Award className="w-8 h-8" />, label: "Years Experience", value: "15+" },
  { icon: <CheckCircle className="w-8 h-8" />, label: "Projects Completed", value: "25,000+" },
  { icon: <Clock className="w-8 h-8" />, label: "Warranty Support", value: "24/7" }
]

export default function TrustSection() {
  return (
    <section className="py-24 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          {stats.map((stat, index) => (
            <div key={index} className="space-y-4">
              <div className="flex justify-center">{stat.icon}</div>
              <div className="text-4xl font-bold">{stat.value}</div>
              <div className="text-primary-foreground/80 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

import Image from "next/image"

const galleryItems = [
  { src: "/gallery/1.jpg", alt: "Modern Office Pivot Door" },
  { src: "/gallery/2.jpg", alt: "Luxury Home Sliding Door" },
  { src: "/gallery/3.jpg", alt: "Industrial Steel Frame Door" },
  { src: "/gallery/4.jpg", alt: "Minimalist Frameless Entrance" },
  { src: "/gallery/5.jpg", alt: "Textured Glass Privacy Screen" },
  { src: "/gallery/6.jpg", alt: "Bi-fold Terrace Glass Door" }
]

export default function GallerySection() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Design Inspiration</h2>
          <p className="text-muted-foreground text-lg">Explore our most popular installations and get inspired.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryItems.map((item, index) => (
            <div key={index} className="group relative overflow-hidden rounded-2xl aspect-[4/5] bg-muted">
              <Image
                src={item.src}
                alt={item.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
                <p className="text-white font-medium text-lg">{item.alt}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

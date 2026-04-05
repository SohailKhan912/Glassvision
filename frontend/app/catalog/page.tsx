import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import CatalogGrid from "@/components/catalog-grid"
import CatalogFilters from "@/components/catalog-filters"

export default function CatalogPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <main className="flex-grow container mx-auto px-4 py-8 mt-16">
        <h1 className="text-4xl font-bold mb-8">Our Collection</h1>
        <div className="flex flex-col md:flex-row gap-8">
          <aside className="w-full md:w-64">
            <CatalogFilters />
          </aside>
          <div className="flex-grow">
            <CatalogGrid />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

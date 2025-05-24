// app/products/page.tsx
import { ProductFilters } from "@/components/products/ProductFilters"
import { ProductCard } from "@/components/products/ProductCard"
import { CategoryFilter } from "@/components/products/CategoryFilter"
import { IProduct } from "@/types/product"
import { ViewMoreButton } from "@/components/products/ViewMoreButton"
import { Button } from "@/components/ui/button"
import { Filter } from "lucide-react"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import { Suspense } from "react"

const DEFAULT_PAGE_SIZE = 12

interface ProductsResponse {
  products: IProduct[]
  totalCount: number
}

async function getProducts(searchParams: { [key: string]: string | string[] | undefined }): Promise<ProductsResponse> {
  const currentPage = Number(searchParams._page) || 1
  const pageSize = Number(searchParams._limit) || DEFAULT_PAGE_SIZE
  const allProducts: IProduct[] = []
  let totalCount = 0

  // Fetch products from page 1 to current page
  for (let page = 1; page <= currentPage; page++) {
    // Build query string from searchParams
    const queryParams = new URLSearchParams()
    
    // Handle search query
    if (searchParams.q) {
      queryParams.append('q', searchParams.q as string)
    }
    
    // Handle price filter
    if (searchParams.price_lte) {
      queryParams.append('price_lte', searchParams.price_lte as string)
    }

    // Handle tier filter
    if (searchParams.tier) {
      queryParams.append('tier', searchParams.tier as string)
    }

    // Handle theme filter
    if (searchParams.theme) {
      queryParams.append('theme', searchParams.theme as string)
    }

    // Handle category filter
    if (searchParams.category) {
      queryParams.append('category', searchParams.category as string)
    }
    
    // Handle sorting
    if (searchParams._sort) {
      queryParams.append('_sort', searchParams._sort as string)
      queryParams.append('_order', (searchParams._order as string) || 'asc')
    }
    
    // Set pagination parameters for current iteration
    queryParams.append('_page', page.toString())
    queryParams.append('_limit', pageSize.toString())

    // Fetch products from API
    const response = await fetch(`http://localhost:5005/products?${queryParams.toString()}`, {
      cache: 'no-store' // Disable caching to ensure fresh results
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch products')
    }

    const pageProducts = await response.json()
    allProducts.push(...pageProducts)

    // Get total count from headers on first page
    if (page === 1) {
      totalCount = parseInt(response.headers.get('X-Total-Count') || '0', 10)
    }
  }

  return { products: allProducts, totalCount }
}

function ProductsLoading() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full mt-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="animate-pulse">
          <div className="bg-gray-200 rounded-lg aspect-square mb-4" />
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
}

async function ProductsContent({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const { products, totalCount } = await getProducts(searchParams)
  const currentPage = Number(searchParams._page) || 1
  const productsPerPage = Number(searchParams._limit) || 16
  const totalPages = Math.ceil(totalCount / productsPerPage)

  return (
    <div className="py-8 space-y-10">
      {/* Categories Row */}
      <CategoryFilter />

      {/* Main Section */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Mobile Filter Button */}
        <div className="lg:hidden">
          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="outline" className="w-full">
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Filters</DrawerTitle>
              </DrawerHeader>
              <div className="px-4">
                <ProductFilters />
              </div>
            </DrawerContent>
          </Drawer>
        </div>

        {/* Desktop Filters Sidebar */}
        <div className="hidden lg:block w-64 shrink-0">
          <ProductFilters />
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      {/* Page Info and View More */}
      <div className="flex flex-col items-center gap-4">
        <div className="text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </div>
        {currentPage < totalPages && <ViewMoreButton currentPage={currentPage} />}
      </div>
    </div>
  )
}

export default function ProductsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  return (
    <Suspense fallback={<ProductsLoading />}>
      <ProductsContent searchParams={searchParams} />
    </Suspense>
  )
}

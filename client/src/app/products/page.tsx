import { ProductFilters } from "@/components/products/ProductFilters"
import  ProductCard  from "@/components/products/ProductCard"
import { CategoryFilter } from "@/components/products/CategoryFilter"
import { IProduct } from "@/types/product"
import { ViewMoreButton } from "@/components/products/ViewMoreButton"
import { Pagination } from "@/components/products/Pagination"
import { TopNavigation } from "@/components/products/TopNavigation"
import { Button } from "@/components/ui/button"
import { Filter } from "lucide-react"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import { Suspense } from "react"
import { API_BASE_URL, DEFAULT_PAGE_SIZE, PAGINATION_THRESHOLD, QUERY_PARAMS } from "@/constants"

interface ProductsResponse {
  products: IProduct[]
  totalCount: number
}

async function getProducts(searchParams: { [key: string]: string | string[] | undefined }): Promise<ProductsResponse> {
  const currentPage = Number(searchParams[QUERY_PARAMS.PAGE]) || 1
  const pageSize = Number(searchParams[QUERY_PARAMS.LIMIT]) || DEFAULT_PAGE_SIZE
  const allProducts: IProduct[] = []
  let totalCount = 0

  const buildQueryParams = (page: number) => {
    const queryParams = new URLSearchParams()
    
    // Add all filter parameters
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value && key !== QUERY_PARAMS.PAGE && key !== QUERY_PARAMS.LIMIT) {
        queryParams.append(key, value as string)
      }
    })

    // Set pagination parameters
    queryParams.append(QUERY_PARAMS.PAGE, page.toString())
    queryParams.append(QUERY_PARAMS.LIMIT, pageSize.toString())

    return queryParams
  }

  const handleFetchError = async (response: Response) => {
    if (response.status === 404) {
      throw new Error('Products not found. Please check your search parameters.')
    }
    if (response.status === 400) {
      throw new Error('Invalid request parameters. Please check your filters.')
    }
    if (response.status >= 500) {
      throw new Error('Server error. Please try again later.')
    }
    throw new Error(`Failed to fetch products: ${response.statusText}`)
  }

  // If using pagination (currentPage >= PAGINATION_THRESHOLD), only fetch the current page
  if (currentPage >= PAGINATION_THRESHOLD) {
    const queryParams = buildQueryParams(currentPage)
    const response = await fetch(`${API_BASE_URL}/products?${queryParams.toString()}`, {
      cache: 'no-store'
    })

    if (!response.ok) {
      await handleFetchError(response)
    }

    const pageProducts = await response.json()
    allProducts.push(...pageProducts)
    totalCount = parseInt(response.headers.get('X-Total-Count') || '0', 10)
  } else {
    // Fetch products from page 1 to current page (load more approach)
    for (let page = 1; page <= currentPage; page++) {
      const queryParams = buildQueryParams(page)
      const response = await fetch(`${API_BASE_URL}/products?${queryParams.toString()}`, {
        cache: 'no-store'
      })

      if (!response.ok) {
        await handleFetchError(response)
      }

      const pageProducts = await response.json()
      allProducts.push(...pageProducts)

      // Get total count from headers on first page
      if (page === 1) {
        totalCount = parseInt(response.headers.get('X-Total-Count') || '0', 10)
      }
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
  let products: IProduct[] = []
  let totalCount = 0
  let error: string | null = null

  try {
    const result = await getProducts(searchParams)
    products = result.products
    totalCount = result.totalCount
  } catch (err) {
    error = err instanceof Error ? err.message : 'An unexpected error occurred'
  }

  const currentPage = Number(searchParams[QUERY_PARAMS.PAGE]) || 1
  const productsPerPage = Number(searchParams[QUERY_PARAMS.LIMIT]) || DEFAULT_PAGE_SIZE
  const totalPages = Math.ceil(totalCount / productsPerPage)

  return (
    <div className="py-8 space-y-10 relative">
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
                {searchParams.q || searchParams.tier || searchParams.theme || searchParams.price_lte ? (
                  <span className="ml-2 text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                    {[
                      searchParams.q && "Search",
                      searchParams.tier && "Tier",
                      searchParams.theme && "Theme",
                      searchParams.price_lte && "Price"
                    ].filter(Boolean).length}
                  </span>
                ) : null}
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Filters</DrawerTitle>
              </DrawerHeader>
              <div className="px-4 mt-6">
                <ProductFilters />
              </div>
            </DrawerContent>
          </Drawer>
        </div>

        {/* Desktop Filters Sidebar */}
        <div className="hidden lg:block w-64 shrink-0">
          <ProductFilters />
        </div>

        <div className="w-full">
          {/* Top Navigation */}
          {currentPage >= PAGINATION_THRESHOLD && (
            <TopNavigation currentPage={currentPage} totalPages={totalPages} />
          )}

          {/* Error Message */}
          {error && (
            <div className="flex-1 w-full mt-16">
              <p className="text-lg text-red-600 text-center w-full">{error}</p>
            </div>
          )}

          {/* Products Grid */}
          {!error && products.length === 0 ? (
            <div className="flex-1 w-full mt-16">
              <p className="text-lg text-gray-600 text-center w-full">No products found</p>
            </div>
          ) : !error && (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* Page Info and Navigation */}
          {!error && (
            <div className="flex flex-col items-center gap-4 mt-12">
              {currentPage < PAGINATION_THRESHOLD ? (
                currentPage < totalPages && <>
                  <div className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </div>
                  <ViewMoreButton currentPage={currentPage} />
                </>
              ) : (
                <Pagination currentPage={currentPage} totalPages={totalPages} />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function ProductsPage({
  searchParams,
}: Props) {
  const resolvedSearchParams = await searchParams
  return (
    <Suspense fallback={<ProductsLoading />}>
      <ProductsContent searchParams={resolvedSearchParams} />
    </Suspense>
  )
}
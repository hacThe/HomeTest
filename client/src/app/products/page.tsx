import { ProductFilters } from "@/components/products/ProductFilters"
import ProductCard from "@/components/products/ProductCard"
import { CategoryFilter } from "@/components/products/CategoryFilter"
import { IProduct } from "@/types/product"
import { ViewMoreButton } from "@/components/products/ViewMoreButton"
import { Pagination } from "@/components/products/Pagination"
import { TopNavigation } from "@/components/products/TopNavigation"
import { Button } from "@/components/ui/button"
import { Filter } from "lucide-react"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import { Suspense } from "react"
import { DEFAULT_PAGE_SIZE, PAGINATION_THRESHOLD, QUERY_PARAMS } from "@/constants"
import { Card } from "@/components/ui/card"
import { getProductsWithNewArrivals, SearchParams } from "@/lib/products.service"
import { MinimalProductCard } from "@/components/products/MinimalProductCard"

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
  searchParams: SearchParams
}) {
  const { products, totalCount, newArrivals, error } = await getProductsWithNewArrivals(searchParams)

  const currentPage = Number(searchParams[QUERY_PARAMS.PAGE]) || 1
  const productsPerPage = Number(searchParams[QUERY_PARAMS.LIMIT]) || DEFAULT_PAGE_SIZE
  const totalPages = Math.ceil(totalCount / productsPerPage)

  return (
    <div className="py-8 space-y-10 relative">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">New Arrivals</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {newArrivals.map((product) => (
            <MinimalProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      <CategoryFilter />

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:hidden">
          <Drawer modal>
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
            <DrawerContent className="z-[100]">
              <DrawerHeader>
                <DrawerTitle>Filters</DrawerTitle>
              </DrawerHeader>
              <div className="px-4 mt-6">
                <ProductFilters />
              </div>
            </DrawerContent>
          </Drawer>
        </div>

        <div className="hidden lg:block w-64 shrink-0">
          <h2 className="text-2xl font-bold mb-2">Products</h2>
          <ProductFilters />
        </div>

        <div className="w-full">
          {currentPage >= PAGINATION_THRESHOLD && (
            <TopNavigation currentPage={currentPage} totalPages={totalPages} />
          )}

          {error && (
            <div className="flex-1 w-full mt-16">
              <p className="text-lg text-red-600 text-center w-full">{error}</p>
            </div>
          )}

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
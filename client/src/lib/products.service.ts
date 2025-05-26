import { IProduct } from "@/types/product"
import { API_BASE_URL, DEFAULT_PAGE_SIZE, PAGINATION_THRESHOLD, QUERY_PARAMS } from "@/constants"

export interface ProductsResponse {
  products: IProduct[]
  totalCount: number
}

export interface SearchParams {
  [key: string]: string | string[] | undefined
}


export async function getRandomProducts(count: number = 4): Promise<IProduct[]> {
  const response = await fetch(`${API_BASE_URL}/products?_limit=${count}&tier=Deluxe`, {
    cache: 'no-store'
  })

  if (!response.ok) {
    throw new Error('Failed to fetch random products')
  }

  return response.json()
}

export async function updateProductFavorite(productId: number, isFavorite: boolean): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      isFavorite
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to update favorite status')
  }
}

function buildQueryParams(searchParams: SearchParams, page: number, pageSize: number): URLSearchParams {
  const queryParams = new URLSearchParams()

  // Add all filter parameters
  Object.entries(searchParams).forEach(([key, value]) => {
    if (value && key !== QUERY_PARAMS.PAGE && key !== QUERY_PARAMS.LIMIT) {
      queryParams.append(key, value as string)
    }
  })

  // Set pagination parameters
  queryParams.append(QUERY_PARAMS.PAGE, page.toString())
  if (page >= PAGINATION_THRESHOLD) {
    queryParams.append(QUERY_PARAMS.LIMIT, pageSize.toString())
  }
  return queryParams
}

async function handleFetchError(response: Response): Promise<never> {
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


export async function getProducts(searchParams: SearchParams): Promise<ProductsResponse> {
  const currentPage = Number(searchParams[QUERY_PARAMS.PAGE]) || 1
  const pageSize = Number(searchParams[QUERY_PARAMS.LIMIT]) || DEFAULT_PAGE_SIZE
  const allProducts: IProduct[] = []
  let totalCount = 0

  // If using pagination (currentPage >= PAGINATION_THRESHOLD), only fetch the current page
  if (currentPage >= PAGINATION_THRESHOLD) {
    const queryParams = buildQueryParams(searchParams, currentPage, pageSize)
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
    // Fetch all products up to current page in a single request
    const queryParams = buildQueryParams(searchParams, 1, pageSize)
    queryParams.set(QUERY_PARAMS.LIMIT, (currentPage * pageSize).toString())
    
    const response = await fetch(`${API_BASE_URL}/products?${queryParams.toString()}`, {
      cache: 'no-store'
    })

    if (!response.ok) {
      await handleFetchError(response)
    }

    const pageProducts = await response.json()
    allProducts.push(...pageProducts)
    totalCount = parseInt(response.headers.get('X-Total-Count') || '0', 10)
  }

  return { products: allProducts, totalCount }
}

export async function getProductsWithNewArrivals(searchParams: SearchParams) {
  try {
    const [productsResult, newArrivals] = await Promise.all([
      getProducts(searchParams),
      getRandomProducts(4)
    ])

    return {
      products: productsResult.products,
      totalCount: productsResult.totalCount,
      newArrivals,
      error: null
    }
  } catch (err) {
    return {
      products: [],
      totalCount: 0,
      newArrivals: [],
      error: err instanceof Error ? err.message : 'An unexpected error occurred'
    }
  }
} 
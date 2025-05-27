import { buildQueryParams, getProducts, updateProductFavorite, type SearchParams } from '../products.service'
import { QUERY_PARAMS, PAGINATION_THRESHOLD } from '@/constants'

// Mock fetch globally
const globalAny: any = global

describe('buildQueryParams', () => {
  it('should build query params with filters and pagination', () => {
    const searchParams: SearchParams = {
      category: 'books',
      [QUERY_PARAMS.PAGE]: '2',
      [QUERY_PARAMS.LIMIT]: '10',
    }
    const page = 2
    const pageSize = 10
    const params = buildQueryParams(searchParams, page, pageSize)
    expect(params.get('category')).toBe('books')
    expect(params.get(QUERY_PARAMS.PAGE)).toBe('2')
    // Should not include limit if page < PAGINATION_THRESHOLD
    expect(params.get(QUERY_PARAMS.LIMIT)).toBeNull()
  })

  it('should include limit if page >= PAGINATION_THRESHOLD', () => {
    const searchParams: SearchParams = {
      category: 'books',
      [QUERY_PARAMS.PAGE]: '5',
      [QUERY_PARAMS.LIMIT]: '10',
    }
    const page = 5
    const pageSize = 10
    const params = buildQueryParams(searchParams, page, pageSize)
    expect(params.get('category')).toBe('books')
    expect(params.get(QUERY_PARAMS.PAGE)).toBe('5')
    expect(params.get(QUERY_PARAMS.LIMIT)).toBe('10')
  })
})

describe('getProducts', () => {
  beforeEach(() => {
    globalAny.fetch = jest.fn()
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('fetches products with correct query params (page >= threshold)', async () => {
    const mockProducts = [{ id: 1, name: 'Product 1' }]
    const mockHeaders = { get: () => '1' }
    globalAny.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockProducts,
      headers: mockHeaders,
    })
    const searchParams: SearchParams = {
      [QUERY_PARAMS.PAGE]: PAGINATION_THRESHOLD.toString(),
      [QUERY_PARAMS.LIMIT]: '10',
    }
    const result = await getProducts(searchParams)
    expect(globalAny.fetch).toHaveBeenCalled()
    expect(result.products).toEqual(mockProducts)
    expect(result.totalCount).toBe(1)
  })

  it('fetches products with correct query params (page < threshold)', async () => {
    const mockProducts = [{ id: 1, name: 'Product 1' }]
    const mockHeaders = { get: () => '1' }
    globalAny.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockProducts,
      headers: mockHeaders,
    })
    const searchParams: SearchParams = {
      [QUERY_PARAMS.PAGE]: '1',
      [QUERY_PARAMS.LIMIT]: '10',
    }
    const result = await getProducts(searchParams)
    expect(globalAny.fetch).toHaveBeenCalled()
    expect(result.products).toEqual(mockProducts)
    expect(result.totalCount).toBe(1)
  })

  it('throws error if fetch fails', async () => {
    globalAny.fetch.mockResolvedValueOnce({ ok: false, status: 404, statusText: 'Not Found', headers: { get: () => null } })
    const searchParams: SearchParams = {
      [QUERY_PARAMS.PAGE]: '1',
      [QUERY_PARAMS.LIMIT]: '10',
    }
    await expect(getProducts(searchParams)).rejects.toThrow('Products not found')
  })
})

describe('updateProductFavorite', () => {
  beforeEach(() => {
    globalAny.fetch = jest.fn()
  })
  afterEach(() => {
    jest.resetAllMocks()
  })
  it('calls fetch with PATCH and correct body', async () => {
    globalAny.fetch.mockResolvedValueOnce({ ok: true })
    await updateProductFavorite(123, true)
    expect(globalAny.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/products/123'),
      expect.objectContaining({
        method: 'PATCH',
        body: JSON.stringify({ isFavorite: true })
      })
    )
  })
  it('throws error if fetch fails', async () => {
    globalAny.fetch.mockResolvedValueOnce({ ok: false })
    await expect(updateProductFavorite(123, false)).rejects.toThrow('Failed to update favorite status')
  })
}) 
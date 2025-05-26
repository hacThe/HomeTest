export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5005'

export const PRODUCT_THEMES = ['Dark', 'Light', 'Colorful', 'Halloween'] as const
export const PRODUCT_TIERS = ['Basic', 'Premium', 'Deluxe'] as const
export const PRODUCT_CATEGORIES = [
  'Upper Body',
  'Lower Body',
  'Hat',
  'Shoes',
  'Accessory',
  'Legendary',
  'Mythic',
  'Epic',
  'Rare'
] as const

export const DEFAULT_PAGE_SIZE = 12
export const PAGINATION_THRESHOLD = 4

export const STATUS_COLORS = {
  online: 'text-green-400',
  offline: 'text-gray-400',
  away: 'text-yellow-500',
  busy: 'text-red-500'
} as const

export const SORT_OPTIONS = {
  PRICE_ASC: 'asc',
  PRICE_DESC: 'desc'
} as const

export const QUERY_PARAMS = {
  SEARCH: 'q',
  PRICE: 'price_lte',
  TIER: 'tier',
  THEME: 'theme',
  CATEGORY: 'category',
  ORDER: '_order',
  PAGE: '_page',
  LIMIT: '_limit'
} as const 
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ProductFilters } from '../ProductFilters'

jest.mock('@/constants', () => ({
  PRODUCT_THEMES: ['Dark', 'Light'],
  PRODUCT_TIERS: ['Basic', 'Premium'],
  QUERY_PARAMS: { SEARCH: 'search', TIER: 'tier', THEME: 'theme', PRICE: 'price', PAGE: 'page' },
}))

describe('ProductFilters', () => {
  it('renders search, tier, theme, and price controls', () => {
    render(<ProductFilters />)
    expect(screen.getByPlaceholderText('Search')).toBeInTheDocument()
    expect(screen.getByText('Tier')).toBeInTheDocument()
    expect(screen.getByText('Theme')).toBeInTheDocument()
    expect(screen.getByText('Price')).toBeInTheDocument()
    // There are 3 selects: Tier, Theme, Price
    expect(screen.getAllByRole('combobox').length).toBe(3)
    expect(screen.getByText('Reset Filter')).toBeInTheDocument()
  })
}) 
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { CategoryFilter } from '../CategoryFilter'

jest.mock('@/constants', () => ({
  PRODUCT_CATEGORIES: ['Upper Body', 'Lower Body', 'Hat'],
  QUERY_PARAMS: { CATEGORY: 'category', PAGE: 'page' },
}))

describe('CategoryFilter', () => {
  it('renders all category buttons', () => {
    render(<CategoryFilter />)
    expect(screen.getByText('Upper Body')).toBeInTheDocument()
    expect(screen.getByText('Lower Body')).toBeInTheDocument()
    expect(screen.getByText('Hat')).toBeInTheDocument()
  })
}) 
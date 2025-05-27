import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { MinimalProductCard } from '../MinimalProductCard'
import { IProduct } from '@/types/product'

const mockProduct: IProduct = {
  id: 2,
  title: 'Minimal Product',
  price: 1.25,
  category: 'Hat',
  theme: 'Light',
  tier: 'Premium',
  imageId: 7,
  isFavorite: false,
  createdAt: Date.now(),
  author: {
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane@example.com',
    avatar: '/avatar2.jpg',
    onlineStatus: 'offline',
    gender: 'female'
  }
}

describe('MinimalProductCard', () => {
  it('renders product title, price, and image', () => {
    render(<MinimalProductCard product={mockProduct} />)
    expect(screen.getByText('Minimal Product')).toBeInTheDocument()
    expect(screen.getByText('1.25 ETH')).toBeInTheDocument()
    const image = screen.getByAltText('Minimal Product')
    expect(image).toHaveAttribute('src', '/images/mario-7.avif')
  })
}) 
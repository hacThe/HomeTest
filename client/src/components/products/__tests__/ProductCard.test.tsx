import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import ProductCard from '../ProductCard'
import { IProduct } from '@/types/product'
import { updateProductFavorite } from '@/lib/products.service'

// Mock the products service
jest.mock('@/lib/products.service', () => ({
  updateProductFavorite: jest.fn()
}))

const mockProduct: IProduct = {
  id: 1,
  title: 'Test Product',
  price: 0.5,
  category: 'Upper Body',
  theme: 'Dark',
  tier: 'Basic',
  imageId: 1,
  isFavorite: false,
  createdAt: Date.now(),
  author: {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    avatar: '/avatar.jpg',
    onlineStatus: 'online',
    gender: 'male'
  }
}

describe('ProductCard', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders product information correctly', () => {
    render(<ProductCard product={mockProduct} />)
    
    // Check if product title is rendered
    expect(screen.getByText('Test Product')).toBeInTheDocument()
    
    // Check if price is rendered
    expect(screen.getByText('0.5 ETH')).toBeInTheDocument()
    
    // Check if category is rendered
    expect(screen.getByText('Category: Upper Body')).toBeInTheDocument()
    
    // Check if theme is rendered
    expect(screen.getByText('Theme: Dark')).toBeInTheDocument()
    
    // Check if tier is rendered
    expect(screen.getByText('Tier: Basic')).toBeInTheDocument()
  })

  it('renders author information correctly', () => {
    render(<ProductCard product={mockProduct} />)
    
    // Check if author name is rendered
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    
    // Check if author avatar is rendered
    const avatar = screen.getByAltText('John Doe')
    expect(avatar).toBeInTheDocument()
    expect(avatar).toHaveAttribute('src', '/avatar.jpg')
  })

  it('renders favorite button and handles click', async () => {
    render(<ProductCard product={mockProduct} />)
    
    // Find the heart icon
    const heartIcon = screen.getByLabelText('favorite')
    expect(heartIcon).toBeInTheDocument()
    
    // Click the heart icon
    fireEvent.click(heartIcon)
    
    // Verify that updateProductFavorite was called with correct parameters
    expect(updateProductFavorite).toHaveBeenCalledWith(mockProduct.id, true)
  })

  it('renders product image with correct attributes', () => {
    render(<ProductCard product={mockProduct} />)
    
    const image = screen.getByAltText('Test Product')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', '/images/mario-1.avif')
    expect(image).toHaveClass('object-cover', 'w-full', 'h-full', 'grayscale-[1]')
  })
}) 
import { render, screen, fireEvent, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import { FavoriteButton } from '../FavoriteButton'
import { updateProductFavorite } from '@/lib/products.service'

jest.mock('@/lib/products.service', () => ({
  updateProductFavorite: jest.fn().mockResolvedValue(undefined)
}))

describe('FavoriteButton', () => {
  it('renders the heart icon', () => {
    render(<FavoriteButton productId={1} initialIsFavorite={false} />)
    expect(screen.getByLabelText('favorite')).toBeInTheDocument()
  })

  it('toggles favorite state and calls updateProductFavorite', async () => {
    render(<FavoriteButton productId={42} initialIsFavorite={false} />)
    const heart = screen.getByLabelText('favorite')
    await act(async () => {
      fireEvent.click(heart)
    })
    expect(updateProductFavorite).toHaveBeenCalledWith(42, true)
  })
}) 
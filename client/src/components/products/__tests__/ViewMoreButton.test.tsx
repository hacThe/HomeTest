import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ViewMoreButton } from '../ViewMoreButton'

describe('ViewMoreButton', () => {
  it('renders the View More button', () => {
    render(<ViewMoreButton currentPage={1} />)
    expect(screen.getByText('View More')).toBeInTheDocument()
  })
}) 
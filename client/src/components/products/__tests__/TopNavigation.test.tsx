import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { TopNavigation } from '../TopNavigation'

describe('TopNavigation', () => {
  it('renders current and total pages', () => {
    render(<TopNavigation currentPage={2} totalPages={5} />)
    expect(screen.getByText('Page 2 of 5')).toBeInTheDocument()
    expect(screen.getByText('Previous')).toBeInTheDocument()
    expect(screen.getByText('Next')).toBeInTheDocument()
  })
}) 
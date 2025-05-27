import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Pagination } from '../Pagination'

describe('Pagination', () => {
  it('renders page numbers and navigation buttons', () => {
    render(<Pagination currentPage={2} totalPages={5} />)
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.getByText('Previous')).toBeInTheDocument()
    expect(screen.getByText('Next')).toBeInTheDocument()
  })
}) 
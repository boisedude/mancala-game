import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import HomePage from '../pages/HomePage'

const renderWithRouter = (ui: React.ReactElement) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>)
}

describe('HomePage', () => {
  it('renders the heading', () => {
    renderWithRouter(<HomePage />)
    const heading = screen.getByRole('heading', {
      name: /React \+ TypeScript \+ shadcn\/ui/i,
    })
    expect(heading).toBeInTheDocument()
  })

  it('increments count when button is clicked', () => {
    renderWithRouter(<HomePage />)
    const button = screen.getByRole('button', { name: /count is 0/i })

    fireEvent.click(button)

    expect(screen.getByRole('button', { name: /count is 1/i })).toBeInTheDocument()
  })

  it('displays link to about page', () => {
    renderWithRouter(<HomePage />)
    const link = screen.getByRole('link', { name: /About Page/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/about')
  })
})

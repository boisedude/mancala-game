import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import App from '../App'

// Helper to render with router
const renderWithRouter = (ui: React.ReactElement) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>)
}

describe('App', () => {
  it('renders without crashing', () => {
    renderWithRouter(<App />)
    // App should render the router without errors
    expect(document.body).toBeInTheDocument()
  })

  it('renders Mancala game by default', () => {
    renderWithRouter(<App />)
    // Check that Mancala game content is rendered
    const heading = screen.getByRole('heading', {
      name: /^Mancala$/i,
    })
    expect(heading).toBeInTheDocument()
  })

  it('has New Game button', () => {
    renderWithRouter(<App />)
    const newGameButton = screen.getByRole('button', { name: /New Game/i })
    expect(newGameButton).toBeInTheDocument()
  })
})

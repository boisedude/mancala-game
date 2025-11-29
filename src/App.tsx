import { Route, Routes } from 'react-router-dom'
import { ErrorBoundary } from 'react-error-boundary'
import MancalaGame from './pages/MancalaGame'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import HistoryPage from './pages/HistoryPage'
import GraphicsShowcase from './pages/GraphicsShowcase'

function ErrorFallback({ error }: { error: Error }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
      <div className="space-y-4 text-center">
        <h1 className="text-4xl font-bold text-destructive">Something went wrong</h1>
        <pre className="max-w-2xl overflow-auto rounded-md bg-muted p-4 text-sm">
          {error.message}
        </pre>
        <button
          onClick={() => window.location.reload()}
          className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
        >
          Reload page
        </button>
      </div>
    </div>
  )
}

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Routes>
        <Route path="/" element={<MancalaGame />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/graphics" element={<GraphicsShowcase />} />
        <Route path="/template" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </ErrorBoundary>
  )
}

export default App

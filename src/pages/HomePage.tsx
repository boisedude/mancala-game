import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function HomePage() {
  const [count, setCount] = useState(0)

  return (
    <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
      <div className="max-w-2xl space-y-8 text-center">
        <h1 className="text-5xl font-bold">React + TypeScript + shadcn/ui</h1>
        <p className="text-xl text-muted-foreground">
          A modern, production-ready template with best practices
        </p>
        <div className="space-y-4">
          <button
            onClick={() => setCount(count => count + 1)}
            className="rounded-md bg-primary px-6 py-3 text-primary-foreground transition-colors hover:bg-primary/90"
          >
            count is {count}
          </button>
          <p className="text-muted-foreground">
            Edit <code className="rounded bg-muted px-2 py-1">src/pages/HomePage.tsx</code> and save
            to test HMR
          </p>
        </div>
        <div className="flex justify-center gap-4">
          <Link to="/about" className="text-primary hover:underline">
            About Page →
          </Link>
        </div>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>Features: React 19, TypeScript, Vite, Tailwind CSS, shadcn/ui</p>
          <p>React Router, TanStack Query, React Hook Form, Prettier, Husky</p>
        </div>
      </div>
    </div>
  )
}

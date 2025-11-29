import { Link } from 'react-router-dom'

export default function AboutPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
      <div className="max-w-2xl space-y-8 px-4 text-center">
        <h1 className="text-4xl font-bold">About This Template</h1>
        <div className="space-y-4 text-left text-muted-foreground">
          <p>
            This is a comprehensive React template built with modern best practices and the latest
            stable versions of popular tools.
          </p>
          <h2 className="pt-4 text-2xl font-semibold text-foreground">Features Include:</h2>
          <ul className="list-inside list-disc space-y-2 pl-4">
            <li>React 19 with TypeScript for type-safe development</li>
            <li>Vite for lightning-fast dev server and builds</li>
            <li>Tailwind CSS + shadcn/ui for beautiful, accessible components</li>
            <li>React Router for client-side routing</li>
            <li>TanStack Query for data fetching and caching</li>
            <li>React Hook Form + Zod for form handling and validation</li>
            <li>Jest + Playwright for comprehensive testing</li>
            <li>Prettier + ESLint for code quality</li>
            <li>Husky + lint-staged for pre-commit hooks</li>
            <li>Error boundaries for graceful error handling</li>
          </ul>
        </div>
        <Link to="/" className="inline-block text-primary hover:underline">
          ← Back to Home
        </Link>
      </div>
    </div>
  )
}

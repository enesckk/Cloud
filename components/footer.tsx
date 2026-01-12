import Link from "next/link"
import { Cloud, BookOpen, Calculator, Info } from "lucide-react"

export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-card">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 text-foreground">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <Cloud className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-semibold">CloudGuide</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              An educational platform to help you understand cloud migration concepts and estimate potential costs for
              your business.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground">Explore</h3>
            <nav className="mt-4 flex flex-col gap-3">
              <Link
                href="/learn"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <BookOpen className="h-4 w-4" />
                Learn
              </Link>
              <Link
                href="/estimate"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Calculator className="h-4 w-4" />
                Estimate Cost
              </Link>
              <Link
                href="/about"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Info className="h-4 w-4" />
                About
              </Link>
            </nav>
          </div>

          {/* Info */}
          <div>
            <h3 className="text-sm font-semibold text-foreground">Information</h3>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              This tool provides educational guidance only. Always consult with cloud professionals for specific
              migration projects.
            </p>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-6">
          <p className="text-center text-sm text-muted-foreground">
            CloudGuide - Educational Decision Support for Cloud Migration
          </p>
        </div>
      </div>
    </footer>
  )
}

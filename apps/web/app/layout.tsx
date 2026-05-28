import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AIwithAbhi — Skill Vault",
  description: "Generate, share, and discover production-quality Claude Skills.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="border-b border-border bg-background/95 backdrop-blur sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
            <a href="/" className="font-bold text-lg tracking-tight">
              AIwithAbhi
            </a>
            <nav className="flex items-center gap-6 text-sm">
              <a href="/create" className="text-muted-foreground hover:text-foreground transition-colors">
                Create Skill
              </a>
              <a href="/vault" className="text-muted-foreground hover:text-foreground transition-colors">
                Vault
              </a>
            </nav>
          </div>
        </header>
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  )
}

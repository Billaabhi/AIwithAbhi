import Link from "next/link"
import { ArrowRight, Zap, Shield, Search } from "lucide-react"
import { skillApi } from "@/lib/api"
import { VaultGrid } from "@/components/VaultGrid"

export default async function HomePage() {
  let recentSkills = []
  try {
    const data = await skillApi.getVault(1, "recent")
    recentSkills = data.skills.slice(0, 6)
  } catch {
    // API may not be running yet
  }

  return (
    <div>
      {/* Hero */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-24 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
          Build Skills that actually work
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          Generate production-quality Claude Skills.md files through an AI interview and critique
          workflow. Share them in the public vault.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/create"
            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Create a Skill
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/vault"
            className="flex items-center gap-2 px-6 py-3 rounded-lg border border-border text-sm font-medium hover:bg-accent transition-colors"
          >
            Browse Vault
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="border-y border-border bg-muted/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 grid sm:grid-cols-3 gap-8">
          {[
            { icon: Zap, title: "AI Interview", desc: "The system asks the right questions before building — no vague prompts." },
            { icon: Shield, title: "Critique Pass", desc: "Every skill is reviewed and revised by a second AI pass before you see it." },
            { icon: Search, title: "Public Vault", desc: "Search, clone, and remix skills from the community." },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="space-y-2">
              <Icon className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">{title}</h3>
              <p className="text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Recent skills */}
      {recentSkills.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Recent Skills</h2>
            <Link href="/vault" className="text-sm text-primary hover:underline">
              View all
            </Link>
          </div>
          <VaultGrid skills={recentSkills} />
        </section>
      )}
    </div>
  )
}

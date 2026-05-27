"use client"
import { useEffect, useState } from "react"
import { skillApi } from "@/lib/api"
import { VaultGrid } from "@/components/VaultGrid"
import { SearchBar } from "@/components/SearchBar"
import { Loader2 } from "lucide-react"
import type { Skill } from "@aiwithabhi/types"

type Sort = "recent" | "trending" | "top"

export default function VaultPage() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [sort, setSort] = useState<Sort>("recent")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    skillApi.getVault(page, sort).then((data) => {
      setSkills(data.skills as unknown as Skill[])
      setTotal(data.total)
    }).finally(() => setLoading(false))
  }, [page, sort])

  const sortLabels: { key: Sort; label: string }[] = [
    { key: "recent", label: "Recent" },
    { key: "trending", label: "Trending" },
    { key: "top", label: "Top Rated" },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-1">Skill Vault</h1>
          <p className="text-sm text-muted-foreground">{total} community skills</p>
        </div>
        <SearchBar className="sm:w-64" />
      </div>

      <div className="flex gap-2 mb-6">
        {sortLabels.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => { setSort(key); setPage(1) }}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              sort === key
                ? "bg-primary text-primary-foreground"
                : "border border-border hover:bg-accent"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          <VaultGrid skills={skills} emptyMessage="No skills published yet. Be the first!" />
          {total > 20 && (
            <div className="flex justify-center gap-3 mt-10">
              <button
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="px-4 py-2 rounded-lg border border-border text-sm disabled:opacity-40"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-sm text-muted-foreground">Page {page}</span>
              <button
                disabled={page * 20 >= total}
                onClick={() => setPage(p => p + 1)}
                className="px-4 py-2 rounded-lg border border-border text-sm disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

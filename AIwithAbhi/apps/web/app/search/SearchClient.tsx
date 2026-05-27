"use client"
import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { skillApi } from "@/lib/api"
import { VaultGrid } from "@/components/VaultGrid"
import { SearchBar } from "@/components/SearchBar"
import { Loader2 } from "lucide-react"
import type { Skill } from "@aiwithabhi/types"

export function SearchClient() {
  const params = useSearchParams()
  const q = params.get("q") ?? ""
  const [skills, setSkills] = useState<Skill[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (q.length < 2) return
    setLoading(true)
    skillApi
      .search(q)
      .then((data) => {
        setSkills(data.skills as unknown as Skill[])
        setTotal(data.total)
      })
      .finally(() => setLoading(false))
  }, [q])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8 space-y-4">
        <h1 className="text-2xl font-bold">Search</h1>
        <SearchBar defaultValue={q} className="max-w-md" />
        {q && !loading && (
          <p className="text-sm text-muted-foreground">
            {total} result{total !== 1 ? "s" : ""} for &ldquo;{q}&rdquo;
          </p>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <VaultGrid
          skills={skills}
          emptyMessage={q.length >= 2 ? `No skills found for "${q}".` : "Enter a search term above."}
        />
      )}
    </div>
  )
}

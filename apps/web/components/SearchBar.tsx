"use client"
import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"

interface Props {
  defaultValue?: string
  className?: string
}

export function SearchBar({ defaultValue = "", className }: Props) {
  const [value, setValue] = useState(defaultValue)
  const router = useRouter()

  const submit = useCallback(() => {
    const q = value.trim()
    if (q.length >= 2) router.push(`/search?q=${encodeURIComponent(q)}`)
  }, [value, router])

  return (
    <div className={cn("relative", className)}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
        placeholder="Search skills..."
        className="w-full pl-9 pr-4 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
      />
    </div>
  )
}

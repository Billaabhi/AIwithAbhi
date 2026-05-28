"use client"
import Link from "next/link"
import { Heart, Eye, Download } from "lucide-react"
import { cn, formatNumber, timeAgo } from "@/lib/utils"
import type { Skill } from "@aiwithabhi/types"

interface Props {
  skill: Pick<Skill, "slug" | "title" | "description" | "tags" | "views" | "likes" | "downloads" | "createdAt">
  className?: string
}

export function SkillCard({ skill, className }: Props) {
  return (
    <Link
      href={`/vault/${skill.slug}`}
      className={cn(
        "block rounded-xl border border-border bg-card p-5 hover:shadow-md hover:border-primary/30 transition-all duration-200 animate-fade-in",
        className
      )}
    >
      <h3 className="font-semibold text-base text-foreground line-clamp-1 mb-1">{skill.title}</h3>
      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{skill.description}</p>

      {skill.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {skill.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center gap-4 text-xs text-muted-foreground mt-auto">
        <span className="flex items-center gap-1">
          <Eye className="w-3 h-3" />
          {formatNumber(skill.views)}
        </span>
        <span className="flex items-center gap-1">
          <Heart className="w-3 h-3" />
          {formatNumber(skill.likes)}
        </span>
        <span className="flex items-center gap-1">
          <Download className="w-3 h-3" />
          {formatNumber(skill.downloads)}
        </span>
        <span className="ml-auto">{timeAgo(skill.createdAt)}</span>
      </div>
    </Link>
  )
}

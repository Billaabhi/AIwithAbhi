"use client"
import ReactMarkdown from "react-markdown"
import { cn } from "@/lib/utils"

interface Props {
  markdown: string
  className?: string
}

export function SkillPreview({ markdown, className }: Props) {
  return (
    <div
      className={cn(
        "prose prose-sm max-w-none dark:prose-invert",
        "prose-headings:font-semibold prose-headings:tracking-tight",
        "prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-xs",
        "prose-pre:bg-muted prose-pre:rounded-lg",
        className
      )}
    >
      <ReactMarkdown>{markdown}</ReactMarkdown>
    </div>
  )
}

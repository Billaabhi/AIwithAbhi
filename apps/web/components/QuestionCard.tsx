"use client"
import type { Question } from "@aiwithabhi/types"
import { cn } from "@/lib/utils"

interface Props {
  question: Question
  value: string
  onChange: (value: string) => void
}

export function QuestionCard({ question, value, onChange }: Props) {
  return (
    <div className="rounded-lg border border-border bg-card p-4 space-y-2 animate-slide-up">
      <label className="text-sm font-medium text-foreground flex items-start gap-2">
        {question.required && (
          <span className="text-primary text-xs mt-0.5 shrink-0">*</span>
        )}
        {question.text}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Your answer..."
        rows={3}
        className={cn(
          "w-full text-sm rounded-md border border-input bg-background px-3 py-2 resize-none",
          "focus:outline-none focus:ring-2 focus:ring-ring",
          "placeholder:text-muted-foreground"
        )}
      />
    </div>
  )
}

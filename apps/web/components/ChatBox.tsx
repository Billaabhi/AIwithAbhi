"use client"
import { useState } from "react"
import { Send, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useSkillStore } from "@/store/skillStore"
import { QuestionCard } from "./QuestionCard"

export function ChatBox() {
  const { intent, questions, answers, status, error, setIntent, setAnswer, startGeneration, submitAnswers } =
    useSkillStore()

  const [localIntent, setLocalIntent] = useState(intent)
  const isLoading = status === "loading"

  const handleStart = () => {
    setIntent(localIntent)
    startGeneration()
  }

  const allRequiredAnswered = questions
    .filter((q) => q.required)
    .every((q) => (answers[q.id] ?? "").trim().length > 0)

  if (status === "idle" || status === "error") {
    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">What skill do you want to build?</label>
          <textarea
            value={localIntent}
            onChange={(e) => setLocalIntent(e.target.value)}
            placeholder="e.g. A skill for reviewing pull requests as a senior engineer, focused on catching logic bugs and security issues..."
            rows={4}
            className="w-full text-sm rounded-lg border border-input bg-background px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button
          onClick={handleStart}
          disabled={localIntent.trim().length < 10 || isLoading}
          className={cn(
            "flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors",
            "bg-primary text-primary-foreground hover:bg-primary/90",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          Generate Skill
        </button>
      </div>
    )
  }

  if (status === "questioning") {
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          A few quick questions to make your skill more precise:
        </p>
        {questions.map((q) => (
          <QuestionCard
            key={q.id}
            question={q}
            value={answers[q.id] ?? ""}
            onChange={(v) => setAnswer(q.id, v)}
          />
        ))}
        <button
          onClick={submitAnswers}
          disabled={!allRequiredAnswered || isLoading}
          className={cn(
            "flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors",
            "bg-primary text-primary-foreground hover:bg-primary/90",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          Build Skill
        </button>
      </div>
    )
  }

  if (status === "loading") {
    return (
      <div className="flex items-center gap-3 py-8 text-muted-foreground">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span className="text-sm">Generating your skill...</span>
      </div>
    )
  }

  return null
}

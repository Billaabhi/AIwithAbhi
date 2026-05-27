"use client"
import { useState } from "react"
import { X, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface Props {
  open: boolean
  onClose: () => void
  onPublish: (title: string, description: string, tags: string[]) => Promise<void>
  defaultTitle?: string
  defaultDescription?: string
}

export function PublishModal({ open, onClose, onPublish, defaultTitle = "", defaultDescription = "" }: Props) {
  const [title, setTitle] = useState(defaultTitle)
  const [description, setDescription] = useState(defaultDescription)
  const [tagInput, setTagInput] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!open) return null

  const addTag = () => {
    const t = tagInput.trim().toLowerCase()
    if (t && !tags.includes(t) && tags.length < 10) {
      setTags([...tags, t])
      setTagInput("")
    }
  }

  const removeTag = (t: string) => setTags(tags.filter((x) => x !== t))

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)
    try {
      await onPublish(title, description, tags)
      onClose()
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Publish failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-card border border-border rounded-2xl shadow-xl w-full max-w-md mx-4 p-6 space-y-4 animate-slide-up">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-lg">Publish to Vault</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 w-full text-sm rounded-md border border-input bg-background px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Skill title"
              maxLength={255}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="mt-1 w-full text-sm rounded-md border border-input bg-background px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="One sentence about this skill"
              maxLength={500}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Tags</label>
            <div className="mt-1 flex gap-2">
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTag()}
                className="flex-1 text-sm rounded-md border border-input bg-background px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Add tag + Enter"
              />
              <button
                onClick={addTag}
                className="px-3 py-2 rounded-md border border-input text-sm hover:bg-accent"
              >
                Add
              </button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground"
                  >
                    {t}
                    <button onClick={() => removeTag(t)} className="hover:text-red-500">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={title.trim().length < 3 || description.trim().length < 10 || loading}
          className={cn(
            "w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors",
            "bg-primary text-primary-foreground hover:bg-primary/90",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          Publish Skill
        </button>
      </div>
    </div>
  )
}

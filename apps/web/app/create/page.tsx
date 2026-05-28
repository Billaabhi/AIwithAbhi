"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Copy, Check } from "lucide-react"
import { ChatBox } from "@/components/ChatBox"
import { SkillPreview } from "@/components/SkillPreview"
import { PublishModal } from "@/components/PublishModal"
import { useSkillStore } from "@/store/skillStore"

export default function CreatePage() {
  const { draft, status, publishSkill, reset } = useSkillStore()
  const [publishOpen, setPublishOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const router = useRouter()

  const copyMarkdown = () => {
    if (!draft) return
    navigator.clipboard.writeText(draft.markdown)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handlePublish = async (title: string, description: string, tags: string[]) => {
    const published = await publishSkill(title, description, tags)
    router.push(`/vault/${published.slug}`)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">Create a Skill</h1>
        <p className="text-sm text-muted-foreground">
          Describe what you need. The AI will ask clarifying questions, then generate a production-quality skill.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left: chat flow */}
        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-6">
            <ChatBox />
          </div>
          {status === "done" && draft && (
            <button
              onClick={reset}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Start over
            </button>
          )}
        </div>

        {/* Right: preview */}
        {draft && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Preview</h2>
              <div className="flex gap-2">
                <button
                  onClick={copyMarkdown}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border text-sm hover:bg-accent transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "Copied" : "Copy"}
                </button>
                <button
                  onClick={() => setPublishOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  Publish to Vault
                </button>
              </div>
            </div>
            <div className="rounded-xl border border-border bg-card p-6 max-h-[70vh] overflow-y-auto">
              <SkillPreview markdown={draft.markdown} />
            </div>
          </div>
        )}
      </div>

      <PublishModal
        open={publishOpen}
        onClose={() => setPublishOpen(false)}
        onPublish={handlePublish}
        defaultTitle={draft?.title ?? ""}
        defaultDescription={draft?.description ?? ""}
      />
    </div>
  )
}

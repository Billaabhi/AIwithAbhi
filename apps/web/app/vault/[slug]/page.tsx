"use client"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Copy, Check, Heart, Download, ArrowLeft, Loader2 } from "lucide-react"
import { skillApi } from "@/lib/api"
import { SkillPreview } from "@/components/SkillPreview"
import { formatNumber, timeAgo } from "@/lib/utils"
import type { Skill } from "@aiwithabhi/types"

export default function SkillPage() {
  const { slug } = useParams<{ slug: string }>()
  const router = useRouter()
  const [skill, setSkill] = useState<Skill | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [liked, setLiked] = useState(false)
  const [cloning, setCloning] = useState(false)

  useEffect(() => {
    skillApi.getSkill(slug).then(setSkill).finally(() => setLoading(false))
  }, [slug])

  const copy = () => {
    if (!skill) return
    navigator.clipboard.writeText(skill.markdown)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const like = async () => {
    if (!skill || liked) return
    const updated = await skillApi.like(skill.id)
    setSkill(updated)
    setLiked(true)
  }

  const clone = async () => {
    if (!skill) return
    setCloning(true)
    try {
      const cloned = await skillApi.clone(skill.id)
      router.push(`/create?cloned=${cloned.id}`)
    } finally {
      setCloning(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!skill) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <p className="text-muted-foreground">Skill not found.</p>
        <button onClick={() => router.push("/vault")} className="mt-4 text-sm text-primary hover:underline">
          Back to Vault
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">{skill.title}</h1>
        <p className="text-muted-foreground mb-3">{skill.description}</p>

        {skill.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {skill.tags.map((tag) => (
              <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={copy}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border text-sm hover:bg-accent transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            {copied ? "Copied!" : "Copy Markdown"}
          </button>
          <button
            onClick={clone}
            disabled={cloning}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border text-sm hover:bg-accent transition-colors disabled:opacity-50"
          >
            {cloning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            Clone & Remix
          </button>
          <button
            onClick={like}
            disabled={liked}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border text-sm hover:bg-accent transition-colors disabled:opacity-50"
          >
            <Heart className={`w-4 h-4 ${liked ? "fill-red-500 text-red-500" : ""}`} />
            {formatNumber(skill.likes)}
          </button>
          <span className="text-xs text-muted-foreground ml-auto">{timeAgo(skill.createdAt)}</span>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <SkillPreview markdown={skill.markdown} />
      </div>
    </div>
  )
}

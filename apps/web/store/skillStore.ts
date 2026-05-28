"use client"
import { create } from "zustand"
import type { Skill, Question, SkillSessionStatus } from "@aiwithabhi/types"
import { skillApi } from "@/lib/api"

interface SkillStore {
  sessionId: string | null
  intent: string
  questions: Question[]
  answers: Record<string, string>
  draft: Skill | null
  status: SkillSessionStatus | "idle" | "loading" | "error"
  error: string | null

  setIntent: (intent: string) => void
  setAnswer: (questionId: string, value: string) => void
  startGeneration: () => Promise<void>
  submitAnswers: () => Promise<void>
  publishSkill: (title: string, description: string, tags: string[]) => Promise<Skill>
  reset: () => void
}

const INITIAL: Pick<SkillStore, "sessionId" | "intent" | "questions" | "answers" | "draft" | "status" | "error"> = {
  sessionId: null,
  intent: "",
  questions: [],
  answers: {},
  draft: null,
  status: "idle",
  error: null,
}

export const useSkillStore = create<SkillStore>((set, get) => ({
  ...INITIAL,

  setIntent: (intent) => set({ intent }),

  setAnswer: (questionId, value) =>
    set((s) => ({ answers: { ...s.answers, [questionId]: value } })),

  startGeneration: async () => {
    set({ status: "loading", error: null })
    try {
      const res = await skillApi.generate({ intent: get().intent })
      if (res.status === "questioning") {
        set({ sessionId: res.sessionId, questions: res.questions ?? [], status: "questioning" })
      } else {
        set({ sessionId: res.sessionId, draft: res.skill ?? null, status: "done" })
      }
    } catch (e: unknown) {
      set({ status: "error", error: e instanceof Error ? e.message : "Generation failed" })
    }
  },

  submitAnswers: async () => {
    const { sessionId, answers } = get()
    if (!sessionId) return
    set({ status: "loading", error: null })
    try {
      const res = await skillApi.answer(sessionId, { answers })
      set({ draft: res.skill ?? null, status: "done" })
    } catch (e: unknown) {
      set({ status: "error", error: e instanceof Error ? e.message : "Failed to process answers" })
    }
  },

  publishSkill: async (title, description, tags) => {
    const { draft } = get()
    if (!draft) throw new Error("No skill draft to publish")
    const published = await skillApi.publish(draft.id, { title, description, tags })
    set({ draft: published })
    return published
  },

  reset: () => set(INITIAL),
}))

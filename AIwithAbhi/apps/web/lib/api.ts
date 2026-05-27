import axios from "axios"
import type {
  GenerateRequest,
  GenerateResponse,
  AnswerRequest,
  VaultListResponse,
  Skill,
  PublishRequest,
} from "@aiwithabhi/types"

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000",
  headers: { "Content-Type": "application/json" },
})

export const skillApi = {
  generate: (body: GenerateRequest) =>
    api.post<GenerateResponse>("/generate", body).then((r) => r.data),

  answer: (sessionId: string, body: AnswerRequest) =>
    api.post<GenerateResponse>(`/generate/${sessionId}/answer`, body).then((r) => r.data),

  publish: (skillId: string, body: PublishRequest) =>
    api.post<Skill>(`/vault/publish/${skillId}`, body).then((r) => r.data),

  getVault: (page = 1, sort: "recent" | "trending" | "top" = "recent") =>
    api.get<VaultListResponse>("/vault", { params: { page, sort } }).then((r) => r.data),

  getSkill: (slug: string) =>
    api.get<Skill>(`/vault/${slug}`).then((r) => r.data),

  search: (q: string, page = 1) =>
    api.get<VaultListResponse>("/search", { params: { q, page } }).then((r) => r.data),

  like: (skillId: string) =>
    api.post<Skill>(`/like/${skillId}`).then((r) => r.data),

  clone: (skillId: string) =>
    api.post<Skill>(`/clone/${skillId}`).then((r) => r.data),
}

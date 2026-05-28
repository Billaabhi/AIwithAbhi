export interface Question {
  id: string
  text: string
  required: boolean
}

export interface Skill {
  id: string
  title: string
  slug: string
  description: string
  markdown: string
  tags: string[]
  views: number
  likes: number
  downloads: number
  published: boolean
  createdAt: string
  updatedAt: string
}

export type SkillSessionStatus =
  | 'intake'
  | 'questioning'
  | 'drafting'
  | 'reviewing'
  | 'done'

export interface SkillSession {
  sessionId: string
  intent: string
  questions: Question[]
  answers: Record<string, string>
  draft?: string
  status: SkillSessionStatus
}

// API request/response shapes shared between frontend and backend docs
export interface GenerateRequest {
  intent: string
}

export interface GenerateResponse {
  sessionId: string
  status: SkillSessionStatus
  questions?: Question[]   // present when status = 'questioning'
  skill?: Skill            // present when status = 'done'
}

export interface AnswerRequest {
  answers: Record<string, string>
}

export interface VaultListResponse {
  skills: Skill[]
  total: number
  page: number
  pageSize: number
}

export interface PublishRequest {
  title: string
  description: string
  tags: string[]
}

export interface ModerationResult {
  safe: boolean
  reason?: string
}

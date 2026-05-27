"use client"
import { SkillCard } from "./SkillCard"
import type { Skill } from "@aiwithabhi/types"

interface Props {
  skills: Skill[]
  emptyMessage?: string
}

export function VaultGrid({ skills, emptyMessage = "No skills found." }: Props) {
  if (skills.length === 0) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        <p>{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {skills.map((skill) => (
        <SkillCard key={skill.id} skill={skill} />
      ))}
    </div>
  )
}

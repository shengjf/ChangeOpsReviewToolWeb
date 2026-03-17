import type { LucideIcon } from "lucide-react"
import type { ReactNode } from "react"

export interface GenerationCardConfig {
  id: string
  tabLabel: string
  title: string
  description: string
  icon: LucideIcon
  content: ReactNode
}

export interface Course {
  id: number
  title: string
  status: "Published" | "Draft"
  lastEdited: string
  isAIGenerated: boolean
  progress: number
}

export interface AIInsight {
  title: string
  description: string
}
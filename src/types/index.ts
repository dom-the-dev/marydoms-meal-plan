export interface Recipe {
  id: string
  title: string
  ingredients?: string[]
  notes?: string
  createdAt: string
}

export interface MealEntry {
  id: string
  recipeId?: string
  customName?: string
}

export interface DayPlan {
  date: string // ISO date string YYYY-MM-DD
  isCheatDay: boolean
  meals: MealEntry[]
}

export interface AppData {
  recipes: Recipe[]
  days: DayPlan[]
}

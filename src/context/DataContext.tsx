import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react'
import type { AppData, DayPlan, MealEntry, Recipe } from '../types'
import { loadData, saveData, EMPTY_DATA } from '../lib/jsonbin'
import { uid } from '../lib/utils'

interface DataContextValue {
  data: AppData
  loading: boolean
  error: string | null
  addRecipe: (recipe: Omit<Recipe, 'id' | 'createdAt'>) => Promise<void>
  updateRecipe: (recipe: Recipe) => Promise<void>
  deleteRecipe: (id: string) => Promise<void>
  getDay: (date: string) => DayPlan
  toggleCheatDay: (date: string) => Promise<void>
  addMeal: (date: string, meal: Omit<MealEntry, 'id'>) => Promise<void>
  removeMeal: (date: string, mealId: string) => Promise<void>
}

const DataContext = createContext<DataContextValue | null>(null)

export function DataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(EMPTY_DATA)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadData()
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const persist = useCallback(async (next: AppData) => {
    setData(next)
    await saveData(next).catch((e) => setError(e.message))
  }, [])

  const addRecipe = async (recipe: Omit<Recipe, 'id' | 'createdAt'>) => {
    const next: AppData = {
      ...data,
      recipes: [...data.recipes, { ...recipe, id: uid(), createdAt: new Date().toISOString() }],
    }
    await persist(next)
  }

  const updateRecipe = async (recipe: Recipe) => {
    const next: AppData = {
      ...data,
      recipes: data.recipes.map((r) => (r.id === recipe.id ? recipe : r)),
    }
    await persist(next)
  }

  const deleteRecipe = async (id: string) => {
    const next: AppData = {
      ...data,
      recipes: data.recipes.filter((r) => r.id !== id),
    }
    await persist(next)
  }

  const getDay = (date: string): DayPlan => {
    return data.days.find((d) => d.date === date) ?? { date, isCheatDay: false, meals: [] }
  }

  const upsertDay = (date: string, update: Partial<Omit<DayPlan, 'date'>>): AppData => {
    const existing = data.days.find((d) => d.date === date)
    const updated: DayPlan = existing
      ? { ...existing, ...update }
      : { date, isCheatDay: false, meals: [], ...update }
    return {
      ...data,
      days: existing
        ? data.days.map((d) => (d.date === date ? updated : d))
        : [...data.days, updated],
    }
  }

  const toggleCheatDay = async (date: string) => {
    const day = getDay(date)
    await persist(upsertDay(date, { isCheatDay: !day.isCheatDay }))
  }

  const addMeal = async (date: string, meal: Omit<MealEntry, 'id'>) => {
    const day = getDay(date)
    const newMeal: MealEntry = { ...meal, id: uid() }
    await persist(upsertDay(date, { meals: [...day.meals, newMeal] }))
  }

  const removeMeal = async (date: string, mealId: string) => {
    const day = getDay(date)
    await persist(upsertDay(date, { meals: day.meals.filter((m) => m.id !== mealId) }))
  }

  return (
    <DataContext.Provider
      value={{ data, loading, error, addRecipe, updateRecipe, deleteRecipe, getDay, toggleCheatDay, addMeal, removeMeal }}
    >
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used inside DataProvider')
  return ctx
}

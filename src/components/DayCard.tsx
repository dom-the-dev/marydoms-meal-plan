import { useState } from 'react'
import { useData } from '../context/DataContext'

interface Props {
  date: string
  label: string
}

export default function DayCard({ date, label }: Props) {
  const { getDay, toggleCheatDay, addMeal, removeMeal, data } = useData()
  const day = getDay(date)
  const [showForm, setShowForm] = useState(false)
  const [mealInput, setMealInput] = useState('')
  const [selectedRecipeId, setSelectedRecipeId] = useState('')
  const [saving, setSaving] = useState(false)

  const getMealName = (meal: { recipeId?: string; customName?: string }) => {
    if (meal.recipeId) {
      return data.recipes.find((r) => r.id === meal.recipeId)?.title ?? '(gelöschtes Rezept)'
    }
    return meal.customName ?? ''
  }

  const handleAdd = async () => {
    if (!selectedRecipeId && !mealInput.trim()) return
    setSaving(true)
    await addMeal(date, selectedRecipeId ? { recipeId: selectedRecipeId } : { customName: mealInput.trim() })
    setMealInput('')
    setSelectedRecipeId('')
    setShowForm(false)
    setSaving(false)
  }

  return (
    <div
      className={`rounded-xl border p-4 transition-colors ${
        day.isCheatDay
          ? 'bg-orange-50 border-orange-200'
          : 'bg-white border-stone-200'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="font-medium text-stone-700 text-sm">{label}</div>
        <button
          onClick={() => toggleCheatDay(date)}
          title="Als Cheat Day markieren"
          className={`text-xs px-2 py-0.5 rounded-full border transition-colors whitespace-nowrap ${
            day.isCheatDay
              ? 'bg-orange-100 border-orange-300 text-orange-700'
              : 'border-stone-200 text-stone-400 hover:border-orange-300 hover:text-orange-500'
          }`}
        >
          🍕 Cheat Day
        </button>
      </div>

      {day.meals.length > 0 && (
        <ul className="mt-3 space-y-1">
          {day.meals.map((meal) => (
            <li key={meal.id} className="flex items-center justify-between gap-2 text-sm text-stone-600">
              <span className="flex items-center gap-1.5">
                <span className="text-stone-300">•</span>
                {getMealName(meal)}
                {meal.recipeId && (
                  <span className="text-xs text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">Rezept</span>
                )}
              </span>
              <button
                onClick={() => removeMeal(date, meal.id)}
                className="text-stone-300 hover:text-red-400 transition-colors text-xs"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}

      {showForm ? (
        <div className="mt-3 flex flex-col gap-2">
          <select
            value={selectedRecipeId}
            onChange={(e) => { setSelectedRecipeId(e.target.value); setMealInput('') }}
            className="text-sm rounded-lg border border-stone-200 px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-300"
          >
            <option value="">— Rezept wählen —</option>
            {data.recipes.map((r) => (
              <option key={r.id} value={r.id}>{r.title}</option>
            ))}
          </select>

          {!selectedRecipeId && (
            <input
              type="text"
              placeholder="Oder freien Namen eingeben..."
              value={mealInput}
              onChange={(e) => setMealInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              className="text-sm rounded-lg border border-stone-200 px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-300"
              autoFocus
            />
          )}

          <div className="flex gap-2">
            <button
              onClick={handleAdd}
              disabled={saving || (!selectedRecipeId && !mealInput.trim())}
              className="text-sm px-3 py-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-40 transition-colors"
            >
              {saving ? '...' : 'Hinzufügen'}
            </button>
            <button
              onClick={() => { setShowForm(false); setMealInput(''); setSelectedRecipeId('') }}
              className="text-sm px-3 py-1.5 border border-stone-200 rounded-lg hover:bg-stone-100 transition-colors"
            >
              Abbrechen
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="mt-3 text-xs text-stone-400 hover:text-emerald-600 transition-colors flex items-center gap-1"
        >
          + Mahlzeit hinzufügen
        </button>
      )}
    </div>
  )
}

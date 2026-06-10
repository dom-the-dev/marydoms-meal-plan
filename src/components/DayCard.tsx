import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { useData } from '../context/DataContext'
import type { MealEntry } from '../types'

interface Props {
  date: string
  label: string
  isToday: boolean
  isFocused: boolean
  onFocus: () => void
}

interface MealChipProps {
  meal: MealEntry
  onRemove: () => void
  expandable: boolean
}

function MealChip({ meal, onRemove, expandable }: MealChipProps) {
  const { data } = useData()
  const [expanded, setExpanded] = useState(true)

  const recipe = meal.recipeId ? data.recipes.find((r) => r.id === meal.recipeId) : null
  const name = recipe?.title ?? meal.customName ?? ''
  const hasDetails = recipe && (recipe.ingredients?.length || recipe.notes)

  return (
    <div
      className={`rounded-2xl border transition-all ${
        meal.recipeId
          ? 'bg-white border-stone-200'
          : 'bg-stone-100 border-stone-200'
      }`}
    >
      <div className="flex items-center gap-1.5 px-3 py-2">
        {meal.recipeId && <span className="text-emerald-500 text-xs">📋</span>}
        <span
          className={`text-sm font-medium flex-1 ${meal.recipeId ? 'text-emerald-800' : 'text-stone-700'}`}
        >
          {name}
        </span>
        {expandable && hasDetails && (
          <button
            onClick={() => setExpanded((e) => !e)}
            className={`text-xs px-1.5 py-0.5 rounded-full transition-colors ${
              expanded
                ? 'bg-emerald-200 text-emerald-700'
                : 'text-emerald-400 hover:text-emerald-600'
            }`}
          >
            {expanded ? '▲' : '▼'}
          </button>
        )}
        <button
          onClick={onRemove}
          className="text-current opacity-25 hover:opacity-60 transition-opacity text-xs ml-0.5"
        >
          ✕
        </button>
      </div>

      {expanded && recipe && (
        <div className="px-3 pb-3 pt-0 border-t border-stone-100 mt-0">
          {recipe.ingredients && recipe.ingredients.length > 0 && (
            <div className="mt-2">
              <p className="text-xs font-semibold text-stone-500 mb-1">Zutaten</p>
              <ul className="space-y-0.5">
                {recipe.ingredients.map((ing, i) => (
                  <li key={i} className="text-xs text-stone-600 flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-stone-300 shrink-0" />
                    {ing}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {recipe.notes && (
            <div className="mt-2">
              <p className="text-xs font-semibold text-stone-500 mb-1">Notizen</p>
              <div className="text-xs text-stone-600 prose prose-xs max-w-none
                [&_p]:mb-1.5 [&_p:last-child]:mb-0
                [&_ul]:my-1 [&_ul]:pl-4 [&_ul]:list-disc [&_ul_li]:mb-0.5
                [&_ol]:my-1 [&_ol]:pl-4 [&_ol]:list-decimal [&_ol_li]:mb-0.5
                [&_strong]:font-semibold [&_strong]:text-stone-700">
                <ReactMarkdown>{recipe.notes}</ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function DayCard({ date, label, isToday, isFocused, onFocus }: Props) {
  const { getDay, toggleCheatDay, addMeal, removeMeal, data } = useData()
  const day = getDay(date)
  const [showForm, setShowForm] = useState(false)
  const [mealInput, setMealInput] = useState('')
  const [selectedRecipeId, setSelectedRecipeId] = useState('')
  const [saving, setSaving] = useState(false)

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
      onClick={!isFocused ? onFocus : undefined}
      className={`rounded-xl border p-4 transition-all ${
        day.isCheatDay
          ? 'bg-orange-50 border-orange-200'
          : isToday
          ? 'bg-white border-emerald-300 shadow-sm shadow-emerald-100'
          : isFocused
          ? 'bg-white border-stone-300'
          : 'bg-white border-stone-200 cursor-pointer hover:border-stone-300'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className={`font-semibold text-sm ${isToday ? 'text-emerald-700' : 'text-stone-700'}`}>
            {label}
          </span>
          {isToday && (
            <span className="text-xs bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-full font-medium">
              Heute
            </span>
          )}
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); toggleCheatDay(date) }}
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
        <div className="mt-3 flex flex-col gap-2">
          {day.meals.map((meal) => (
            <MealChip
              key={meal.id}
              meal={meal}
              expandable={isToday || isFocused}
              onRemove={() => removeMeal(date, meal.id)}
            />
          ))}
        </div>
      )}

      {(isFocused || isToday) && (
        showForm ? (
          <div className="mt-3 flex flex-col gap-2" onClick={(e) => e.stopPropagation()}>
            <select
              value={selectedRecipeId}
              onChange={(e) => { setSelectedRecipeId(e.target.value); setMealInput('') }}
              className="text-sm rounded-lg border border-stone-200 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-300"
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
                className="text-sm rounded-lg border border-stone-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-300"
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
            onClick={(e) => { e.stopPropagation(); setShowForm(true) }}
            className="mt-3 text-xs text-stone-400 hover:text-emerald-600 transition-colors flex items-center gap-1"
          >
            + Mahlzeit hinzufügen
          </button>
        )
      )}
    </div>
  )
}

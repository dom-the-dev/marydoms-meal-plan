import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useData } from '../context/DataContext'
import type { Recipe } from '../types'

export default function RecipeForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data, addRecipe, updateRecipe } = useData()

  const existing = id ? data.recipes.find((r) => r.id === id) : undefined

  const [title, setTitle] = useState(existing?.title ?? '')
  const [ingredientsText, setIngredientsText] = useState(existing?.ingredients?.join('\n') ?? '')
  const [notes, setNotes] = useState(existing?.notes ?? '')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (existing) {
      setTitle(existing.title)
      setIngredientsText(existing.ingredients?.join('\n') ?? '')
      setNotes(existing.notes ?? '')
    }
  }, [existing?.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    setSaving(true)

    const ingredients = ingredientsText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean)

    if (existing) {
      const updated: Recipe = {
        ...existing,
        title: title.trim(),
        ingredients: ingredients.length ? ingredients : undefined,
        notes: notes.trim() || undefined,
      }
      await updateRecipe(updated)
    } else {
      await addRecipe({
        title: title.trim(),
        ingredients: ingredients.length ? ingredients : undefined,
        notes: notes.trim() || undefined,
      })
    }

    navigate('/recipes')
  }

  return (
    <div className="max-w-lg">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="text-stone-400 hover:text-stone-700 transition-colors"
        >
          ← Zurück
        </button>
        <h1 className="text-xl font-semibold text-stone-800">
          {existing ? 'Rezept bearbeiten' : 'Neues Rezept'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-stone-200 p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">
            Titel <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="z.B. Spaghetti Bolognese"
            required
            className="w-full text-sm rounded-lg border border-stone-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-300"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">
            Zutaten <span className="text-stone-400 font-normal">(optional, eine pro Zeile)</span>
          </label>
          <textarea
            value={ingredientsText}
            onChange={(e) => setIngredientsText(e.target.value)}
            placeholder={'500g Hackfleisch\n1 Zwiebel\n2 Knoblauchzehen'}
            rows={5}
            className="w-full text-sm rounded-lg border border-stone-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-300 resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">
            Notizen <span className="text-stone-400 font-normal">(optional)</span>
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Zubereitungshinweise, Quellen, Tipps..."
            rows={3}
            className="w-full text-sm rounded-lg border border-stone-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-300 resize-none"
          />
        </div>

        <div className="flex gap-3 pt-1">
          <button
            type="submit"
            disabled={saving || !title.trim()}
            className="px-5 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 disabled:opacity-40 transition-colors"
          >
            {saving ? 'Speichern...' : 'Speichern'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/recipes')}
            className="px-5 py-2 border border-stone-200 text-sm rounded-lg hover:bg-stone-100 transition-colors"
          >
            Abbrechen
          </button>
        </div>
      </form>
    </div>
  )
}

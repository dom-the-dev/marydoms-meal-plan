import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useData } from '../context/DataContext'

export default function Recipes() {
  const { data, deleteRecipe, loading } = useData()
  const [search, setSearch] = useState('')

  const filtered = data.recipes.filter((r) =>
    r.title.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return <div className="text-center py-20 text-stone-400">Lade Daten...</div>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6 gap-4">
        <h1 className="text-xl font-semibold text-stone-800">Rezepte</h1>
        <Link
          to="/recipes/new"
          className="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors whitespace-nowrap"
        >
          + Neues Rezept
        </Link>
      </div>

      {data.recipes.length > 0 && (
        <input
          type="text"
          placeholder="Rezepte durchsuchen..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full mb-4 text-sm rounded-xl border border-stone-200 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-300"
        />
      )}

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-stone-400">
          {data.recipes.length === 0 ? (
            <>
              <div className="text-4xl mb-3">🍽️</div>
              <p className="mb-4">Noch keine Rezepte.</p>
              <Link
                to="/recipes/new"
                className="text-emerald-600 font-medium hover:underline"
              >
                Erstes Rezept anlegen
              </Link>
            </>
          ) : (
            <p>Keine Rezepte gefunden.</p>
          )}
        </div>
      ) : (
        <div className="grid gap-3">
          {filtered.map((recipe) => (
            <div
              key={recipe.id}
              className="bg-white rounded-xl border border-stone-200 p-4 flex items-start justify-between gap-3"
            >
              <div className="flex-1 min-w-0">
                <Link
                  to={`/recipes/${recipe.id}`}
                  className="font-medium text-stone-800 hover:text-emerald-600 transition-colors"
                >
                  {recipe.title}
                </Link>
                {recipe.ingredients && recipe.ingredients.length > 0 && (
                  <p className="text-sm text-stone-400 mt-0.5 truncate">
                    {recipe.ingredients.join(', ')}
                  </p>
                )}
                {recipe.notes && (
                  <p className="text-xs text-stone-400 mt-1 line-clamp-1">{recipe.notes}</p>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Link
                  to={`/recipes/${recipe.id}`}
                  className="text-xs text-stone-400 hover:text-stone-700 transition-colors"
                >
                  Bearbeiten
                </Link>
                <button
                  onClick={() => {
                    if (confirm(`"${recipe.title}" wirklich löschen?`)) deleteRecipe(recipe.id)
                  }}
                  className="text-xs text-stone-300 hover:text-red-400 transition-colors"
                >
                  Löschen
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

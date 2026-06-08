import { NavLink, Outlet } from 'react-router-dom'
import { useData } from '../context/DataContext'

export default function Layout() {
  const { error } = useData()

  return (
    <div className="min-h-screen bg-stone-50">
      <nav className="bg-white border-b border-stone-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 flex items-center gap-6 h-14">
          <span className="font-semibold text-stone-800 text-lg">🥗 Marydom's Meals</span>
          <NavLink
            to="/"
            className={({ isActive }) =>
              `text-sm font-medium transition-colors ${isActive ? 'text-emerald-600' : 'text-stone-500 hover:text-stone-800'}`
            }
          >
            Wochenplan
          </NavLink>
          <NavLink
            to="/recipes"
            className={({ isActive }) =>
              `text-sm font-medium transition-colors ${isActive ? 'text-emerald-600' : 'text-stone-500 hover:text-stone-800'}`
            }
          >
            Rezepte
          </NavLink>
        </div>
      </nav>

      {error && (
        <div className="bg-red-50 border-b border-red-200 text-red-700 text-sm px-4 py-2 text-center">
          Fehler: {error}
        </div>
      )}

      <main className="max-w-4xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}

import { useState } from 'react'
import { useData } from '../context/DataContext'
import { getWeekDates, toISODate, formatDate } from '../lib/utils'
import DayCard from '../components/DayCard'

export default function WeekPlanner() {
  const { loading } = useData()
  const [weekOffset, setWeekOffset] = useState(0)
  const dates = getWeekDates(weekOffset)

  const weekLabel = () => {
    if (weekOffset === 0) return 'Diese Woche'
    if (weekOffset === 1) return 'Nächste Woche'
    if (weekOffset === -1) return 'Letzte Woche'
    const start = dates[0].toLocaleDateString('de-DE', { day: 'numeric', month: 'short' })
    const end = dates[6].toLocaleDateString('de-DE', { day: 'numeric', month: 'short', year: 'numeric' })
    return `${start} – ${end}`
  }

  if (loading) {
    return <div className="text-center py-20 text-stone-400">Lade Daten...</div>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-stone-800">{weekLabel()}</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setWeekOffset((o) => o - 1)}
            className="px-3 py-1.5 text-sm rounded-lg border border-stone-200 hover:bg-stone-100 transition-colors"
          >
            ← Zurück
          </button>
          {weekOffset !== 0 && (
            <button
              onClick={() => setWeekOffset(0)}
              className="px-3 py-1.5 text-sm rounded-lg border border-stone-200 hover:bg-stone-100 transition-colors"
            >
              Heute
            </button>
          )}
          <button
            onClick={() => setWeekOffset((o) => o + 1)}
            className="px-3 py-1.5 text-sm rounded-lg border border-stone-200 hover:bg-stone-100 transition-colors"
          >
            Vor →
          </button>
        </div>
      </div>

      <div className="grid gap-3">
        {dates.map((date) => (
          <DayCard key={toISODate(date)} date={toISODate(date)} label={formatDate(date)} />
        ))}
      </div>
    </div>
  )
}

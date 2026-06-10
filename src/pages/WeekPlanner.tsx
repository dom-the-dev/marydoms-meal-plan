import { useEffect, useRef, useState, useCallback } from 'react'
import { useData } from '../context/DataContext'
import { getWeekDates, toISODate, formatDate } from '../lib/utils'
import DayCard from '../components/DayCard'

const TODAY = toISODate(new Date())
const SHORT_DAYS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']

type ViewMode = 'day' | 'week'

export default function WeekPlanner() {
  const { loading } = useData()
  const [weekOffset, setWeekOffset] = useState(0)
  const [viewMode, setViewMode] = useState<ViewMode>('day')
  const dates = getWeekDates(weekOffset)
  const [focusedDate, setFocusedDate] = useState(TODAY)
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({})


  useEffect(() => {
    if (viewMode === 'week') {
      cardRefs.current[focusedDate]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [focusedDate, viewMode])

  const changeWeek = useCallback((delta: number) => {
    const newOffset = weekOffset + delta
    const newDates = getWeekDates(newOffset)
    const todayInNewWeek = newDates.find((d) => toISODate(d) === TODAY)
    const newFocused = delta > 0
      ? toISODate(newDates[0])
      : toISODate(newDates[newDates.length - 1])
    setWeekOffset(newOffset)
    setFocusedDate(todayInNewWeek ? TODAY : newFocused)
  }, [weekOffset])

  const focusedIndex = dates.findIndex((d) => toISODate(d) === focusedDate)

  const goToPrevDay = () => {
    if (focusedIndex > 0) {
      setFocusedDate(toISODate(dates[focusedIndex - 1]))
    } else {
      changeWeek(-1)
    }
  }

  const goToNextDay = () => {
    if (focusedIndex < dates.length - 1) {
      setFocusedDate(toISODate(dates[focusedIndex + 1]))
    } else {
      changeWeek(1)
    }
  }

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

  const visibleDates = viewMode === 'day'
    ? dates.filter((d) => toISODate(d) === focusedDate)
    : dates

  return (
    <div>
      {/* Top bar: week nav + view toggle */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => changeWeek(-1)}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-stone-200 hover:bg-stone-100 transition-colors text-stone-500"
          >
            ←
          </button>
          <span className="text-sm font-medium text-stone-500 min-w-[110px] text-center">{weekLabel()}</span>
          <button
            onClick={() => changeWeek(1)}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-stone-200 hover:bg-stone-100 transition-colors text-stone-500"
          >
            →
          </button>
          {weekOffset !== 0 && (
            <button
              onClick={() => { setWeekOffset(0); setFocusedDate(TODAY) }}
              className="text-xs px-2.5 py-1 rounded-lg border border-stone-200 hover:bg-stone-100 transition-colors text-stone-500"
            >
              Heute
            </button>
          )}
        </div>

        {/* View toggle */}
        <div className="flex rounded-lg border border-stone-200 overflow-hidden text-sm">
          <button
            onClick={() => setViewMode('day')}
            className={`px-3 py-1.5 transition-colors ${viewMode === 'day' ? 'bg-stone-800 text-white' : 'text-stone-500 hover:bg-stone-100'}`}
          >
            Tag
          </button>
          <button
            onClick={() => setViewMode('week')}
            className={`px-3 py-1.5 transition-colors ${viewMode === 'week' ? 'bg-stone-800 text-white' : 'text-stone-500 hover:bg-stone-100'}`}
          >
            Woche
          </button>
        </div>
      </div>

      {/* Day strip */}
      <div className="flex items-center gap-2 mb-5">
        <button
          onClick={goToPrevDay}
          className="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg border border-stone-200 hover:bg-stone-100 transition-colors text-stone-500"
        >
          ‹
        </button>
        <div className="flex-1 grid grid-cols-7 gap-1">
          {dates.map((date, i) => {
            const iso = toISODate(date)
            const isToday = iso === TODAY
            const isFocused = iso === focusedDate
            return (
              <button
                key={iso}
                onClick={() => setFocusedDate(iso)}
                className={`flex flex-col items-center py-1.5 rounded-xl text-xs font-medium transition-colors ${
                  isFocused
                    ? isToday ? 'bg-emerald-600 text-white' : 'bg-stone-800 text-white'
                    : isToday ? 'text-emerald-600 bg-emerald-50' : 'text-stone-500 hover:bg-stone-100'
                }`}
              >
                <span>{SHORT_DAYS[i]}</span>
                <span className={`text-[11px] mt-0.5 ${isFocused ? 'opacity-80' : 'opacity-60'}`}>
                  {date.getDate()}
                </span>
              </button>
            )
          })}
        </div>
        <button
          onClick={goToNextDay}
          className="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg border border-stone-200 hover:bg-stone-100 transition-colors text-stone-500"
        >
          ›
        </button>
      </div>

      {/* Cards */}
      <div className="grid gap-3">
        {visibleDates.map((date) => {
          const iso = toISODate(date)
          return (
            <div key={iso} ref={(el) => { cardRefs.current[iso] = el }}>
              <DayCard
                date={iso}
                label={formatDate(date)}
                isToday={iso === TODAY}
                isFocused={iso === focusedDate}
                onFocus={() => setFocusedDate(iso)}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}

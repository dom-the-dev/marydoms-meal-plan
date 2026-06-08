export function getWeekDates(weekOffset = 0): Date[] {
  const now = new Date()
  const monday = new Date(now)
  const day = now.getDay()
  const diff = day === 0 ? -6 : 1 - day
  monday.setDate(now.getDate() + diff + weekOffset * 7)
  monday.setHours(0, 0, 0, 0)

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return d
  })
}

export function toISODate(date: Date): string {
  return date.toISOString().split('T')[0]
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'short' })
}

export function uid(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

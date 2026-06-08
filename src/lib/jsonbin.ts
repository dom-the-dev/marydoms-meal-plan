import type { AppData } from '../types'

const BIN_ID = import.meta.env.VITE_JSONBIN_BIN_ID
const API_KEY = import.meta.env.VITE_JSONBIN_API_KEY
const BASE_URL = 'https://api.jsonbin.io/v3'

const headers = {
  'Content-Type': 'application/json',
  'X-Master-Key': API_KEY,
  'X-Bin-Versioning': 'false',
}

export async function loadData(): Promise<AppData> {
  const res = await fetch(`${BASE_URL}/b/${BIN_ID}/latest`, { headers })
  if (!res.ok) throw new Error(`JSONBin fetch failed: ${res.status}`)
  const json = await res.json()
  return json.record as AppData
}

export async function saveData(data: AppData): Promise<void> {
  const res = await fetch(`${BASE_URL}/b/${BIN_ID}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error(`JSONBin save failed: ${res.status}`)
}

export const EMPTY_DATA: AppData = { recipes: [], days: [] }

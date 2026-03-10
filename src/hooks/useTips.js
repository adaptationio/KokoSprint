const STORAGE_KEY = 'koko_dismissed_tips'

function readDismissed() {
  try { return new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')) }
  catch { return new Set() }
}

export function useTips() {
  function isDismissed(id) {
    return readDismissed().has(id)
  }
  function dismiss(id) {
    const set = readDismissed()
    set.add(id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]))
  }
  return { isDismissed, dismiss }
}

import { useState, useEffect, useCallback } from "react"

/* ═══════════════════════════════════════════════════
   useLocalStorage
   Drop-in replacement for useState that persists
   to localStorage automatically.

   Usage:
     const [value, setValue] = useLocalStorage("key", defaultValue)

   Features:
   - JSON serialize / deserialize automatically
   - Safe fallback if localStorage throws (private mode)
   - Syncs across tabs via "storage" event
   - Returns same [state, setState] API as useState
═══════════════════════════════════════════════════ */
export function useLocalStorage(key, initialValue) {
  /* ── Read once on mount ── */
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item !== null ? JSON.parse(item) : initialValue
    } catch {
      return initialValue
    }
  })

  /* ── Write to localStorage whenever value changes ── */
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue))
    } catch {
      /* localStorage full or private mode — fail silently */
    }
  }, [key, storedValue])

  /* ── Sync across browser tabs ── */
  useEffect(() => {
    function handleStorageEvent(e) {
      if (e.key !== key) return
      try {
        if (e.newValue !== null) {
          setStoredValue(JSON.parse(e.newValue))
        }
      } catch {}
    }
    window.addEventListener("storage", handleStorageEvent)
    return () => window.removeEventListener("storage", handleStorageEvent)
  }, [key])

  /* ── Setter — same API as useState (accepts value or updater fn) ── */
  const setValue = useCallback((value) => {
    setStoredValue(prev => {
      const next = typeof value === "function" ? value(prev) : value
      try {
        window.localStorage.setItem(key, JSON.stringify(next))
      } catch {}
      return next
    })
  }, [key])

  return [storedValue, setValue]
}

/* STORAGE_KEYS, clearAppStorage, clearHealthData ย้ายไปอยู่ที่ src/services/storage.js แล้ว */
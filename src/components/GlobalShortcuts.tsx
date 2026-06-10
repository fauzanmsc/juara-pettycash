"use client"

import { useEffect } from "react"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"

export function GlobalShortcuts() {
  const { theme, setTheme, systemTheme } = useTheme()
  const router = useRouter()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if Command (Mac) or Ctrl (Windows) is pressed
      if (e.metaKey || e.ctrlKey) {
        const key = e.key.toLowerCase()

        // Toggle Theme (Cmd/Ctrl + L)
        if (key === "l") {
          e.preventDefault()
          const currentTheme = theme === 'system' ? systemTheme : theme;
          setTheme(currentTheme === 'dark' ? 'light' : 'dark');
        }

        // Navigate to Pengeluaran (Cmd/Ctrl + I)
        if (key === "i") {
          e.preventDefault()
          router.push("/pengeluaran/baru")
        }

        // Navigate to Dashboard (Cmd/Ctrl + H)
        if (key === "h") {
          e.preventDefault()
          router.push("/dashboard")
        }

        // Logout (Cmd/Ctrl + X)
        if (key === "x") {
          e.preventDefault()
          window.dispatchEvent(new CustomEvent('open-logout-dialog'))
        }

        // Open Notifications (Cmd/Ctrl + N)
        if (key === "n") {
          e.preventDefault()
          window.dispatchEvent(new CustomEvent('open-notifications'))
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [theme, setTheme, systemTheme, router])

  return null
}

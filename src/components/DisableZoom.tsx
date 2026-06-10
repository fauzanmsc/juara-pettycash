"use client"

import { useEffect } from "react"

export function DisableZoom() {
  useEffect(() => {
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault()
      }
    }

    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault()
      }
    }

    document.addEventListener("touchmove", handleTouchMove, { passive: false })
    document.addEventListener("wheel", handleWheel, { passive: false })

    return () => {
      document.removeEventListener("touchmove", handleTouchMove)
      document.removeEventListener("wheel", handleWheel)
    }
  }, [])

  return null
}

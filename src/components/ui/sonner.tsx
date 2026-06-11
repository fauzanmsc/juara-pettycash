"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      richColors={true}
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white/90 group-[.toaster]:dark:bg-slate-900/90 group-[.toaster]:backdrop-blur-xl group-[.toaster]:text-slate-900 group-[.toaster]:dark:text-white group-[.toaster]:border-slate-200/50 group-[.toaster]:dark:border-slate-800/50 group-[.toaster]:shadow-[0_8px_30px_rgb(0,0,0,0.12)] group-[.toaster]:rounded-2xl group-[.toaster]:font-semibold px-5 py-4",
          description: "group-[.toast]:text-slate-500 group-[.toast]:dark:text-slate-400 font-medium",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground rounded-xl font-bold",
          cancelButton:
            "group-[.toast]:bg-slate-100 group-[.toast]:dark:bg-slate-800 group-[.toast]:text-slate-500 group-[.toast]:dark:text-slate-400 rounded-xl font-bold",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }

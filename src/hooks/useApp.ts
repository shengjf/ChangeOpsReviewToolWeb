import { useContext } from "react"
import { AppContext } from "@/context/AppContext"

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useApp必须在AppProvider内部使用")
  }
  return context
}

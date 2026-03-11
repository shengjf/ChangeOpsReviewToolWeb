import { AppProvider } from "@/context/AppContext"
import { AppContent } from "@/components/AppContent"

export function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  )
}

export default App

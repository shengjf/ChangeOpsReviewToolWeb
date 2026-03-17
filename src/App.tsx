import { AppProvider } from "@/context/AppContext"
import { AppContent } from "@/components/AppContent"
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom"
import { DocumentGenerationPage } from "@/components/features/DocumentGeneration"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/validation" replace />,
  },
  {
    path: "/validation",
    element: <AppContent />,
  },
  {
    path: "/generation",
    element: <DocumentGenerationPage />,
  },
])

export function App() {
  return (
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>
  )
}

export default App

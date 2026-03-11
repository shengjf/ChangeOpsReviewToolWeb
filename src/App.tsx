import { useState, useEffect } from "react"
import { AppProvider } from "@/context/AppContext"
import { Header } from "@/components/layout/Header"
import { Sidebar } from "@/components/layout/Sidebar"
import { FileUpload } from "@/components/upload/FileUpload"
import { ValidationResults } from "@/components/results/ValidationResults"
import { Loading } from "@/components/ui/loading"
import { ToastManager } from "@/components/ui/toast"
import { useApp } from "@/context/AppContext"
import type { ToastType } from "@/components/ui/toast"

interface ToastItem {
  id: string
  message: string
  type: ToastType
  duration: number
}

function AppContent() {
  const { state, clearError } = useApp()
  const [toasts, setToasts] = useState<ToastItem[]>([])

  // 监听错误状态并显示Toast
  useEffect(() => {
    if (state.error) {
      const timer = setTimeout(() => {
        const newToast: ToastItem = {
          id: Date.now().toString(),
          message: state.error || "发生未知错误",
          type: "error",
          duration: 5000,
        }
        setToasts((prev) => [...prev, newToast])
        clearError()
      }, 0)

      return () => clearTimeout(timer)
    }
  }, [state.error, clearError])

  // 监听校验完成并显示成功Toast
  useEffect(() => {
    if (!state.isLoading && state.validationResults.length > 0) {
      const timer = setTimeout(() => {
        const passedCount = state.validationResults.filter(
          (r) => r.status === "passed"
        ).length
        const failedCount = state.validationResults.filter(
          (r) => r.status === "failed"
        ).length

        if (passedCount > 0 || failedCount > 0) {
          const message =
            failedCount === 0
              ? `✅ 所有 ${passedCount} 个文档校验通过`
              : `📊 校验完成: ${passedCount} 个通过, ${failedCount} 个需要修正`

          const newToast: ToastItem = {
            id: Date.now().toString(),
            message,
            type: failedCount === 0 ? "success" : "info",
            duration: 4000,
          }
          setToasts((prev) => [...prev, newToast])
        }
      }, 100)

      return () => clearTimeout(timer)
    }
  }, [state.isLoading, state.validationResults])

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <div className="flex flex-1 flex-col lg:flex-row">
        <Sidebar />

        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="mx-auto flex h-full max-w-[2000px] flex-col">
            <div className="mb-6 md:mb-8">
              <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                变更文档审核工具
              </h1>
              <p className="mt-1 text-sm text-muted-foreground md:mt-2 md:text-base">
                自动化校验变更文档内容，确保符合规范要求
              </p>
            </div>

            <div className="flex flex-1 flex-col gap-6 md:gap-8 xl:flex-row">
              <div className="xl:flex-1">
                <FileUpload />
              </div>
              <div className="xl:flex-1">
                <ValidationResults />
              </div>
            </div>

            <div className="mt-auto border-t pt-6 md:pt-8">
              <div className="text-center text-xs text-muted-foreground md:text-sm">
                <p>
                  ChangeOps Review Tool • 版本 1.0.0 • 最后更新:{" "}
                  {new Date().toLocaleDateString()}
                </p>
                <p className="mt-1">
                  © 2025 上海ICNOC • 接入网与固网终端运行中心
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* 全局加载状态 */}
      {state.isLoading && (
        <Loading
          fullScreen
          text={state.files.length > 0 ? "正在校验文档..." : "正在上传文件..."}
        />
      )}

      {/* Toast通知 */}
      <ToastManager toasts={toasts} onRemove={removeToast} />
    </div>
  )
}

export function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  )
}

export default App

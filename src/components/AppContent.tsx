/**
 * 应用主内容组件
 */
import { useState, useEffect } from 'react'
import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'
import { FileUpload } from '@/components/upload/FileUpload'
import { ValidationResults } from '@/components/results/ValidationResults'
import { Loading } from '@/components/ui/loading'
import { ToastManager } from '@/components/ui/toast'
import { useApp } from '@/context/AppContext'
import type { ToastItem } from '@/types/toast'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, Loader2 } from 'lucide-react'

export function AppContent() {
  const { state, clearError, validateAll } = useApp()
  const [toasts, setToasts] = useState<ToastItem[]>([])

  // 监听错误状态并显示Toast
  useEffect(() => {
    if (state.error) {
      const timer = setTimeout(() => {
        const newToast: ToastItem = {
          id: Date.now().toString(),
          message: state.error || "发生未知错误",
          type: "error",
          duration: 6000,
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
          (r) => r.status === 'passed'
        ).length
        const failedCount = state.validationResults.filter(
          (r) => r.status === 'failed'
        ).length

        if (passedCount > 0 || failedCount > 0) {
          const message =
            failedCount === 0
              ? `所有 ${passedCount} 个文档校验通过`
              : `校验完成: ${passedCount} 个通过, ${failedCount} 个需要修正`

          const newToast: ToastItem = {
            id: Date.now().toString(),
            message,
            type: failedCount === 0 ? "success" : "info",
            duration: 6000,
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

  // 判断当前状态：初始状态还是有文件已上传
  const hasFiles = state.files.length > 0
  const hasValidationResults = state.validationResults.length > 0

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <div className="flex flex-1 flex-col lg:flex-row">
        <Sidebar />

        <div className="flex flex-1 flex-col lg:ml-64">
          <main className="flex-1 p-4 md:p-6 lg:p-8">
            <div className="mx-auto max-w-[2000px]">
              {/* 页面标题 - 始终显示 */}
              <div className="mb-6 md:mb-8">
                <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                  变更文档审核工具
                </h1>
                <p className="mt-1 text-sm text-muted-foreground md:mt-2 md:text-base">
                  自动化校验变更文档内容，确保符合规范要求
                </p>
              </div>

              {/* 状态1: 初始状态 - 只显示上传区域居中 */}
              {!hasFiles && !hasValidationResults && (
                <div className="flex flex-1 items-center justify-center py-8">
                  <div className="w-full max-w-2xl">
                    <FileUpload compact={false} disableNewUpload={false} />
                  </div>
                </div>
              )}

              {/* 状态2: 有文件但未校验 - 上传区域在上，预留结果区域在下 */}
              {hasFiles && !hasValidationResults && (
                <div className="mx-auto w-full max-w-4xl">
                  <div className="flex flex-col gap-6 md:gap-8">
                    {/* 上传区域 - 紧凑显示 */}
                    <div className="w-full">
                      <FileUpload compact={true} disableNewUpload={false} />
                    </div>

                    {/* 预留的结果区域 - 显示提示 */}
                    <div className="flex-1">
                      <Card>
                        <CardHeader>
                          <CardTitle>校验结果</CardTitle>
                          <CardDescription>
                            点击"开始校验"按钮后，结果将显示在这里
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="py-12 text-center">
                          <CheckCircle className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                          <h3 className="mb-2 text-lg font-medium">等待校验</h3>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              )}

              {/* 状态3: 有校验结果 - 上下布局 */}
              {hasValidationResults && (
                <div className="mx-auto w-full max-w-4xl">
                  <div className="flex flex-col gap-6 md:gap-8">
                    {/* 上传区域 - 紧凑显示，禁止新增上传 */}
                    <div className="w-full">
                      <FileUpload compact={true} disableNewUpload={true} />
                    </div>

                    {/* 校验结果区域 */}
                    <div className="flex-1">
                      <ValidationResults />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </main>

          {/* 页脚 */}
          <div className="border-t p-6 md:pt-8">
            <div className="mx-auto max-w-[2000px]">
              <div className="text-center text-xs text-muted-foreground md:text-sm">
                <p>
                  ChangeOps Review Tool • 版本 1.0.0 • 最后更新: {new Date().toLocaleDateString()}
                </p>
                <p className="mt-1">
                  © 2025 上海ICNOC • 接入网与固网终端运行中心
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 全局加载状态 */}
      {state.isLoading && (
        <Loading
          fullScreen
          text={state.files.length > 0 ? '正在校验文档...' : '正在上传文件...'}
        />
      )}

      {/* Toast通知 */}
      <ToastManager toasts={toasts} onRemove={removeToast} />
    </div>
  )
}

/**
 * 侧边栏组件
 */
import {
  Upload,
  CheckCircle,
  AlertCircle,
  FileText,
  Download,
  History,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useApp } from "@/hooks/useApp"

export function Sidebar() {
  const { state, setFilter } = useApp()

  const totalFiles = state.files.length
  const passedFiles = state.validationResults.filter(
    (r) => r.status === "passed"
  ).length
  const failedFiles = state.validationResults.filter(
    (r) => r.status === "failed"
  ).length

  return (
    <aside className="w-full border-b bg-muted/10 lg:fixed lg:top-16 lg:left-0 lg:h-[calc(100vh-4rem)] lg:w-64 lg:overflow-y-auto lg:border-r lg:border-b-0">
      <div className="p-4 md:p-6">
        <h2 className="mb-4 text-lg font-semibold">操作面板</h2>

        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              快速操作
            </h3>
            <div className="grid grid-cols-2 gap-2 lg:grid-cols-1">
              <Button
                className="w-full justify-start"
                variant="outline"
                size="sm"
              >
                <Upload className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">上传新文档</span>
                <span className="sm:hidden">上传</span>
              </Button>
              <Button
                className="w-full justify-start"
                variant="outline"
                size="sm"
              >
                <FileText className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">使用模板</span>
                <span className="sm:hidden">模板</span>
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              筛选结果
            </h3>
            <div className="grid grid-cols-3 gap-1 lg:grid-cols-1">
              <Button
                variant="ghost"
                className="w-full justify-start"
                size="sm"
                onClick={() => setFilter({ status: "all" })}
              >
                <FileText className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">全部文件</span>
                <Badge variant="outline" className="ml-auto text-xs">
                  {totalFiles}
                </Badge>
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                size="sm"
                onClick={() => setFilter({ status: "passed" })}
              >
                <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                <span className="hidden sm:inline">校验通过</span>
                <Badge variant="success" className="ml-auto text-xs">
                  {passedFiles}
                </Badge>
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                size="sm"
                onClick={() => setFilter({ status: "failed" })}
              >
                <AlertCircle className="mr-2 h-4 w-4 text-red-500" />
                <span className="hidden sm:inline">需要修正</span>
                <Badge variant="destructive" className="ml-auto text-xs">
                  {failedFiles}
                </Badge>
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              导出选项
            </h3>
            <div className="grid grid-cols-2 gap-2 lg:grid-cols-1">
              <Button
                className="w-full justify-start"
                variant="outline"
                size="sm"
              >
                <Download className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">下载报告</span>
                <span className="sm:hidden">报告</span>
              </Button>
              <Button
                className="w-full justify-start"
                variant="outline"
                size="sm"
              >
                <History className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">查看历史</span>
                <span className="sm:hidden">历史</span>
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-6 border-t pt-4">
          <h3 className="mb-2 text-sm font-medium text-muted-foreground">
            统计信息
          </h3>
          <div className="grid grid-cols-3 gap-2 text-sm lg:grid-cols-1">
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">总文件数</span>
              <span className="font-medium">{totalFiles}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">通过率</span>
              <span className="font-medium">
                {totalFiles > 0
                  ? Math.round((passedFiles / totalFiles) * 100)
                  : 0}
                %
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">平均错误</span>
              <span className="font-medium">
                {state.validationResults.length > 0
                  ? (
                      state.validationResults.reduce(
                        (acc, r) => acc + r.errors.length,
                        0
                      ) / state.validationResults.length
                    ).toFixed(1)
                  : "0.0"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}

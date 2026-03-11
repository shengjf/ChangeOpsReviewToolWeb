/**
 * 校验结果展示组件
 */
import { useState } from "react"
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  FileText,
  Download,
  Filter,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useApp } from "@/context/AppContext"

export function ValidationResults() {
  const { state, setFilter } = useApp()
  const [expandedFiles, setExpandedFiles] = useState<Set<string>>(new Set())

  /**
   * 切换文件展开状态
   */
  const toggleFileExpansion = (fileId: string) => {
    const newExpanded = new Set(expandedFiles)
    if (newExpanded.has(fileId)) {
      newExpanded.delete(fileId)
    } else {
      newExpanded.add(fileId)
    }
    setExpandedFiles(newExpanded)
  }

  /**
   * 根据筛选条件过滤结果
   */
  const filteredResults = state.validationResults.filter((result) => {
    if (state.filter.status === "all") return true
    if (state.filter.status === "passed") return result.status === "passed"
    if (state.filter.status === "failed") return result.status === "failed"
    return true
  })

  /**
   * 获取状态图标
   */
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "passed":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "failed":
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
    }
  }

  /**
   * 获取严重性徽章
   */
  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "error":
        return <Badge variant="destructive">错误</Badge>
      case "warning":
        return <Badge variant="warning">警告</Badge>
      case "info":
        return <Badge variant="secondary">提示</Badge>
      default:
        return <Badge variant="outline">{severity}</Badge>
    }
  }

  /**
   * 导出报告
   */
  const handleExportReport = () => {
    // TODO: 实现报告导出功能
    alert("报告导出功能将在后续版本中实现")
  }

  if (state.validationResults.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>校验结果</CardTitle>
          <CardDescription>
            上传文档并开始校验后，结果将显示在这里
          </CardDescription>
        </CardHeader>
        <CardContent className="py-12 text-center">
          <FileText className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="mb-2 text-lg font-medium">暂无校验结果</h3>
          <p className="text-sm text-muted-foreground">
            请先上传文档并点击"开始校验"按钮
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* 结果概览 */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-lg md:text-xl">校验结果概览</CardTitle>
              <CardDescription className="mt-1">
                共校验 {state.validationResults.length} 个文档 •{" "}
                {filteredResults.length} 个符合筛选条件
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="text-xs sm:text-sm"
                onClick={() => {
                  // 切换筛选状态
                  const nextStatus =
                    state.filter.status === "all"
                      ? "passed"
                      : state.filter.status === "passed"
                        ? "failed"
                        : "all"
                  setFilter({ status: nextStatus })
                }}
              >
                <Filter className="mr-1.5 h-3.5 w-3.5 sm:mr-2 sm:h-4 sm:w-4" />
                {state.filter.status === "all"
                  ? "全部"
                  : state.filter.status === "passed"
                    ? "通过"
                    : "失败"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-xs sm:text-sm"
                onClick={handleExportReport}
              >
                <Download className="mr-1.5 h-3.5 w-3.5 sm:mr-2 sm:h-4 sm:w-4" />
                导出
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 grid grid-cols-3 gap-3">
            <div className="rounded-lg border p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">总文档</p>
                  <p className="text-xl font-bold sm:text-2xl">
                    {state.validationResults.length}
                  </p>
                </div>
                <FileText className="h-6 w-6 text-blue-500 sm:h-8 sm:w-8" />
              </div>
            </div>

            <div className="rounded-lg border p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">通过</p>
                  <p className="text-xl font-bold text-green-600 sm:text-2xl">
                    {
                      state.validationResults.filter(
                        (r) => r.status === "passed"
                      ).length
                    }
                  </p>
                </div>
                <CheckCircle className="h-6 w-6 text-green-500 sm:h-8 sm:w-8" />
              </div>
            </div>

            <div className="rounded-lg border p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">失败</p>
                  <p className="text-xl font-bold text-red-600 sm:text-2xl">
                    {
                      state.validationResults.filter(
                        (r) => r.status === "failed"
                      ).length
                    }
                  </p>
                </div>
                <XCircle className="h-6 w-6 text-red-500 sm:h-8 sm:w-8" />
              </div>
            </div>
          </div>

          {/* 快速筛选标签 */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={state.filter.status === "all" ? "default" : "outline"}
              size="sm"
              className="text-xs"
              onClick={() => setFilter({ status: "all" })}
            >
              全部 ({state.validationResults.length})
            </Button>
            <Button
              variant={state.filter.status === "passed" ? "default" : "outline"}
              size="sm"
              className="text-xs"
              onClick={() => setFilter({ status: "passed" })}
            >
              通过 (
              {
                state.validationResults.filter((r) => r.status === "passed")
                  .length
              }
              )
            </Button>
            <Button
              variant={state.filter.status === "failed" ? "default" : "outline"}
              size="sm"
              className="text-xs"
              onClick={() => setFilter({ status: "failed" })}
            >
              失败 (
              {
                state.validationResults.filter((r) => r.status === "failed")
                  .length
              }
              )
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 详细结果列表 */}
      <Card>
        <CardHeader>
          <CardTitle>详细校验结果</CardTitle>
          <CardDescription>
            点击文档名称查看详细错误信息 • 共 {filteredResults.length} 个文档
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredResults.length === 0 ? (
            <div className="py-8 text-center">
              <FileText className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-medium">无匹配结果</h3>
              <p className="text-sm text-muted-foreground">
                当前筛选条件下没有匹配的文档
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredResults.map((result) => (
                <div
                  key={result.fileId}
                  className="overflow-hidden rounded-lg border"
                >
                  {/* 文件头 */}
                  <div
                    className="flex cursor-pointer items-center justify-between p-4 transition-colors hover:bg-muted/50"
                    onClick={() => toggleFileExpansion(result.fileId)}
                  >
                    <div className="flex items-center gap-3">
                      {expandedFiles.has(result.fileId) ? (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      )}
                      {getStatusIcon(result.status)}
                      <div className="min-w-0 flex-1">
                        <h4 className="truncate font-medium">
                          {result.fileName}
                        </h4>
                        <p className="truncate text-sm text-muted-foreground">
                          校验时间: {result.validatedAt.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {result.status === "passed" ? (
                        <Badge variant="success" className="gap-1">
                          <CheckCircle className="h-3 w-3" />
                          校验通过
                        </Badge>
                      ) : (
                        <Badge variant="destructive" className="gap-1">
                          <XCircle className="h-3 w-3" />
                          {result.errors.length} 个问题
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* 错误详情 */}
                  {expandedFiles.has(result.fileId) &&
                    result.errors.length > 0 && (
                      <div className="border-t bg-muted/10 p-4">
                        <h5 className="mb-3 text-sm font-medium">
                          发现的问题:
                        </h5>
                        <div className="space-y-3">
                          {result.errors.map((error) => (
                            <div
                              key={error.id}
                              className="rounded-lg border bg-background p-3"
                            >
                              <div className="mb-2 flex items-start justify-between">
                                <div className="flex items-center gap-2">
                                  {getSeverityBadge(error.severity)}
                                  <span className="text-sm font-medium">
                                    {error.location}
                                  </span>
                                </div>
                              </div>
                              <p className="mb-2 text-sm">
                                {error.description}
                              </p>
                              {error.suggestion && (
                                <div className="rounded bg-muted/30 p-2 text-sm text-muted-foreground">
                                  <span className="font-medium">建议: </span>
                                  {error.suggestion}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* 通过状态 */}
                  {expandedFiles.has(result.fileId) &&
                    result.errors.length === 0 && (
                      <div className="border-t bg-green-50 p-4 dark:bg-green-950/20">
                        <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                          <CheckCircle className="h-5 w-5" />
                          <span className="font-medium">
                            文档校验通过，无需修正
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-green-600 dark:text-green-400">
                          所有内容符合规范要求，可以继续后续流程
                        </p>
                      </div>
                    )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

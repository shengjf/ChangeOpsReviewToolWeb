/**
 * 文件上传组件
 */
import { useState, useCallback } from "react"
import {
  Upload,
  X,
  FileText,
  FileSpreadsheet,
  CheckCircle,
  AlertCircle,
  Loader2,
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
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useApp } from "@/context/AppContext"

export function FileUpload() {
  const { state, uploadFiles, validateAll, removeFile } = useApp()
  const [dragActive, setDragActive] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])

  /**
   * 处理文件选择
   */
  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files) return

    const validFiles = Array.from(files).filter((file) => {
      const validTypes = [
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ]
      return validTypes.includes(file.type)
    })

    setSelectedFiles((prev) => [...prev, ...validFiles])
  }, [])

  /**
   * 处理拖拽事件
   */
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  /**
   * 处理文件放置
   */
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setDragActive(false)

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFileSelect(e.dataTransfer.files)
      }
    },
    [handleFileSelect]
  )

  /**
   * 处理上传
   */
  const handleUpload = useCallback(async () => {
    if (selectedFiles.length === 0) return

    try {
      await uploadFiles(selectedFiles)
      setSelectedFiles([])
    } catch (error) {
      // 错误已在context中处理
      console.error("上传失败:", error)
    }
  }, [selectedFiles, uploadFiles])

  /**
   * 处理文件输入点击
   */
  const handleFileInputClick = useCallback(() => {
    const input = document.getElementById("file-input")
    if (input) {
      input.click()
    }
  }, [])

  /**
   * 处理文件输入变化
   */
  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFileSelect(e.target.files)
      // 重置input值，允许选择相同文件
      e.target.value = ""
    },
    [handleFileSelect]
  )

  /**
   * 移除选择的文件
   */
  const handleRemoveSelected = useCallback((index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
  }, [])

  /**
   * 获取文件图标
   */
  const getFileIcon = (type: string) => {
    if (type.includes("word"))
      return <FileText className="h-5 w-5 text-blue-500" />
    if (type.includes("excel") || type.includes("spreadsheet"))
      return <FileSpreadsheet className="h-5 w-5 text-green-500" />
    return <FileText className="h-5 w-5 text-gray-500" />
  }

  /**
   * 格式化文件大小
   */
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="space-y-6">
      {/* 上传区域 */}
      <Card>
        <CardHeader>
          <CardTitle>上传变更文档</CardTitle>
          <CardDescription>
            支持 .doc, .docx, .xlsx, .xls 格式，可一次上传多个文件
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={`cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition-colors md:p-8 ${
              dragActive
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25 hover:border-primary/50"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={handleFileInputClick}
          >
            <Upload className="mx-auto mb-3 h-10 w-10 text-muted-foreground md:mb-4 md:h-12 md:w-12" />
            <h3 className="mb-2 text-base font-medium md:text-lg">
              拖放文件到此处或点击选择
            </h3>
            <p className="mb-4 text-xs text-muted-foreground md:text-sm">
              支持 Microsoft Word (.doc, .docx) 和 Excel (.xls, .xlsx) 文档
            </p>
            <Button variant="outline" size="sm" className="text-sm">
              <Upload className="mr-2 h-4 w-4" />
              选择文件
            </Button>
            <input
              id="file-input"
              type="file"
              multiple
              accept=".doc,.docx,.xlsx,.xls"
              className="hidden"
              onChange={handleFileInputChange}
            />
          </div>

          {/* 错误提示 */}
          {state.error && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          )}

          {/* 选择的文件列表 */}
          {selectedFiles.length > 0 && (
            <div className="mt-6">
              <div className="mb-3 flex items-center justify-between">
                <h4 className="text-sm font-medium">
                  已选择文件 ({selectedFiles.length})
                </h4>
                {selectedFiles.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedFiles([])}
                    disabled={state.isLoading}
                    className="h-7 text-xs"
                  >
                    清空全部
                  </Button>
                )}
              </div>

              {selectedFiles.length > 0 ? (
                <>
                  <div className="max-h-60 space-y-2 overflow-y-auto">
                    {selectedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          {getFileIcon(file.type)}
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium">
                              {file.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatFileSize(file.size)} •{" "}
                              {file.type.split("/")[1].toUpperCase()}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 flex-shrink-0"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleRemoveSelected(index)
                          }}
                        >
                          <X className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                    <Button
                      onClick={handleUpload}
                      disabled={state.isLoading}
                      className="flex-1"
                      size="sm"
                    >
                      {state.isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          上传中...
                        </>
                      ) : (
                        <>
                          <Upload className="mr-2 h-4 w-4" />
                          上传文件 ({selectedFiles.length})
                        </>
                      )}
                    </Button>
                  </div>
                </>
              ) : (
                <div className="rounded-lg border border-dashed p-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    暂无选择的文件
                  </p>
                </div>
              )}
            </div>
          )}

          {/* 已上传文件列表 */}
          {state.files.length > 0 && (
            <div className="mt-6">
              <div className="mb-3 flex items-center justify-between">
                <h4 className="text-sm font-medium">
                  已上传文件 ({state.files.length})
                </h4>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={validateAll}
                    disabled={state.isLoading || state.files.length === 0}
                    className="text-sm"
                  >
                    {state.isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        校验中...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        开始校验
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <div className="max-h-60 space-y-2 overflow-y-auto">
                {state.files.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      {getFileIcon(file.type)}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">
                          {file.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatFileSize(file.size)} •{" "}
                          {file.uploadedAt?.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          file.uploadStatus === "completed"
                            ? "success"
                            : file.uploadStatus === "uploading"
                              ? "warning"
                              : file.uploadStatus === "failed"
                                ? "destructive"
                                : "secondary"
                        }
                        className="text-xs"
                      >
                        {file.uploadStatus === "completed"
                          ? "已上传"
                          : file.uploadStatus === "uploading"
                            ? "上传中"
                            : file.uploadStatus === "failed"
                              ? "失败"
                              : "等待"}
                      </Badge>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => removeFile(file.id)}
                        disabled={state.isLoading}
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {state.files.length > 0 && (
                <div className="mt-3 text-center">
                  <p className="text-xs text-muted-foreground">
                    点击"开始校验"按钮对 {state.files.length}{" "}
                    个文件进行自动化校验
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 使用说明 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">使用说明</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-start gap-2">
            <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
            <span>系统会自动校验文档格式、必填字段、数据一致性等</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
            <span>支持批量上传和校验，提高工作效率</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
            <span>校验结果会详细指出错误位置和建议修正方案</span>
          </div>
          <div className="flex items-start gap-2">
            <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-yellow-500" />
            <span>建议在上传前确保文档格式正确，避免常见错误</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

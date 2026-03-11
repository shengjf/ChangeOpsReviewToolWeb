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
import { useApp } from "@/hooks/useApp"

interface FileUploadProps {
  compact?: boolean
  disableNewUpload?: boolean
}

export function FileUpload({
  compact = false,
  disableNewUpload = false,
}: FileUploadProps) {
  const { state, uploadFiles, validateAll, removeFile } = useApp()
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
   * 处理上传
   */
  const handleUpload = useCallback(async () => {
    if (selectedFiles.length === 0) return

    try {
      await uploadFiles(selectedFiles)
      setSelectedFiles([])
    } catch (error) {
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

  // 紧凑模式：显示已上传文件列表和操作按钮
  if (compact && state.files.length > 0) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-lg">已上传文件</CardTitle>
              <CardDescription>
                共 {state.files.length} 个文件 •{" "}
                {disableNewUpload ? "校验完成" : "等待校验"}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {!disableNewUpload && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleFileInputClick}
                    disabled={state.isLoading}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    添加文件
                  </Button>
                  <Button
                    onClick={validateAll}
                    disabled={state.isLoading}
                    size="sm"
                  >
                    {state.isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        校验中
                      </>
                    ) : (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        开始校验
                      </>
                    )}
                  </Button>
                </>
              )}
            </div>
          </div>
          <input
            id="file-input"
            type="file"
            multiple
            accept=".doc,.docx,.xlsx,.xls"
            className="hidden"
            onChange={handleFileInputChange}
            disabled={disableNewUpload || state.isLoading}
          />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {state.files.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div className="flex min-w-0 items-center gap-3">
                  {getFileIcon(file.type)}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(file.size)}
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
                    disabled={state.isLoading || disableNewUpload}
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          {!disableNewUpload && state.files.length > 0 && (
            <div className="mt-4 text-center">
              <p className="text-xs text-muted-foreground">
                点击"开始校验"按钮对 {state.files.length} 个文件进行自动化校验
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  // 完整模式：显示完整上传界面（初始状态）
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>上传变更文档</CardTitle>
        <CardDescription>
          支持 .doc, .docx, .xlsx, .xls 格式，可一次上传多个文件
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 上传区域 */}
        <div
          className="cursor-pointer rounded-lg border-2 border-dashed border-muted-foreground/25 p-8 text-center transition-colors hover:border-primary/50 hover:bg-primary/5"
          onClick={handleFileInputClick}
        >
          <Upload className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="mb-2 text-lg font-medium">拖放文件到此处或点击选择</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            支持 Microsoft Word (.doc, .docx) 和 Excel (.xls, .xlsx) 文档
          </p>
          <input
            id="file-input"
            type="file"
            multiple
            accept=".doc,.docx,.xlsx,.xls"
            className="hidden"
            onChange={handleFileInputChange}
          />
        </div>

        {/* 选择的文件列表 */}
        {selectedFiles.length > 0 && (
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h4 className="text-sm font-medium">
                已选择文件 ({selectedFiles.length})
              </h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedFiles([])}
                disabled={state.isLoading}
              >
                清空全部
              </Button>
            </div>

            <div className="space-y-2">
              {selectedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="flex items-center gap-3">
                    {getFileIcon(file.type)}
                    <div>
                      <p className="text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(file.size)} •{" "}
                        {file.type.split("/")[1].toUpperCase()}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRemoveSelected(index)
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <Button
                onClick={handleUpload}
                disabled={state.isLoading}
                className="w-full"
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
          </div>
        )}

        {/* 使用说明 */}
        <div className="rounded-lg bg-muted/30 p-4">
          <h4 className="mb-2 text-sm font-medium">使用说明</h4>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
              <span>系统会自动校验文档格式、必填字段、数据一致性</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
              <span>支持批量上传和校验，提高工作效率</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
              <span>校验结果会详细指出错误位置和建议修正方案</span>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

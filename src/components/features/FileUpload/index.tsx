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
  Clock,
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
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useApp } from "@/hooks/useApp"
import type { ChangeLevel, FileCategory } from "@/context/AppContext"

interface FileUploadProps {
  compact?: boolean
  disableNewUpload?: boolean
}

interface FileWithCategory {
  file: File
  category: FileCategory
}

const REQUIRED_CATEGORIES: FileCategory[] = ["割接方案", "告警屏蔽表"]
const OPTIONAL_CATEGORIES: FileCategory[] = [
  "卓越工程师持证情况",
  "服务风险告知",
  "用户公告",
]

const CHANGE_LEVELS: ChangeLevel[] = ["一级", "二级", "三级", "四级", "五级"]

export function FileUpload({
  compact = false,
  disableNewUpload = false,
}: FileUploadProps) {
  const {
    state,
    uploadFiles,
    validateAll,
    removeFile,
    setChangeTimeStart,
    setChangeTimeEnd,
    setChangeLevel,
    addUploadedCategory,
  } = useApp()
  const [selectedFiles, setSelectedFiles] = useState<FileWithCategory[]>([])
  const [formErrors, setFormErrors] = useState<{
    changeTimeStart?: string
    changeTimeEnd?: string
    changeLevel?: string
    requiredFiles?: string
  }>({})

  const validateForm = useCallback((): boolean => {
    const errors: typeof formErrors = {}

    if (!state.changeTimeStart) {
      errors.changeTimeStart = "请选择变更开始时间"
    }

    if (!state.changeTimeEnd) {
      errors.changeTimeEnd = "请选择变更结束时间"
    }

    if (state.changeTimeStart && state.changeTimeEnd) {
      if (new Date(state.changeTimeStart) >= new Date(state.changeTimeEnd)) {
        errors.changeTimeEnd = "结束时间必须晚于开始时间"
      }
    }

    if (!state.changeLevel) {
      errors.changeLevel = "请选择变更等级"
    }

    const hasCutoverPlan = selectedFiles.some((f) => f.category === "割接方案")
    const hasAlarmTable = selectedFiles.some((f) => f.category === "告警屏蔽表")

    if (!hasCutoverPlan || !hasAlarmTable) {
      errors.requiredFiles = "必须上传《割接方案》和《告警屏蔽表》"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }, [
    state.changeTimeStart,
    state.changeTimeEnd,
    state.changeLevel,
    selectedFiles,
  ])

  const handleFileSelect = useCallback(
    (files: FileList | null, category: FileCategory) => {
      if (!files) return

      const validFiles = Array.from(files).filter((file) => {
        const validTypes = [
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        ]
        return validTypes.includes(file.type)
      })

      setSelectedFiles((prev) => [
        ...prev,
        ...validFiles.map((file) => ({ file, category })),
      ])
    },
    []
  )

  const handleUpload = useCallback(async () => {
    if (!validateForm()) return

    const filesToUpload = selectedFiles.map((f) => f.file)
    if (filesToUpload.length === 0) return

    try {
      await uploadFiles(filesToUpload)
      selectedFiles.forEach((f) => addUploadedCategory(f.category))
      setSelectedFiles([])
    } catch (error) {
      console.error("上传失败:", error)
    }
  }, [selectedFiles, uploadFiles, validateForm, addUploadedCategory])

  const handleRemoveSelected = useCallback((index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const getFileIcon = (type: string) => {
    if (type.includes("word"))
      return <FileText className="h-5 w-5 text-blue-500" />
    if (type.includes("excel") || type.includes("spreadsheet"))
      return <FileSpreadsheet className="h-5 w-5 text-green-500" />
    return <FileText className="h-5 w-5 text-gray-500" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const isCategoryUploaded = (category: FileCategory) => {
    return state.uploadedCategories.includes(category)
  }

  const getFilesByCategory = (category: FileCategory) => {
    return selectedFiles.filter((f) => f.category === category)
  }

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
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4" />
                <span>变更时间段：</span>
                <span className="font-medium">
                  {state.changeTimeStart || "未设置"} 至{" "}
                  {state.changeTimeEnd || "未设置"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span>变更等级：</span>
                <Badge variant="outline">{state.changeLevel || "未设置"}</Badge>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="text-sm font-medium">已上传文件类别：</div>
              <div className="flex flex-wrap gap-2">
                {state.uploadedCategories.map((category) => (
                  <Badge key={category} variant="secondary">
                    {category}
                  </Badge>
                ))}
              </div>
            </div>

            {!disableNewUpload &&
              OPTIONAL_CATEGORIES.some((cat) => !isCategoryUploaded(cat)) && (
                <div className="mt-4 rounded-lg border p-4">
                  <h4 className="mb-3 text-sm font-medium">补充可选文件</h4>
                  <div className="flex flex-col gap-3">
                    {OPTIONAL_CATEGORIES.filter(
                      (cat) => !isCategoryUploaded(cat)
                    ).map((category) => (
                      <div key={category} className="flex items-center gap-2">
                        <Label className="flex-1 text-sm">{category}</Label>
                        <input
                          id={`file-input-optional-${category}`}
                          type="file"
                          accept=".doc,.docx,.xlsx,.xls"
                          className="hidden"
                          onChange={(e) =>
                            handleFileSelect(e.target.files, category)
                          }
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const input = document.getElementById(
                              `file-input-optional-${category}`
                            ) as HTMLInputElement
                            if (input) input.click()
                          }}
                          disabled={state.isLoading}
                        >
                          <Upload className="mr-2 h-3 w-3" />
                          上传
                        </Button>
                      </div>
                    ))}
                  </div>

                  {selectedFiles.filter((f) =>
                    OPTIONAL_CATEGORIES.includes(f.category)
                  ).length > 0 && (
                    <div className="mt-4">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-sm font-medium">
                          已选择补充文件
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setSelectedFiles((prev) =>
                              prev.filter(
                                (f) => !OPTIONAL_CATEGORIES.includes(f.category)
                              )
                            )
                          }
                        >
                          清空
                        </Button>
                      </div>
                      <div className="flex flex-col gap-2">
                        {selectedFiles
                          .filter((f) =>
                            OPTIONAL_CATEGORIES.includes(f.category)
                          )
                          .map((fileWithCat, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between rounded-lg border p-2 text-sm"
                            >
                              <div className="flex items-center gap-2">
                                {getFileIcon(fileWithCat.file.type)}
                                <span>{fileWithCat.file.name}</span>
                                <Badge variant="outline" className="text-xs">
                                  {fileWithCat.category}
                                </Badge>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => {
                                  const originalIndex = selectedFiles.findIndex(
                                    (f) => f === fileWithCat
                                  )
                                  handleRemoveSelected(originalIndex)
                                }}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                      </div>
                      <Button
                        className="mt-3 w-full"
                        size="sm"
                        onClick={handleUpload}
                        disabled={state.isLoading}
                      >
                        {state.isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            上传中...
                          </>
                        ) : (
                          <>
                            <Upload className="mr-2 h-4 w-4" />
                            上传补充文件
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              )}

            <div className="flex flex-col gap-2">
              {state.files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    {getFileIcon(file.type)}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {file.name}
                      </p>
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

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>上传变更文档</CardTitle>
        <CardDescription>
          请填写变更信息并上传必要文件，支持 .doc, .docx, .xlsx, .xls 格式
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 md:flex-row">
              <Field className="flex-1">
                <FieldLabel htmlFor="change-time-start">
                  变更开始时间 *
                </FieldLabel>
                <Input
                  id="change-time-start"
                  type="datetime-local"
                  value={state.changeTimeStart}
                  onChange={(e) => setChangeTimeStart(e.target.value)}
                  aria-invalid={!!formErrors.changeTimeStart}
                />
                {formErrors.changeTimeStart && (
                  <FieldDescription className="text-destructive">
                    {formErrors.changeTimeStart}
                  </FieldDescription>
                )}
              </Field>

              <Field className="flex-1">
                <FieldLabel htmlFor="change-time-end">
                  变更结束时间 *
                </FieldLabel>
                <Input
                  id="change-time-end"
                  type="datetime-local"
                  value={state.changeTimeEnd}
                  onChange={(e) => setChangeTimeEnd(e.target.value)}
                  aria-invalid={!!formErrors.changeTimeEnd}
                />
                {formErrors.changeTimeEnd && (
                  <FieldDescription className="text-destructive">
                    {formErrors.changeTimeEnd}
                  </FieldDescription>
                )}
              </Field>
            </div>

            <Field>
              <FieldLabel>变更等级 *</FieldLabel>
              <RadioGroup
                value={state.changeLevel || ""}
                onValueChange={(value) => setChangeLevel(value as ChangeLevel)}
                className="flex flex-wrap gap-4"
              >
                {CHANGE_LEVELS.map((level) => (
                  <div key={level} className="flex items-center gap-2">
                    <RadioGroupItem value={level} id={`level-${level}`} />
                    <Label htmlFor={`level-${level}`}>{level}</Label>
                  </div>
                ))}
              </RadioGroup>
              {formErrors.changeLevel && (
                <FieldDescription className="text-destructive">
                  {formErrors.changeLevel}
                </FieldDescription>
              )}
            </Field>

            <div className="mt-4">
              <h4 className="mb-3 text-sm font-medium">强制上传文件 *</h4>
              <div className="flex flex-col gap-4">
                {REQUIRED_CATEGORIES.map((category) => {
                  const files = getFilesByCategory(category)
                  return (
                    <div key={category} className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm">{category}</Label>
                        <input
                          id={`file-input-${category}`}
                          type="file"
                          accept=".doc,.docx,.xlsx,.xls"
                          className="hidden"
                          onChange={(e) =>
                            handleFileSelect(e.target.files, category)
                          }
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const input = document.getElementById(
                              `file-input-${category}`
                            ) as HTMLInputElement
                            if (input) input.click()
                          }}
                          disabled={state.isLoading}
                        >
                          <Upload className="mr-2 h-3 w-3" />
                          选择文件
                        </Button>
                      </div>
                      {files.length > 0 && (
                        <div className="flex flex-col gap-1">
                          {files.map((fileWithCat, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between rounded border p-2 text-sm"
                            >
                              <div className="flex items-center gap-2">
                                {getFileIcon(fileWithCat.file.type)}
                                <span className="truncate">
                                  {fileWithCat.file.name}
                                </span>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => {
                                  const originalIndex = selectedFiles.findIndex(
                                    (f) => f === fileWithCat
                                  )
                                  handleRemoveSelected(originalIndex)
                                }}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
              {formErrors.requiredFiles && (
                <FieldDescription className="mt-2 text-destructive">
                  {formErrors.requiredFiles}
                </FieldDescription>
              )}
            </div>

            <div className="mt-4">
              <h4 className="mb-3 text-sm font-medium">可选上传文件</h4>
              <div className="flex flex-col gap-4">
                {OPTIONAL_CATEGORIES.map((category) => {
                  const files = getFilesByCategory(category)
                  return (
                    <div key={category} className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm">{category}</Label>
                        <input
                          id={`file-input-optional-${category}`}
                          type="file"
                          accept=".doc,.docx,.xlsx,.xls"
                          className="hidden"
                          onChange={(e) =>
                            handleFileSelect(e.target.files, category)
                          }
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const input = document.getElementById(
                              `file-input-optional-${category}`
                            ) as HTMLInputElement
                            if (input) input.click()
                          }}
                          disabled={state.isLoading}
                        >
                          <Upload className="mr-2 h-3 w-3" />
                          选择文件
                        </Button>
                      </div>
                      {files.length > 0 && (
                        <div className="flex flex-col gap-1">
                          {files.map((fileWithCat, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between rounded border p-2 text-sm"
                            >
                              <div className="flex items-center gap-2">
                                {getFileIcon(fileWithCat.file.type)}
                                <span className="truncate">
                                  {fileWithCat.file.name}
                                </span>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => {
                                  const originalIndex = selectedFiles.findIndex(
                                    (f) => f === fileWithCat
                                  )
                                  handleRemoveSelected(originalIndex)
                                }}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="mt-4">
              <Button
                onClick={handleUpload}
                disabled={state.isLoading || selectedFiles.length === 0}
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

            <div className="rounded-lg bg-muted/30 p-4">
              <h4 className="mb-2 text-sm font-medium">使用说明</h4>
              <ul className="flex flex-col gap-1 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                  <span>
                    变更时间段和等级为必填项，必须上传《割接方案》和《告警屏蔽表》
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                  <span>卓越工程师持证情况</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                  <span>上传后可在校验前补充可选文件</span>
                </li>
              </ul>
            </div>
          </div>
        </FieldGroup>
      </CardContent>
    </Card>
  )
}

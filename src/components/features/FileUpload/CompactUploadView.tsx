import { Upload, X, CheckCircle, Loader2, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import type { FileCategory, ChangeLevel } from "@/context/AppContext"
import type { FileWithCategory } from "./types"
import { FileItem } from "./FileItem"
import { getFileIcon, isCategoryUploaded } from "./utils"
import { OPTIONAL_CATEGORIES } from "./types"

interface CompactUploadViewProps {
  state: {
    files: Array<{
      id: string
      name: string
      type: string
      size: number
      uploadStatus: "completed" | "uploading" | "failed" | "pending"
    }>
    changeTimeStart?: string
    changeTimeEnd?: string
    changeLevel?: ChangeLevel | null
    uploadedCategories: FileCategory[]
    isLoading: boolean
  }
  selectedFiles: FileWithCategory[]
  disableNewUpload?: boolean
  onValidateAll: () => void
  onRemoveFile: (id: string) => void
  onFileSelect: (files: FileList | null, category: FileCategory) => void
  onRemoveSelected: (index: number) => void
  onUpload: () => void
  setSelectedFiles: React.Dispatch<React.SetStateAction<FileWithCategory[]>>
}

export function CompactUploadView({
  state,
  selectedFiles,
  disableNewUpload,
  onValidateAll,
  onRemoveFile,
  onFileSelect,
  onRemoveSelected,
  onUpload,
  setSelectedFiles,
}: CompactUploadViewProps) {
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
                  onClick={onValidateAll}
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
            OPTIONAL_CATEGORIES.some(
              (cat) => !isCategoryUploaded(cat, state.uploadedCategories)
            ) && (
              <div className="mt-4 rounded-lg border p-4">
                <h4 className="mb-3 text-sm font-medium">补充可选文件</h4>
                <div className="flex flex-col gap-3">
                  {OPTIONAL_CATEGORIES.filter(
                    (cat) => !isCategoryUploaded(cat, state.uploadedCategories)
                  ).map((category) => (
                    <div key={category} className="flex items-center gap-2">
                      <Label className="flex-1 text-sm">{category}</Label>
                      <input
                        id={`file-input-optional-${category}`}
                        type="file"
                        accept=".docx,.xlsx"
                        className="hidden"
                        onChange={(e) => onFileSelect(e.target.files, category)}
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
                        .filter((f) => OPTIONAL_CATEGORIES.includes(f.category))
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
                                onRemoveSelected(originalIndex)
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
                      onClick={onUpload}
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
              <FileItem
                key={file.id}
                file={file}
                onRemove={onRemoveFile}
                isLoading={state.isLoading}
                disabled={disableNewUpload}
              />
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

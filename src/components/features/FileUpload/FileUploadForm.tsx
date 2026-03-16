import { Clock, FileText, FileSpreadsheet, Upload, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import type { ChangeLevel, FileCategory } from "@/context/AppContext"
import type { FileWithCategory } from "./types"
import { CategoryUploadItem } from "./CategoryUploadItem"
import { getFilesByCategory } from "./utils"
import {
  REQUIRED_CATEGORIES,
  OPTIONAL_CATEGORIES,
  CHANGE_LEVELS,
} from "./types"

interface FileUploadFormProps {
  state: {
    changeTimeStart?: string
    changeTimeEnd?: string
    changeLevel?: ChangeLevel | null
    isLoading: boolean
  }
  selectedFiles: FileWithCategory[]
  formErrors: {
    changeTimeStart?: string
    changeTimeEnd?: string
    changeLevel?: string
    requiredFiles?: string
  }
  onSetChangeTimeStart: (value: string) => void
  onSetChangeTimeEnd: (value: string) => void
  onSetChangeLevel: (value: ChangeLevel) => void
  onFileSelect: (files: FileList | null, category: FileCategory) => void
  onRemoveSelected: (index: number) => void
  onUpload: () => void
}

export function FileUploadForm({
  state,
  selectedFiles,
  formErrors,
  onSetChangeTimeStart,
  onSetChangeTimeEnd,
  onSetChangeLevel,
  onFileSelect,
  onRemoveSelected,
  onUpload,
}: FileUploadFormProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>上传变更文档</CardTitle>
        <CardDescription>
          请填写变更信息并上传必要文件，支持 .docx, .xlsx 格式
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <div className="flex flex-col gap-6">
            <div className="rounded-lg border bg-muted/50 p-4">
              <h3 className="mb-4 flex items-center gap-2 text-base font-semibold">
                <Clock className="h-4 w-4" />
                变更信息（必填）
              </h3>
              <div className="flex flex-col gap-4 md:flex-row">
                <Field className="flex-1">
                  <FieldLabel htmlFor="change-time-start">
                    变更开始时间 *
                  </FieldLabel>
                  <Input
                    id="change-time-start"
                    type="datetime-local"
                    value={state.changeTimeStart}
                    onChange={(e) => onSetChangeTimeStart(e.target.value)}
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
                    onChange={(e) => onSetChangeTimeEnd(e.target.value)}
                    aria-invalid={!!formErrors.changeTimeEnd}
                  />
                  {formErrors.changeTimeEnd && (
                    <FieldDescription className="text-destructive">
                      {formErrors.changeTimeEnd}
                    </FieldDescription>
                  )}
                </Field>
              </div>

              <Field className="mt-4">
                <FieldLabel>变更等级 *</FieldLabel>
                <RadioGroup
                  value={state.changeLevel || ""}
                  onValueChange={(value) =>
                    onSetChangeLevel(value as ChangeLevel)
                  }
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
            </div>

            <div className="rounded-lg border bg-muted/50 p-4">
              <h3 className="mb-4 flex items-center gap-2 text-base font-semibold">
                <FileText className="h-4 w-4" />
                必传文档（必须上传）
              </h3>
              <div className="flex flex-col gap-4">
                {REQUIRED_CATEGORIES.map((category) => {
                  const files = getFilesByCategory(selectedFiles, category)
                  return (
                    <CategoryUploadItem
                      key={category}
                      category={category}
                      files={files}
                      onFileSelect={onFileSelect}
                      onRemoveFile={onRemoveSelected}
                      selectedFiles={selectedFiles}
                      isLoading={state.isLoading}
                    />
                  )
                })}
              </div>
              {formErrors.requiredFiles && (
                <FieldDescription className="mt-2 text-destructive">
                  {formErrors.requiredFiles}
                </FieldDescription>
              )}
            </div>

            <div className="rounded-lg border bg-muted/50 p-4">
              <h3 className="mb-4 flex items-center gap-2 text-base font-semibold">
                <FileSpreadsheet className="h-4 w-4" />
                可选文档（根据需要上传）
              </h3>
              <div className="flex flex-col gap-4">
                {OPTIONAL_CATEGORIES.map((category) => {
                  const files = getFilesByCategory(selectedFiles, category)
                  return (
                    <CategoryUploadItem
                      key={category}
                      category={category}
                      files={files}
                      onFileSelect={onFileSelect}
                      onRemoveFile={onRemoveSelected}
                      selectedFiles={selectedFiles}
                      isLoading={state.isLoading}
                      inputIdPrefix="file-input-optional"
                    />
                  )
                })}
              </div>
            </div>

            <Button
              onClick={onUpload}
              disabled={state.isLoading || selectedFiles.length === 0}
              className="mt-6 w-full"
              size="lg"
            >
              {state.isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  上传中...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  确认上传全部文档
                </>
              )}
            </Button>
          </div>
        </FieldGroup>
      </CardContent>
    </Card>
  )
}

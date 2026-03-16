import { Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import type { FileCategory } from "@/context/AppContext"
import type { FileWithCategory } from "./types"
import { getFileIcon } from "./utils"

interface CategoryUploadItemProps {
  category: FileCategory
  files: FileWithCategory[]
  onFileSelect: (files: FileList | null, category: FileCategory) => void
  onRemoveFile: (index: number) => void
  selectedFiles: FileWithCategory[]
  isLoading?: boolean
  inputIdPrefix?: string
}

export function CategoryUploadItem({
  category,
  files,
  onFileSelect,
  onRemoveFile,
  selectedFiles,
  isLoading,
  inputIdPrefix = "file-input",
}: CategoryUploadItemProps) {
  const inputId = `${inputIdPrefix}-${category}`

  return (
    <div className="rounded-lg bg-background p-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm">{category}</Label>
        <input
          id={inputId}
          type="file"
          accept=".docx,.xlsx"
          className="hidden"
          onChange={(e) => onFileSelect(e.target.files, category)}
        />
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            const input = document.getElementById(inputId) as HTMLInputElement
            if (input) input.click()
          }}
          disabled={isLoading}
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
                <span className="truncate">{fileWithCat.file.name}</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => {
                  const originalIndex = selectedFiles.findIndex(
                    (f) => f === fileWithCat
                  )
                  onRemoveFile(originalIndex)
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
}

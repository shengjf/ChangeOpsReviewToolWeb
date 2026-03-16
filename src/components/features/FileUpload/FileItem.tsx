import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getFileIcon, formatFileSize } from "./utils"

interface FileItemProps {
  file: {
    id: string
    name: string
    type: string
    size: number
    uploadStatus: "completed" | "uploading" | "failed" | "pending"
  }
  onRemove: (id: string) => void
  isLoading?: boolean
  disabled?: boolean
}

export function FileItem({
  file,
  onRemove,
  isLoading,
  disabled,
}: FileItemProps) {
  return (
    <div className="flex items-center justify-between rounded-lg border p-3">
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
          onClick={() => onRemove(file.id)}
          disabled={isLoading || disabled}
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  )
}

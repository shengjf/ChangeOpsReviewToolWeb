import { FileText, FileSpreadsheet } from "lucide-react"
import type { FileCategory } from "@/context/AppContext"
import type { FileWithCategory } from "./types"

export const getFileIcon = (type: string) => {
  if (type.includes("word"))
    return <FileText className="h-5 w-5 text-blue-500" />
  if (type.includes("excel") || type.includes("spreadsheet"))
    return <FileSpreadsheet className="h-5 w-5 text-green-500" />
  return <FileText className="h-5 w-5 text-gray-500" />
}

export const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

export const isCategoryUploaded = (
  category: FileCategory,
  uploadedCategories: FileCategory[]
) => {
  return uploadedCategories.includes(category)
}

export const getFilesByCategory = (
  selectedFiles: FileWithCategory[],
  category: FileCategory
) => {
  return selectedFiles.filter((f) => f.category === category)
}

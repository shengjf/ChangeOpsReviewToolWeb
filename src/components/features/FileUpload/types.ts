import type { ChangeLevel, FileCategory } from "@/context/AppContext"

export interface FileUploadProps {
  compact?: boolean
  disableNewUpload?: boolean
}

export interface FileWithCategory {
  file: File
  category: FileCategory
}

export const REQUIRED_CATEGORIES: FileCategory[] = ["割接方案", "告警屏蔽表"]
export const OPTIONAL_CATEGORIES: FileCategory[] = [
  "卓越工程师持证情况",
  "服务风险告知",
  "用户公告",
]

export const CHANGE_LEVELS: ChangeLevel[] = [
  "一级",
  "二级",
  "三级",
  "四级",
  "五级",
]

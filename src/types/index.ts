/**
 * 变更文档审核工具类型定义
 */

/**
 * 文件上传状态
 */
export type UploadStatus = "pending" | "uploading" | "completed" | "failed"

/**
 * 校验结果状态
 */
export type ValidationStatus = "pending" | "validating" | "passed" | "failed"

/**
 * 文件信息
 */
export interface FileInfo {
  id: string
  name: string
  size: number
  type: string
  uploadStatus: UploadStatus
  validationStatus: ValidationStatus
  errors?: ValidationError[]
  uploadedAt?: Date
}

/**
 * 校验错误
 */
export interface ValidationError {
  id: string
  fileId: string
  location: string // 例如: "Sheet1!A3", "Paragraph 2", "Page 5"
  description: string
  severity: "error" | "warning" | "info"
  suggestion?: string
}

/**
 * 校验结果
 */
export interface ValidationResult {
  fileId: string
  fileName: string
  status: ValidationStatus
  errors: ValidationError[]
  validatedAt: Date
}

/**
 * 筛选选项
 */
export interface FilterOptions {
  status: "all" | "passed" | "failed"
  severity?: ("error" | "warning" | "info")[]
}

/**
 * 模拟API响应
 */
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  timestamp: string
}

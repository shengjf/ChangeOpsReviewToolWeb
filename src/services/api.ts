/**
 * API服务层 - 模拟后端接口
 */
import type { FileInfo, ValidationResult, ApiResponse } from "@/types"

/**
 * 模拟延迟
 */
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * 生成随机错误
 */
const generateMockErrors = (fileId: string) => {
  const errorTypes = [
    {
      location: "Sheet1!A3",
      description: "数据格式错误：日期格式应为YYYY-MM-DD",
      severity: "error" as const,
    },
    {
      location: "Sheet2!B5",
      description: "缺少必填字段：项目编号",
      severity: "error" as const,
    },
    {
      location: "Paragraph 2",
      description: "变更描述过于简略，建议补充详细说明",
      severity: "warning" as const,
    },
    {
      location: "Page 5",
      description: "审批人签名缺失",
      severity: "error" as const,
    },
    {
      location: "Sheet3!C8",
      description: "金额计算错误，请重新核对",
      severity: "error" as const,
    },
    {
      location: "References",
      description: "缺少相关文档引用",
      severity: "warning" as const,
    },
  ]

  // 随机选择0-3个错误
  const errorCount = Math.floor(Math.random() * 4)
  const selectedErrors = errorTypes
    .slice(0, errorCount)
    .map((error, index) => ({
      id: `${fileId}-error-${index}`,
      fileId,
      ...error,
      suggestion:
        error.severity === "error" ? "请修正后重新上传" : "建议完善内容",
    }))

  return selectedErrors
}

/**
 * 模拟文件上传API
 * TODO: 待对接真实接口
 */
export const uploadFiles = async (
  files: File[]
): Promise<ApiResponse<FileInfo[]>> => {
  await delay(800) // 模拟网络延迟

  const fileInfos: FileInfo[] = files.map((file, index) => ({
    id: `file-${Date.now()}-${index}`,
    name: file.name,
    size: file.size,
    type: file.type,
    uploadStatus: "completed" as const,
    validationStatus: "pending" as const,
    uploadedAt: new Date(),
  }))

  return {
    success: true,
    data: fileInfos,
    timestamp: new Date().toISOString(),
  }
}

/**
 * 模拟文档校验API
 * TODO: 待对接真实接口
 */
export const validateDocuments = async (
  fileIds: string[]
): Promise<ApiResponse<ValidationResult[]>> => {
  await delay(1500) // 模拟校验处理时间

  const results: ValidationResult[] = fileIds.map((fileId) => {
    const hasErrors = Math.random() > 0.5 // 50%概率有错误
    const errors = hasErrors ? generateMockErrors(fileId) : []

    return {
      fileId,
      fileName: `document-${fileId}.docx`,
      status: hasErrors ? "failed" : "passed",
      errors,
      validatedAt: new Date(),
    }
  })

  return {
    success: true,
    data: results,
    timestamp: new Date().toISOString(),
  }
}

/**
 * 模拟生成报告API
 * TODO: 待对接真实接口
 */
export const generateReport = async (): Promise<
  ApiResponse<{ downloadUrl: string }>
> => {
  await delay(1000)

  return {
    success: true,
    data: {
      downloadUrl: "/reports/validation-report.pdf",
    },
    timestamp: new Date().toISOString(),
  }
}

/**
 * 模拟文档生成API（为后期扩展预留）
 * TODO: 待对接真实接口
 */
export const generateDocuments = async (
  templateId: string
): Promise<ApiResponse<{ documentUrl: string }>> => {
  await delay(2000)

  return {
    success: true,
    data: {
      documentUrl: `/generated/${templateId}-${Date.now()}.docx`,
    },
    timestamp: new Date().toISOString(),
  }
}

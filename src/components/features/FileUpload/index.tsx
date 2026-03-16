import { useState, useCallback } from "react"
import { useApp } from "@/hooks/useApp"
import type { FileCategory } from "@/context/AppContext"
import type { FileUploadProps, FileWithCategory } from "./types"
import { CompactUploadView } from "./CompactUploadView"
import { FileUploadForm } from "./FileUploadForm"

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

      if (validFiles.length === 0) return

      const latestFile = validFiles[validFiles.length - 1]

      setSelectedFiles((prev) => [
        ...prev.filter((f) => f.category !== category),
        { file: latestFile, category },
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

  if (compact && state.files.length > 0) {
    return (
      <CompactUploadView
        state={state}
        selectedFiles={selectedFiles}
        disableNewUpload={disableNewUpload}
        onValidateAll={validateAll}
        onRemoveFile={removeFile}
        onFileSelect={handleFileSelect}
        onRemoveSelected={handleRemoveSelected}
        onUpload={handleUpload}
        setSelectedFiles={setSelectedFiles}
      />
    )
  }

  return (
    <FileUploadForm
      state={state}
      selectedFiles={selectedFiles}
      formErrors={formErrors}
      onSetChangeTimeStart={setChangeTimeStart}
      onSetChangeTimeEnd={setChangeTimeEnd}
      onSetChangeLevel={setChangeLevel}
      onFileSelect={handleFileSelect}
      onRemoveSelected={handleRemoveSelected}
      onUpload={handleUpload}
    />
  )
}

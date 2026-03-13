/**
 * 应用状态管理上下文
 */
import React, { createContext, useReducer } from "react"
import type { ReactNode } from "react"
import type { FileInfo, ValidationResult, FilterOptions } from "@/types"
import { uploadFiles, validateDocuments } from "@/services/api"

/**
 * 变更等级类型
 */
export type ChangeLevel = "一级" | "二级" | "三级" | "四级" | "五级"

/**
 * 文件类型分类
 */
export type FileCategory =
  | "割接方案"
  | "告警屏蔽表"
  | "卓越工程师持证情况"
  | "服务风险告知"
  | "用户公告"

/**
 * 应用状态
 */
interface AppState {
  files: FileInfo[]
  validationResults: ValidationResult[]
  filter: FilterOptions
  isLoading: boolean
  error: string | null
  changeTimeStart: string
  changeTimeEnd: string
  changeLevel: ChangeLevel | null
  uploadedCategories: FileCategory[]
}

/**
 * 动作类型
 */
type Action =
  | { type: "SET_FILES"; payload: FileInfo[] }
  | { type: "ADD_FILE"; payload: FileInfo }
  | { type: "REMOVE_FILE"; payload: string }
  | {
      type: "UPDATE_FILE_STATUS"
      payload: { id: string; uploadStatus: FileInfo["uploadStatus"] }
    }
  | { type: "SET_VALIDATION_RESULTS"; payload: ValidationResult[] }
  | { type: "SET_FILTER"; payload: FilterOptions }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_CHANGE_TIME_START"; payload: string }
  | { type: "SET_CHANGE_TIME_END"; payload: string }
  | { type: "SET_CHANGE_LEVEL"; payload: ChangeLevel | null }
  | { type: "ADD_UPLOADED_CATEGORY"; payload: FileCategory }
  | { type: "REMOVE_UPLOADED_CATEGORY"; payload: FileCategory }

/**
 * 初始状态
 */
const initialState: AppState = {
  files: [],
  validationResults: [],
  filter: { status: "all" },
  isLoading: false,
  error: null,
  changeTimeStart: "",
  changeTimeEnd: "",
  changeLevel: null,
  uploadedCategories: [],
}

/**
 * 状态Reducer
 */
function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "SET_FILES":
      return { ...state, files: action.payload }

    case "ADD_FILE":
      return { ...state, files: [...state.files, action.payload] }

    case "REMOVE_FILE":
      return {
        ...state,
        files: state.files.filter((file) => file.id !== action.payload),
      }

    case "UPDATE_FILE_STATUS":
      return {
        ...state,
        files: state.files.map((file) =>
          file.id === action.payload.id
            ? { ...file, uploadStatus: action.payload.uploadStatus }
            : file
        ),
      }

    case "SET_VALIDATION_RESULTS":
      return { ...state, validationResults: action.payload }

    case "SET_FILTER":
      return { ...state, filter: action.payload }

    case "SET_LOADING":
      return { ...state, isLoading: action.payload }

    case "SET_ERROR":
      return { ...state, error: action.payload }

    case "SET_CHANGE_TIME_START":
      return { ...state, changeTimeStart: action.payload }

    case "SET_CHANGE_TIME_END":
      return { ...state, changeTimeEnd: action.payload }

    case "SET_CHANGE_LEVEL":
      return { ...state, changeLevel: action.payload }

    case "ADD_UPLOADED_CATEGORY":
      return {
        ...state,
        uploadedCategories: [
          ...(state.uploadedCategories || []),
          action.payload,
        ],
      }

    case "REMOVE_UPLOADED_CATEGORY":
      return {
        ...state,
        uploadedCategories: (state.uploadedCategories || []).filter(
          (cat) => cat !== action.payload
        ),
      }

    default:
      return state
  }
}

/**
 * 上下文类型
 */
interface AppContextType {
  state: AppState
  dispatch: React.Dispatch<Action>
  uploadFiles: (files: File[]) => Promise<void>
  validateAll: () => Promise<void>
  removeFile: (fileId: string) => void
  setFilter: (filter: FilterOptions) => void
  clearError: () => void
  setChangeTimeStart: (time: string) => void
  setChangeTimeEnd: (time: string) => void
  setChangeLevel: (level: ChangeLevel | null) => void
  addUploadedCategory: (category: FileCategory) => void
  removeUploadedCategory: (category: FileCategory) => void
}

export const AppContext = createContext<AppContextType | undefined>(undefined)

/**
 * 上下文Provider组件
 */
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  /**
   * 上传文件
   */
  const handleUploadFiles = async (files: File[]) => {
    dispatch({ type: "SET_LOADING", payload: true })
    dispatch({ type: "SET_ERROR", payload: null })

    try {
      const response = await uploadFiles(files)

      if (response.success && response.data) {
        dispatch({ type: "SET_FILES", payload: response.data })
      } else {
        throw new Error(response.error || "上传失败")
      }
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload: error instanceof Error ? error.message : "上传过程中发生错误",
      })
    } finally {
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }

  /**
   * 校验所有文件
   */
  const handleValidateAll = async () => {
    if (state.files.length === 0) return

    dispatch({ type: "SET_LOADING", payload: true })
    dispatch({ type: "SET_ERROR", payload: null })

    try {
      const fileIds = state.files.map((file) => file.id)
      const response = await validateDocuments(fileIds)

      if (response.success && response.data) {
        dispatch({ type: "SET_VALIDATION_RESULTS", payload: response.data })
      } else {
        throw new Error(response.error || "校验失败")
      }
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload: error instanceof Error ? error.message : "校验过程中发生错误",
      })
    } finally {
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }

  /**
   * 移除文件
   */
  const handleRemoveFile = (fileId: string) => {
    dispatch({ type: "REMOVE_FILE", payload: fileId })
  }

  /**
   * 设置筛选条件
   */
  const handleSetFilter = (filter: FilterOptions) => {
    dispatch({ type: "SET_FILTER", payload: filter })
  }

  /**
   * 清除错误
   */
  const handleClearError = () => {
    dispatch({ type: "SET_ERROR", payload: null })
  }

  /**
   * 设置变更开始时间
   */
  const handleSetChangeTimeStart = (time: string) => {
    dispatch({ type: "SET_CHANGE_TIME_START", payload: time })
  }

  /**
   * 设置变更结束时间
   */
  const handleSetChangeTimeEnd = (time: string) => {
    dispatch({ type: "SET_CHANGE_TIME_END", payload: time })
  }

  /**
   * 设置变更等级
   */
  const handleSetChangeLevel = (level: ChangeLevel | null) => {
    dispatch({ type: "SET_CHANGE_LEVEL", payload: level })
  }

  /**
   * 添加已上传的文件类别
   */
  const handleAddUploadedCategory = (category: FileCategory) => {
    dispatch({ type: "ADD_UPLOADED_CATEGORY", payload: category })
  }

  /**
   * 移除已上传的文件类别
   */
  const handleRemoveUploadedCategory = (category: FileCategory) => {
    dispatch({ type: "REMOVE_UPLOADED_CATEGORY", payload: category })
  }

  const contextValue: AppContextType = {
    state,
    dispatch,
    uploadFiles: handleUploadFiles,
    validateAll: handleValidateAll,
    removeFile: handleRemoveFile,
    setFilter: handleSetFilter,
    clearError: handleClearError,
    setChangeTimeStart: handleSetChangeTimeStart,
    setChangeTimeEnd: handleSetChangeTimeEnd,
    setChangeLevel: handleSetChangeLevel,
    addUploadedCategory: handleAddUploadedCategory,
    removeUploadedCategory: handleRemoveUploadedCategory,
  }

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  )
}

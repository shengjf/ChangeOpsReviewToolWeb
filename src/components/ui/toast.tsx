/**
 * 轻量级Toast通知组件
 */
import { useEffect, useState } from "react"
import { X, CheckCircle, AlertCircle, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export type ToastType = "success" | "error" | "info" | "warning"

interface ToastProps {
  message: string
  type?: ToastType
  duration?: number
  onClose?: () => void
}

export function Toast({
  message,
  type = "info",
  duration = 5000,
  onClose,
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(() => onClose?.(), 300)
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [duration, onClose])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(() => onClose?.(), 300)
  }

  const typeConfig = {
    success: {
      icon: <CheckCircle className="h-5 w-5" />,
      bg: "bg-green-50 dark:bg-green-950/30",
      border: "border-green-200 dark:border-green-800",
      text: "text-green-800 dark:text-green-300",
      iconColor: "text-green-500",
    },
    error: {
      icon: <AlertCircle className="h-5 w-5" />,
      bg: "bg-red-50 dark:bg-red-950/30",
      border: "border-red-200 dark:border-red-800",
      text: "text-red-800 dark:text-red-300",
      iconColor: "text-red-500",
    },
    warning: {
      icon: <AlertCircle className="h-5 w-5" />,
      bg: "bg-yellow-50 dark:bg-yellow-950/30",
      border: "border-yellow-200 dark:border-yellow-800",
      text: "text-yellow-800 dark:text-yellow-300",
      iconColor: "text-yellow-500",
    },
    info: {
      icon: <Info className="h-5 w-5" />,
      bg: "bg-blue-50 dark:bg-blue-950/30",
      border: "border-blue-200 dark:border-blue-800",
      text: "text-blue-800 dark:text-blue-300",
      iconColor: "text-blue-500",
    },
  }

  const config = typeConfig[type]

  return (
    <div
      className={cn(
        "fixed top-4 right-4 z-50 w-full max-w-md rounded-lg border p-4 shadow-lg transition-all duration-300",
        config.bg,
        config.border,
        config.text,
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      )}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <div className={cn("mt-0.5", config.iconColor)}>{config.icon}</div>
        <div className="flex-1">
          <p className="text-sm font-medium">{message}</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={handleClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

/**
 * Toast管理器组件
 */
interface ToastManagerProps {
  toasts: Array<ToastProps & { id: string }>
  onRemove: (id: string) => void
}

export function ToastManager({ toasts, onRemove }: ToastManagerProps) {
  return (
    <>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => onRemove(toast.id)}
        />
      ))}
    </>
  )
}

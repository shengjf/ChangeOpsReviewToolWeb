/**
 * Toast 通知组件
 */
import { useEffect } from 'react'
import type { ToastItem, ToastType } from '@/types/toast'
import { X, CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react'

interface ToastManagerProps {
  toasts: ToastItem[]
  onRemove: (id: string) => void
}

export function ToastManager({ toasts, onRemove }: ToastManagerProps) {
  useEffect(() => {
    const timers = toasts.map((toast) => {
      const timer = setTimeout(() => {
        onRemove(toast.id)
      }, toast.duration)
      return timer
    })

    return () => {
      timers.forEach((timer) => clearTimeout(timer))
    }
  }, [toasts, onRemove])

  const getToastClass = (type: ToastType) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800'
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800'
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800'
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800'
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800'
    }
  }

  const getToastIcon = (type: ToastType) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5" />
      case 'error':
        return <XCircle className="h-5 w-5" />
      case 'warning':
        return <AlertTriangle className="h-5 w-5" />
      case 'info':
        return <Info className="h-5 w-5" />
      default:
        return null
    }
  }

  if (toasts.length === 0) return null

  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center gap-3 rounded-md border px-4 py-3 shadow-sm ${getToastClass(toast.type)}`}
        >
          {getToastIcon(toast.type) && (
            <div className="flex-shrink-0">{getToastIcon(toast.type)}</div>
          )}
          <div className="flex-1 text-base font-medium">{toast.message}</div>
          <button
            onClick={() => onRemove(toast.id)}
            className="rounded-md p-1 hover:bg-white/50 transition-colors"
            aria-label="关闭通知"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  )
}

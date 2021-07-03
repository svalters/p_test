import React, { useCallback, useState, createContext } from "react"
import { CSSTransition, TransitionGroup } from "react-transition-group"

export enum ToastType {
  info = "info",
  success = "success",
}

export interface ToastProps {
  id?: number
  type?: ToastType
  message: string
}
const timeout = 3 * 1000

export const ToastContext = createContext((_toast: ToastProps) => {})

const ToastProvider: React.FC = ({ children }) => {
  const [toasts, setToasts] = useState<Required<ToastProps>[]>([])

  const addToast = useCallback((toast: ToastProps) => {
    const newToast = {
      id: Date.now(),
      type: ToastType.info,
      ...toast,
    }
    setToasts(toasts => [...toasts, newToast])

    setTimeout(
      () => setToasts(toasts => toasts.filter(item => item.id !== newToast.id)),
      timeout
    )
  }, [])

  return (
    <ToastContext.Provider value={addToast}>
      {children}

      <TransitionGroup className='absolute top-0 right-0 w-full max-w-md p-6'>
        {toasts.map(({ id, message, type }) => (
          <CSSTransition
            key={id.toString()}
            classNames='slide'
            timeout={{ enter: 300, exit: 150 }}
          >
            <div
              className={`text-white px-6 py-4 border-0 rounded relative mb-4 w-full shadow-lg opacity-90 ${
                type === ToastType.success ? "bg-green-300" : "bg-gray-400"
              }`}
            >
              <span className='font-semibold mr-8'>{message}</span>
            </div>
          </CSSTransition>
        ))}
      </TransitionGroup>
    </ToastContext.Provider>
  )
}

export default ToastProvider

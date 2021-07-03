import { useContext } from "react"
import { ToastContext } from "@/Toast"

const useToast = () => useContext(ToastContext)

export default useToast

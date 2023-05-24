import { toast, TypeOptions } from 'react-toastify'

interface IDisplayToastProps {
  message: string
  toastType: TypeOptions
}

export function displayToast({ message, toastType }: IDisplayToastProps) {
  return toast(message, {
    type: toastType,
    position: 'top-right',
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: false,
    progress: undefined,
    theme: 'dark'
  })
}

import React, { ButtonHTMLAttributes } from "react"

const Button: React.FC<ButtonHTMLAttributes<HTMLButtonElement>> = ({
  children,
  ...rest
}) => (
  <button
    className='bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow whitespace-nowrap disabled:opacity-50 disabled:hover:bg-white'
    {...rest}
  >
    {children}
  </button>
)

export default React.memo(Button)

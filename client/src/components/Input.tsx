import type { InputHTMLAttributes } from 'react'

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  id: string
  label: string
}

const Input = ({ id, label, className = '', ...props }: InputProps) => {
  return (
    <label className="input-group" htmlFor={id}>
      <span>{label}</span>
      <input id={id} className={`input ${className}`.trim()} {...props} />
    </label>
  )
}

export default Input

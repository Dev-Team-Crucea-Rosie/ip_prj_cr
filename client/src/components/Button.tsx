import type { ButtonHTMLAttributes } from 'react'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'danger'
}

const Button = ({ variant = 'primary', className = '', ...props }: ButtonProps) => {
  return <button className={`button button-${variant} ${className}`.trim()} {...props} />
}

export default Button

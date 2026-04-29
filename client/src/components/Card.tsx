import type { ReactNode } from 'react'

type CardProps = {
  title?: string
  children: ReactNode
}

const Card = ({ title, children }: CardProps) => {
  return (
    <section className="card">
      {title ? <h2>{title}</h2> : null}
      {children}
    </section>
  )
}

export default Card

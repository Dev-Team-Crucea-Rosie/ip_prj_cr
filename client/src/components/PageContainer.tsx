import type { ReactNode } from 'react'

type PageContainerProps = {
  children: ReactNode
}

const PageContainer = ({ children }: PageContainerProps) => {
  return <main className="page-container">{children}</main>
}

export default PageContainer

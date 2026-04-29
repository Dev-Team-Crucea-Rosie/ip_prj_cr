export type User = {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: string | null
  isCoordinator: boolean
  isAdministrator: boolean
}

export type Project = {
  id: number
  name: string
  description: string
}

export type RegisterInput = {
  firstName: string
  lastName: string
  email: string
  phone: string
  password: string
  isCoordinator: boolean
  isAdministrator: boolean
}

export type LoginInput = {
  email: string
  password: string
}

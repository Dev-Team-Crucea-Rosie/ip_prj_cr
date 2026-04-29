import type { LoginInput, Project, RegisterInput, User } from '../types'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const asErrorMessage = (value: unknown) => {
  if (typeof value === 'object' && value !== null && 'message' in value) {
    const message = value.message
    if (typeof message === 'string') {
      return message
    }
  }

  return 'Request failed'
}

const request = async <T>(path: string, init: RequestInit = {}): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      ...(init.body ? { 'Content-Type': 'application/json' } : {}),
      ...(init.headers || {}),
    },
  })

  const text = await response.text()
  let payload: unknown = null

  if (text) {
    try {
      payload = JSON.parse(text)
    } catch {
      payload = null
    }
  }

  if (!response.ok) {
    throw new Error(asErrorMessage(payload))
  }

  return payload as T
}

const authHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
})

export const registerUser = (data: RegisterInput) =>
  request<{ user: User }>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  })

export const loginUser = (data: LoginInput) =>
  request<{ token: string; user: User }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  })

export const getCurrentUser = (token: string) =>
  request<{ user: User }>('/auth/me', {
    headers: authHeaders(token),
  })

export const getProjects = () => request<{ projects: Project[] }>('/projects')

export const createProject = (token: string, data: { name: string; description: string }) =>
  request<{ project: Project }>('/projects', {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(data),
  })

export const updateProject = (token: string, id: number, data: { name: string; description: string }) =>
  request<{ project: Project }>(`/projects/${id}`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify(data),
  })

export const deleteProject = (token: string, id: number) =>
  request<{ project: Project }>(`/projects/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  })

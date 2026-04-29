import { useCallback, useEffect, useState, type FormEvent } from 'react'
import Button from '../components/Button'
import Card from '../components/Card'
import Input from '../components/Input'
import Table, { type TableColumn } from '../components/Table'
import { createProject, deleteProject, getCurrentUser, getProjects, updateProject } from '../lib/api'
import type { Project, User } from '../types'

type DashboardPageProps = {
  token: string
  user: User | null
  onUserLoaded: (user: User) => void
}

type ProjectForm = {
  name: string
  description: string
}

const initialProjectForm: ProjectForm = {
  name: '',
  description: '',
}

const DashboardPage = ({ token, user, onUserLoaded }: DashboardPageProps) => {
  const [projects, setProjects] = useState<Project[]>([])
  const [projectsLoading, setProjectsLoading] = useState(true)
  const [projectsError, setProjectsError] = useState('')
  const [projectForm, setProjectForm] = useState<ProjectForm>(initialProjectForm)
  const [projectSaving, setProjectSaving] = useState(false)
  const [editingProjectId, setEditingProjectId] = useState<number | null>(null)
  const [projectFormError, setProjectFormError] = useState('')

  const loadProjects = useCallback(async () => {
    setProjectsLoading(true)
    setProjectsError('')

    try {
      const response = await getProjects()
      setProjects(response.projects)
    } catch (loadError) {
      setProjectsError(loadError instanceof Error ? loadError.message : 'Failed to load projects')
    } finally {
      setProjectsLoading(false)
    }
  }, [])

  const loadCurrentUser = useCallback(async () => {
    if (user) {
      return
    }

    try {
      const response = await getCurrentUser(token)
      onUserLoaded(response.user)
    } catch {
      onUserLoaded({
        id: 0,
        firstName: 'Coordinator',
        lastName: '',
        email: '',
        phone: null,
        isCoordinator: false,
        isAdministrator: false,
      })
    }
  }, [onUserLoaded, token, user])

  useEffect(() => {
    void loadCurrentUser()
    void loadProjects()
  }, [loadCurrentUser, loadProjects])

  const submitProject = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setProjectSaving(true)
    setProjectFormError('')

    try {
      if (editingProjectId) {
        await updateProject(token, editingProjectId, projectForm)
      } else {
        await createProject(token, projectForm)
      }

      setEditingProjectId(null)
      setProjectForm(initialProjectForm)
      await loadProjects()
    } catch (submitError) {
      setProjectFormError(submitError instanceof Error ? submitError.message : 'Failed to save project')
    } finally {
      setProjectSaving(false)
    }
  }

  const startEdit = (project: Project) => {
    setEditingProjectId(project.id)
    setProjectForm({
      name: project.name,
      description: project.description,
    })
    setProjectFormError('')
  }

  const cancelEdit = () => {
    setEditingProjectId(null)
    setProjectForm(initialProjectForm)
    setProjectFormError('')
  }

  const removeProject = async (projectId: number) => {
    const confirmed = window.confirm('Delete this project?')

    if (!confirmed) {
      return
    }

    try {
      await deleteProject(token, projectId)
      await loadProjects()
    } catch (removeError) {
      setProjectsError(removeError instanceof Error ? removeError.message : 'Failed to delete project')
    }
  }

  const columns: TableColumn<Project>[] = [
    {
      header: 'ID',
      render: (project) => project.id,
    },
    {
      header: 'Name',
      render: (project) => project.name,
    },
    {
      header: 'Description',
      render: (project) => project.description,
    },
    {
      header: 'Actions',
      render: (project) => (
        <div className="table-actions">
          <Button variant="secondary" type="button" onClick={() => startEdit(project)}>
            Edit
          </Button>
          <Button variant="danger" type="button" onClick={() => removeProject(project.id)}>
            Delete
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="dashboard">
      <Card title="Coordinator Dashboard">
        <div className="welcome">
          <p>Welcome, {user ? `${user.firstName} ${user.lastName}`.trim() : 'Coordinator'}.</p>
          <p>Use the projects section to manage Sprint 1 project data.</p>
        </div>
      </Card>

      <Card title="Projects">
        <form className="form" onSubmit={submitProject}>
          <Input
            id="project-name"
            label="Project Name"
            value={projectForm.name}
            onChange={(event) =>
              setProjectForm((current) => ({
                ...current,
                name: event.target.value,
              }))
            }
            required
          />
          <Input
            id="project-description"
            label="Project Description"
            value={projectForm.description}
            onChange={(event) =>
              setProjectForm((current) => ({
                ...current,
                description: event.target.value,
              }))
            }
            required
          />

          {projectFormError ? <p className="status error">{projectFormError}</p> : null}

          <div className="row-actions">
            <Button type="submit" disabled={projectSaving}>
              {projectSaving
                ? 'Saving...'
                : editingProjectId
                  ? 'Update project'
                  : 'Create project'}
            </Button>
            {editingProjectId ? (
              <Button variant="secondary" type="button" onClick={cancelEdit}>
                Cancel
              </Button>
            ) : null}
          </div>
        </form>

        {projectsLoading ? <p className="status">Loading projects...</p> : null}
        {projectsError ? <p className="status error">{projectsError}</p> : null}

        {!projectsLoading ? (
          <Table columns={columns} rows={projects} emptyMessage="No projects found" />
        ) : null}
      </Card>
    </div>
  )
}

export default DashboardPage

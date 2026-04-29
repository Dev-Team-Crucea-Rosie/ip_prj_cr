import { useState, type FormEvent } from 'react'
import { registerUser } from '../lib/api'
import type { RegisterInput } from '../types'
import Button from '../components/Button'
import Card from '../components/Card'
import Input from '../components/Input'

type RegisterPageProps = {
  onRegistered: (email: string) => void
}

const initialForm: RegisterInput = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
  isCoordinator: false,
  isAdministrator: false,
}

const RegisterPage = ({ onRegistered }: RegisterPageProps) => {
  const [form, setForm] = useState<RegisterInput>(initialForm)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (field: keyof RegisterInput, value: string | boolean) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      await registerUser(form)
      onRegistered(form.email)
      setForm(initialForm)
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card title="Register">
      <form className="form" onSubmit={handleSubmit}>
        <div className="grid-2">
          <Input
            id="register-first-name"
            label="First Name"
            value={form.firstName}
            onChange={(event) => handleChange('firstName', event.target.value)}
            required
          />
          <Input
            id="register-last-name"
            label="Last Name"
            value={form.lastName}
            onChange={(event) => handleChange('lastName', event.target.value)}
            required
          />
        </div>
        <Input
          id="register-email"
          type="email"
          label="Email"
          value={form.email}
          onChange={(event) => handleChange('email', event.target.value)}
          required
        />
        <Input
          id="register-phone"
          label="Phone"
          value={form.phone}
          onChange={(event) => handleChange('phone', event.target.value)}
        />
        <Input
          id="register-password"
          type="password"
          label="Password"
          value={form.password}
          onChange={(event) => handleChange('password', event.target.value)}
          required
        />
        <label className="checkbox-row" htmlFor="register-coordinator">
          <input
            id="register-coordinator"
            type="checkbox"
            checked={form.isCoordinator}
            onChange={(event) => handleChange('isCoordinator', event.target.checked)}
          />
          <span>Register as coordinator</span>
        </label>
        <label className="checkbox-row" htmlFor="register-admin">
          <input
            id="register-admin"
            type="checkbox"
            checked={form.isAdministrator}
            onChange={(event) => handleChange('isAdministrator', event.target.checked)}
          />
          <span>Register as administrator</span>
        </label>

        {error ? <p className="status error">{error}</p> : null}

        <Button type="submit" disabled={loading}>
          {loading ? 'Creating account...' : 'Create account'}
        </Button>
      </form>
    </Card>
  )
}

export default RegisterPage

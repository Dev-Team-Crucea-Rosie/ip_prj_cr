import { useEffect, useState, type FormEvent } from 'react'
import { loginUser } from '../lib/api'
import type { User } from '../types'
import Button from '../components/Button'
import Card from '../components/Card'
import Input from '../components/Input'

type LoginPageProps = {
  initialEmail: string
  onLoginSuccess: (token: string, user: User) => void
}

const LoginPage = ({ initialEmail, onLoginSuccess }: LoginPageProps) => {
  const [email, setEmail] = useState(initialEmail)
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setEmail(initialEmail)
  }, [initialEmail])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await loginUser({ email, password })
      onLoginSuccess(response.token, response.user)
      setPassword('')
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card title="Login">
      <form className="form" onSubmit={handleSubmit}>
        <Input
          id="login-email"
          type="email"
          label="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        <Input
          id="login-password"
          type="password"
          label="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />

        {error ? <p className="status error">{error}</p> : null}

        <Button type="submit" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>
    </Card>
  )
}

export default LoginPage

import type { User } from '../types'
import Button from './Button'

type NavbarProps = {
  isAuthenticated: boolean
  activeView: 'login' | 'register' | 'dashboard'
  user: User | null
  onNavigate: (view: 'login' | 'register' | 'dashboard') => void
  onLogout: () => void
}

const Navbar = ({ isAuthenticated, activeView, user, onNavigate, onLogout }: NavbarProps) => {
  return (
    <header className="navbar">
      <div>
        <p className="navbar-subtitle">Volunteer Management Platform</p>
        <h1>CR S3</h1>
      </div>
      <div className="navbar-actions">
        {!isAuthenticated ? (
          <>
            <Button
              variant={activeView === 'login' ? 'primary' : 'secondary'}
              onClick={() => onNavigate('login')}
            >
              Login
            </Button>
            <Button
              variant={activeView === 'register' ? 'primary' : 'secondary'}
              onClick={() => onNavigate('register')}
            >
              Register
            </Button>
          </>
        ) : (
          <>
            <span className="navbar-user">{user ? `${user.firstName} ${user.lastName}` : 'Coordinator'}</span>
            <Button variant="secondary" onClick={() => onNavigate('dashboard')}>
              Dashboard
            </Button>
            <Button variant="danger" onClick={onLogout}>
              Logout
            </Button>
          </>
        )}
      </div>
    </header>
  )
}

export default Navbar

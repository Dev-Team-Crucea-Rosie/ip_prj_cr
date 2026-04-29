import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Loader2, AlertCircle } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      if (user?.isCoordinator || user?.isAdministrator) {
        navigate('/coordinator');
      } else {
        navigate('/dashboard');
      }
    }
  }, [isAuthenticated, navigate, user]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('http://localhost:5000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Eroare la autentificare');
      }

      login(data.user, data.token);

      if (data.user.isCoordinator) {
        navigate('/coordinator');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('A apărut o eroare necunoscută.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center bg-gradient-to-b from-[var(--crr-red-softer)] via-white to-[var(--crr-bg)] py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <h2 className="mt-6 text-center text-3xl font-extrabold tracking-tight text-[var(--crr-red)]">
          Crucea Rosie Sector 3 Management Voluntari
        </h2>
        <p className="mt-2 text-center text-sm text-[var(--crr-muted)]">
          Acces sistem
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="rounded-lg border border-[var(--crr-border)] bg-white px-4 py-8 shadow-md sm:px-10">
          
          {error && (
            <div className="mb-4 border-l-4 border-[var(--crr-red)] bg-[var(--crr-red-softer)] p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-[var(--crr-red)]" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-[var(--crr-red-dark)]">{error}</p>
                </div>
              </div>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[var(--crr-ink)]">
                Email
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-[var(--crr-red)]" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-md border border-[var(--crr-border)] py-2 pl-10 text-[var(--crr-ink)] sm:text-sm focus:border-[var(--crr-red)] focus:ring-[var(--crr-red)]"
                  placeholder="nume@redcross.org"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[var(--crr-ink)]">
                Parola
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-[var(--crr-red)]" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-md border border-[var(--crr-border)] py-2 pl-10 text-[var(--crr-ink)] sm:text-sm focus:border-[var(--crr-red)] focus:ring-[var(--crr-red)]"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full justify-center rounded-md border border-transparent bg-[var(--crr-red)] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[var(--crr-red-dark)] focus:outline-none focus:ring-2 focus:ring-[var(--crr-red)] focus:ring-offset-2 disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : 'ACCES PORTAL'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[var(--crr-border)]" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-[var(--crr-muted)]">
                  Nou in echipa?
                </span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link to="/register" className="font-medium text-[var(--crr-red)] hover:text-[var(--crr-red-dark)] hover:underline">
                Inregistreaza-te ca voluntar
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Phone, Loader2, AlertCircle, CheckCircle } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    isCoordinator: false,
    adminToken: '',
  });
  
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const res = await fetch('http://localhost:5000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Eroare la inregistrare');
      }

      setStatus('success');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (err) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('O eroare necunoscuta a aparut');
      }
      setStatus('error');
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center bg-gradient-to-b from-[var(--crr-red-softer)] via-white to-[var(--crr-bg)] py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <h2 className="mt-6 text-center text-3xl font-extrabold tracking-tight text-[var(--crr-red)]">
          Inregistrare
        </h2>
        <p className="mt-2 text-center text-sm text-[var(--crr-muted)]">
          Formular creare cont nou {formData.isCoordinator ? '(Coordonator)' : '(Voluntar)'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="rounded-lg border border-[var(--crr-border)] bg-white px-4 py-8 shadow-md sm:px-10">
          
          {status === 'error' && (
            <div className="mb-4 border-l-4 border-[var(--crr-red)] bg-[var(--crr-red-softer)] p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-[var(--crr-red)]" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-[var(--crr-red-dark)]">{errorMessage}</p>
                </div>
              </div>
            </div>
          )}

          {status === 'success' && (
              <div className="mb-4 border-l-4 border-[var(--crr-red)] bg-[var(--crr-red-softer)] p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-5 w-5 text-[var(--crr-red)]" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-[var(--crr-red-dark)]">Contul a fost creat cu succes! Vei fi redirectat.</p>
                  </div>
                </div>
              </div>
          )}

          <form className="space-y-5" onSubmit={handleRegister}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-[var(--crr-ink)]">Prenume</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-[var(--crr-red)]" />
                  </div>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="block w-full rounded-md border border-[var(--crr-border)] py-2 pl-10 text-[var(--crr-ink)] sm:text-sm focus:border-[var(--crr-red)] focus:ring-[var(--crr-red)]"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-[var(--crr-ink)]">Nume</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="block w-full rounded-md border border-[var(--crr-border)] py-2 pl-3 text-[var(--crr-ink)] sm:text-sm focus:border-[var(--crr-red)] focus:ring-[var(--crr-red)]"
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[var(--crr-ink)]">Email</label>
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
                  value={formData.email}
                  onChange={handleInputChange}
                  className="block w-full rounded-md border border-[var(--crr-border)] py-2 pl-10 text-[var(--crr-ink)] sm:text-sm focus:border-[var(--crr-red)] focus:ring-[var(--crr-red)]"
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-[var(--crr-ink)]">Telefon</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-[var(--crr-red)]" />
                </div>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="block w-full rounded-md border border-[var(--crr-border)] py-2 pl-10 text-[var(--crr-ink)] sm:text-sm focus:border-[var(--crr-red)] focus:ring-[var(--crr-red)]"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[var(--crr-ink)]">Parola</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-[var(--crr-red)]" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  minLength={6}
                  value={formData.password}
                  onChange={handleInputChange}
                  className="block w-full rounded-md border border-[var(--crr-border)] py-2 pl-10 text-[var(--crr-ink)] sm:text-sm focus:border-[var(--crr-red)] focus:ring-[var(--crr-red)]"
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="isCoordinator"
                name="isCoordinator"
                type="checkbox"
                checked={formData.isCoordinator}
                onChange={handleInputChange}
                className="h-4 w-4 rounded border-[var(--crr-border)] text-[var(--crr-red)] focus:ring-[var(--crr-red)]"
              />
              <label htmlFor="isCoordinator" className="ml-2 block text-sm text-[var(--crr-ink)]">
                Ma inregistrez ca <b>Coordonator</b>
              </label>
            </div>

            {formData.isCoordinator && (
              <div>
                <label htmlFor="adminToken" className="block text-sm font-medium text-[var(--crr-ink)]">Token Administrator</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-[var(--crr-red)]" />
                  </div>
                  <input
                    id="adminToken"
                    name="adminToken"
                    type="password"
                    required={formData.isCoordinator}
                    value={formData.adminToken}
                    onChange={handleInputChange}
                    className="block w-full rounded-md border border-[var(--crr-border)] py-2 pl-10 text-[var(--crr-ink)] sm:text-sm focus:border-[var(--crr-red)] focus:ring-[var(--crr-red)]"
                    placeholder="Introdu tokenul secret"
                  />
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={status === 'loading' || status === 'success'}
                className="mt-4 flex w-full justify-center rounded-md border border-transparent bg-[var(--crr-red)] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[var(--crr-red-dark)] focus:outline-none focus:ring-2 focus:ring-[var(--crr-red)] focus:ring-offset-2 disabled:opacity-50"
              >
                {status === 'loading' ? <Loader2 className="animate-spin h-5 w-5" /> : 'INREGISTRARE'}
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
                  Ai deja cont?
                </span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link to="/login" className="font-medium text-[var(--crr-red)] hover:text-[var(--crr-red-dark)] hover:underline">
                Acceseaza portalul
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

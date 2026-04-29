import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import AppLayout from './components/layout/AppLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import VolunteerDashboard from './pages/volunteer/Dashboard';
import QRScanner from './pages/volunteer/QRScanner';

import AdminDashboard from './pages/admin/Dashboard';

import type { ReactNode } from 'react';

const ProtectedRoute = ({ children, requireCoordinator = false, requireVolunteer = false }: { children: ReactNode, requireCoordinator?: boolean, requireVolunteer?: boolean }) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="h-screen w-screen flex items-center justify-center">Se incarca...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const isUserCoordOrAdmin = user?.isCoordinator || user?.isAdministrator;

  // Daca ruta cere coordonator dar user-ul nu e, mergi la dashboard (voluntari)
  if (requireCoordinator && !isUserCoordOrAdmin) {
    return <Navigate to="/dashboard" />;
  }

  // Daca ruta cere strict voluntar, iar user-ul e coordonator, mergi pe pagina de admin
  if (requireVolunteer && isUserCoordOrAdmin) {
    return <Navigate to="/coordinator" />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Rute sub un singur Layout Protejat */}
          <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
            
            {/* Rute Voluntar */}
            <Route path="/dashboard" element={
              <ProtectedRoute requireVolunteer={true}>
                <VolunteerDashboard />
              </ProtectedRoute>
            } />
            <Route path="/scan" element={
              <ProtectedRoute requireVolunteer={true}>
                <QRScanner />
              </ProtectedRoute>
            } />

            {/* Rute Coordonator */}
            <Route path="/coordinator" element={
              <ProtectedRoute requireCoordinator={true}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;

import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AppLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  // Full-screen check optional
  const isScanPage = location.pathname === '/scan';

  if (isScanPage) {
     return <Outlet />; // Afișăm pe ecran complet dacă rută e /scan (Scannerul este un layer complex)
  }

  return (
    <div className="flex h-screen bg-[var(--crr-bg)] overflow-hidden">
      {/* Sidebar Component (responsive) */}
      <Sidebar 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />

      {/* Mobile Header, shown only on small screens */}
      <div className="fixed top-0 z-30 flex h-16 w-full items-center justify-between border-b border-[var(--crr-border)] bg-white/95 px-4 shadow-sm md:hidden">
        <div className="flex items-center gap-2">
          <Menu 
            className="h-6 w-6 cursor-pointer text-[var(--crr-red)] transition-colors hover:text-[var(--crr-red-dark)]" 
            onClick={() => setIsMobileMenuOpen(true)} 
          />
          <h1 className="text-lg font-bold tracking-tight text-[var(--crr-ink)]">Corp Voluntari</h1>
        </div>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--crr-red-soft)] text-sm font-bold text-[var(--crr-red)]">
           {user?.firstName?.[0]}{user?.lastName?.[0]}
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 w-full flex flex-col md:ml-64 pt-16 md:pt-0 overflow-y-auto overflow-x-hidden relative h-full">
        {/* Adăugăm padding pe desktop și pe mobil pentru un design aerisit și compatibil */}
        <div className="p-4 md:p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

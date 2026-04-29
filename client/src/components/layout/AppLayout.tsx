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
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar Component (responsive) */}
      <Sidebar 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />

      {/* Mobile Header, shown only on small screens */}
      <div className="flex md:hidden fixed top-0 w-full h-16 bg-white border-b border-gray-200 z-30 px-4 items-center justify-between">
        <div className="flex items-center gap-2">
          <Menu 
            className="w-6 h-6 text-gray-700 cursor-pointer hover:text-black" 
            onClick={() => setIsMobileMenuOpen(true)} 
          />
          <h1 className="text-lg font-bold text-gray-900 tracking-tight">Corp Voluntari</h1>
        </div>
        <div className="bg-gray-200 text-gray-700 font-bold rounded-full w-8 h-8 flex items-center justify-center text-sm">
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
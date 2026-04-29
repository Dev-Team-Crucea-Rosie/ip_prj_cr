import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, QrCode, LogOut, X, ShieldAlert } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user, logout } = useAuth();

  // Aceste condiții vor deveni utile când vom adăuga paginile de coordonator
  const isCoordinator = user?.isCoordinator || user?.isAdministrator;

  const getNavLinks = () => {
    if (isCoordinator) {
      return [
        { name: 'Dashboard', path: '/coordinator', icon: LayoutDashboard },
        // ...alte rute viitoare pt coordonator
      ];
    }
    return [
      { name: 'Acasa', path: '/dashboard', icon: LayoutDashboard },
      { name: 'Scanare Prezența', path: '/scan', icon: QrCode },
    ];
  };

  const navLinks = getNavLinks();

  return (
    <>
      {/* Desktop Sidebar (Fixed) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } flex flex-col`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-100">
          <div className="flex items-center justify-center gap-2">
            <ShieldAlert className="w-6 h-6 text-black" />
            <span className="text-lg font-bold tracking-tight text-gray-900">
              Corpul de Voluntari
            </span>
          </div>
          {/* Close button that only displays on Mobile view inside sidebar */}
          <button onClick={onClose} className="md:hidden text-gray-500 hover:text-black">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-3 py-6 space-y-2">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-2">
            {isCoordinator ? 'Meniu Coordonator' : 'Meniu Voluntar'}
          </div>
          
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={onClose} // closes on mobile click
                className={({ isActive }) =>
                  `flex items-center px-2 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-gray-100 text-black'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                <Icon className="w-5 h-5 mr-3" />
                {link.name}
              </NavLink>
            );
          })}
        </nav>

        {/* User Profile & Logout Bottom Area */}
        <div className="border-t border-gray-100 p-4">
          <div className="flex items-center mb-4 px-2">
            <div className="bg-gray-200 text-gray-700 font-bold rounded-full w-10 h-10 flex items-center justify-center">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            <div className="ml-3 overflow-hidden">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
          
          <button
            onClick={logout}
            className="flex items-center w-full px-2 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Deconectare
          </button>
        </div>
      </aside>

      {/* Mobile Backdrop Overlay (only behind open drawer) */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}
    </>
  );
}
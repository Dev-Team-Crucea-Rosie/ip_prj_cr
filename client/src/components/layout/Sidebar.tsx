import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { LayoutDashboard, QrCode, LogOut, X, ShieldAlert } from "lucide-react";

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
        { name: "Dashboard", path: "/coordinator", icon: LayoutDashboard },
        { name: "Generare QR", path: "/coordinator/qr-events", icon: QrCode },
        // ...alte rute viitoare pt coordonator
      ];
    }
    return [
      { name: "Acasa", path: "/dashboard", icon: LayoutDashboard },
      { name: "Scanare Prezența", path: "/scan", icon: QrCode },
    ];
  };

  const navLinks = getNavLinks();

  return (
    <>
      {/* Desktop Sidebar (Fixed) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-[var(--crr-border)] bg-white shadow-sm transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } flex flex-col`}
      >
        <div className="flex h-16 items-center justify-between border-b border-[var(--crr-border)] px-4">
          <div className="flex items-center justify-center gap-2">
            <ShieldAlert className="h-6 w-6 text-[var(--crr-red)]" />
            <span className="text-lg font-bold tracking-tight text-[var(--crr-ink)]">
              Corpul de Voluntari
            </span>
          </div>
          {/* Close button that only displays on Mobile view inside sidebar */}
          <button
            onClick={onClose}
            className="text-[var(--crr-muted)] transition-colors hover:text-[var(--crr-red)] md:hidden"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-3 py-6 space-y-2">
          <div className="mb-4 px-2 text-xs font-semibold uppercase tracking-wider text-[var(--crr-red)]">
            {isCoordinator ? "Meniu Coordonator" : "Meniu Voluntar"}
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
                      ? "bg-[var(--crr-red-soft)] text-[var(--crr-red-dark)]"
                      : "text-[var(--crr-muted)] hover:bg-[var(--crr-red-softer)] hover:text-[var(--crr-red-dark)]"
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
        <div className="border-t border-[var(--crr-border)] p-4">
          <div className="flex items-center mb-4 px-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--crr-red-soft)] font-bold text-[var(--crr-red)]">
              {user?.firstName?.[0]}
              {user?.lastName?.[0]}
            </div>
            <div className="ml-3 overflow-hidden">
              <p className="truncate text-sm font-medium text-[var(--crr-ink)]">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="truncate text-xs text-[var(--crr-muted)]">
                {user?.email}
              </p>
            </div>
          </div>

          <button
            onClick={logout}
            className="flex w-full items-center rounded-lg px-2 py-2 text-sm font-medium text-[var(--crr-red)] transition-colors hover:bg-[var(--crr-red-softer)]"
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

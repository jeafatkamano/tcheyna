import { useState } from "react";
import { Link, useLocation } from "react-router";
import {
  Home,
  Search,
  MessageSquare,
  User,
  Menu,
  X,
  Bell,
  ChevronRight,
  LogOut,
  Settings,
} from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
  userRole: "tenant" | "owner";
  onRoleSwitch: () => void;
}

const tenantNav = [
  { path: "/tenant/dashboard", icon: Home, label: "Accueil" },
  { path: "/tenant/listings", icon: Search, label: "Annonces" },
  { path: "/tenant/messages", icon: MessageSquare, label: "Messages" },
  { path: "/tenant/profile", icon: User, label: "Profil" },
];

const ownerNav = [
  { path: "/owner/dashboard", icon: Home, label: "Accueil" },
  { path: "/owner/listing", icon: Search, label: "Mon bien" },
  { path: "/owner/matches", icon: MessageSquare, label: "Candidats" },
  { path: "/owner/messages", icon: MessageSquare, label: "Messages" },
];

export function Layout({ children, userRole, onRoleSwitch }: LayoutProps) {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const nav = userRole === "tenant" ? tenantNav : ownerNav;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#F0F4FA" }}>
      {/* Top Bar */}
      <header
        className="sticky top-0 z-50 flex items-center justify-between px-4 py-3 shadow-sm"
        style={{ background: "#1E3A5F" }}
      >
        <div className="flex items-center gap-2">
          <button
            className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            onClick={() => setMenuOpen(true)}
          >
            <Menu size={20} />
          </button>
          <span className="text-white font-bold tracking-tight" style={{ fontSize: "20px" }}>
            tcheyna
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button className="relative p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors">
            <Bell size={20} />
            <span
              className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
              style={{ background: "#F97316" }}
            />
          </button>
          <div
            className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white text-sm font-semibold ml-1 overflow-hidden"
          >
            {userRole === "tenant" ? "SD" : "JP"}
          </div>
        </div>
      </header>

      {/* Slide-over Menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMenuOpen(false)}
          />
          <div
            className="relative w-72 max-w-full h-full flex flex-col shadow-xl"
            style={{ background: "#1E3A5F" }}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
              <span className="text-white font-bold text-xl tracking-tight">tcheyna</span>
              <button
                className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10"
                onClick={() => setMenuOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            {/* User card */}
            <div className="px-5 py-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-lg">
                  {userRole === "tenant" ? "SD" : "JP"}
                </div>
                <div>
                  <p className="text-white font-semibold">
                    {userRole === "tenant" ? "Sophie D." : "Jean-Pierre M."}
                  </p>
                  <p className="text-white/60 text-sm">
                    {userRole === "tenant" ? "Locataire" : "Propriétaire"}
                  </p>
                </div>
              </div>
            </div>

            {/* Nav items */}
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
              {nav.map((item) => {
                const active = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors"
                    style={{
                      background: active ? "rgba(249,115,22,0.2)" : "transparent",
                      color: active ? "#F97316" : "rgba(255,255,255,0.7)",
                    }}
                  >
                    <item.icon size={20} />
                    <span className="font-medium">{item.label}</span>
                    {active && <ChevronRight size={16} className="ml-auto" />}
                  </Link>
                );
              })}
            </nav>

            <div className="px-3 py-4 border-t border-white/10 space-y-1">
              <button
                onClick={() => { onRoleSwitch(); setMenuOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              >
                <Settings size={20} />
                <span className="font-medium">
                  Passer en mode {userRole === "tenant" ? "Propriétaire" : "Locataire"}
                </span>
              </button>
              <Link
                to="/"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              >
                <LogOut size={20} />
                <span className="font-medium">Déconnexion</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Page Content */}
      <main className="flex-1 pb-24">{children}</main>

      {/* Bottom Nav */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-white/10 shadow-lg"
        style={{ background: "#1E3A5F" }}
      >
        {nav.map((item) => {
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className="flex flex-col items-center gap-1 py-3 px-4 flex-1 transition-colors"
              style={{ color: active ? "#F97316" : "rgba(255,255,255,0.55)" }}
            >
              <item.icon size={22} />
              <span style={{ fontSize: "10px", fontWeight: 500 }}>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Film,
  Calendar,
  Building2,
  Users,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/store/authStore";

interface SidebarItem {
  icon: React.ElementType;
  label: string;
  path: string;
}

const sidebarItems: SidebarItem[] = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    path: "/admin/dashboard",
  },
  {
    icon: Film,
    label: "Movies",
    path: "/admin/movies",
  },
  {
    icon: Calendar,
    label: "Showtimes",
    path: "/admin/showtimes",
  },
  {
    icon: Building2,
    label: "Theaters",
    path: "/admin/theaters",
  },
  {
    icon: Users,
    label: "Users",
    path: "/admin/users",
  },
  {
    icon: BarChart3,
    label: "Analytics",
    path: "/admin/analytics",
  },
  {
    icon: Settings,
    label: "Settings",
    path: "/admin/settings",
  },
];

export default function Sidebar() {
  const location = useLocation();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-card border-r flex flex-col">
      {/* Logo */}
      <div className="p-6">
        <Link to="/admin/dashboard" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
            <Film className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-lg">MovieApp</h2>
            <p className="text-xs text-muted-foreground">Admin Panel</p>
          </div>
        </Link>
      </div>

      <Separator />

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link key={item.path} to={item.path}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3",
                  isActive && "bg-primary/10 text-primary hover:bg-primary/20"
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Button>
            </Link>
          );
        })}
      </nav>

      <Separator />

      {/* Logout */}
      <div className="p-4">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </Button>
      </div>
    </aside>
  );
}

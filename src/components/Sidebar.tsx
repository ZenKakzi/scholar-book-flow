
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Book, LayoutDashboard, Search, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

interface SidebarProps {
  userType: "student" | "admin";
}

const Sidebar: React.FC<SidebarProps> = ({ userType }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const isActive = (path: string) => {
    return location.pathname.includes(path);
  };

  const navItems = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      path: `/${userType}/dashboard`,
    },
    {
      icon: Book,
      label: "Books",
      path: `/${userType}/books`,
    },
    {
      icon: Book,
      label: userType === "student" ? "My Borrowed" : "Borrowed Books",
      path: `/${userType}/borrowed`,
    },
  ];

  if (userType === "admin") {
    navItems.push({
      icon: Search,
      label: "Search",
      path: `/${userType}/search`,
    });
  }

  return (
    <div className="bg-sidebar h-full flex flex-col min-h-screen w-64 p-4">
      <div className="flex items-center mb-8 mt-2">
        <Book className="h-8 w-8 text-library-accent mr-2" />
        <h1 className="text-xl font-bold text-white">OLMS</h1>
      </div>

      <nav className="flex-1">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <button
                onClick={() => navigate(item.path)}
                className={cn(
                  "flex items-center w-full p-3 rounded-md transition-colors text-left",
                  isActive(item.path)
                    ? "bg-sidebar-accent text-white"
                    : "text-gray-400 hover:text-white hover:bg-sidebar-accent/50"
                )}
              >
                <item.icon className="h-5 w-5 mr-3" />
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-auto">
        <button
          onClick={logout}
          className="flex items-center w-full p-3 rounded-md text-gray-400 hover:text-white hover:bg-sidebar-accent/50 transition-colors"
        >
          <LogOut className="h-5 w-5 mr-3" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

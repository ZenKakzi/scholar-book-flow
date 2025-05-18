import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Book, LayoutDashboard, Search, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  userType: "student" | "admin";
}

const Sidebar: React.FC<SidebarProps> = ({ userType }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

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

  const handleLogout = () => {
    setShowLogoutDialog(true);
  };

  const confirmLogout = () => {
    logout();
    setShowLogoutDialog(false);
  };

  return (
    <div className="bg-sidebar h-screen flex flex-col w-64 fixed">
      <div className="p-4">
        <div className="flex items-center mb-8 mt-2">
          <img src="/images/logo.png" alt="Library Logo" className="h-10 w-auto" />
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
      </div>

      <div className="mt-auto p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="flex items-center w-full p-3 rounded-md text-gray-400 hover:text-white hover:bg-sidebar-accent/50 transition-colors"
        >
          <LogOut className="h-5 w-5 mr-3" />
          <span>Logout</span>
        </button>
      </div>

      <Dialog 
        open={showLogoutDialog}
        onOpenChange={setShowLogoutDialog}
      >
        <DialogContent className="bg-library-panel text-white border-gray-700">
          <DialogHeader>
            <DialogTitle>Confirm Logout</DialogTitle>
            <DialogDescription className="text-gray-400">
              Are you sure you want to logout? You will need to login again to access your account.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowLogoutDialog(false)}
            >
              Cancel
            </Button>
            <Button 
              className="bg-red-600 hover:bg-red-700"
              onClick={confirmLogout}
            >
              Logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Sidebar;

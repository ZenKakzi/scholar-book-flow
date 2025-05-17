import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/types";
import { users } from "@/data/mockData";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for stored user on mount
    const storedUser = localStorage.getItem("libraryUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const matchedUser = users.find(
      (u) => u.email === email && u.password === password
    );

    if (matchedUser) {
      setUser(matchedUser);
      localStorage.setItem("libraryUser", JSON.stringify(matchedUser));
      toast.success("Login successful!");
      
      // Redirect based on role
      if (matchedUser.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/student/dashboard");
      }
    } else {
      toast.error("Invalid email or password");
    }
    
    setIsLoading(false);
  };

  const logout = () => {
    // Clear user state
    setUser(null);
    
    // Clear all user-related data from localStorage
    localStorage.removeItem("libraryUser");
    localStorage.removeItem("libraryBooks");
    localStorage.removeItem("libraryBorrowedBooks");
    
    // Show success message
    toast.success("Logged out successfully");
    
    // Redirect to home page
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

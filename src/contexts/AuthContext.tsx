
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User } from "@/types";
import { getCurrentUser, login as loginService, logout as logoutService } from "@/services";
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password?: string, adminKey?: string) => Promise<boolean>;
  logout: () => void;
  isAdmin: boolean;
  isStudent: boolean;
  isSuperAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already logged in
    const currentUser = getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const login = async (email: string, password?: string, adminKey?: string): Promise<boolean> => {
    setLoading(true);
    try {
      const loggedInUser = loginService(email, password, adminKey);
      if (loggedInUser) {
        setUser(loggedInUser);
        console.log('Login successful:', loggedInUser);
        toast({
          title: "Login successful",
          description: `Welcome back, ${loggedInUser.name}!`,
        });
        return true;
      } else {
        console.log('Login failed for:', email);
        toast({
          variant: "destructive",
          title: "Login failed",
          description: adminKey ? "Invalid credentials or admin key" : "Invalid credentials. Please check your email and password.",
        });
        return false;
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    logoutService();
    setUser(null);
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };

  const isAdmin = !!user && user.role === "admin";
  const isStudent = !!user && user.role === "student";
  const isSuperAdmin = !!user && user.role === "super-admin";

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAdmin,
        isStudent,
        isSuperAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

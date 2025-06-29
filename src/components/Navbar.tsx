
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Utensils, LogOut, User, Home, MessageCircle, Receipt, Bell, MenuIcon, BarChart3, ShoppingCart, Building2 } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import MobileMenubar from "./MobileMenubar";

const Navbar = () => {
  const { user, logout, isAdmin, isStudent, isSuperAdmin } = useAuth();
  const isMobile = useIsMobile();

  const navItems = [
    { 
      label: "Dashboard", 
      path: "/", 
      icon: Home, 
      show: true 
    },
    { 
      label: "Messages", 
      path: "/messaging", 
      icon: MessageCircle, 
      show: !isSuperAdmin
    },
    { 
      label: "Order Meals", 
      path: "/student-ordering", 
      icon: ShoppingCart, 
      show: isStudent 
    },
    { 
      label: "Daily Meals", 
      path: "/meal-history", 
      icon: Utensils, 
      show: isStudent 
    },
    { 
      label: "Monthly Bill", 
      path: "/monthly-bill", 
      icon: Receipt, 
      show: !isSuperAdmin
    },
    { 
      label: "Notifications", 
      path: "/notifications", 
      icon: Bell, 
      show: isAdmin 
    },
    { 
      label: "Menu Management", 
      path: "/menu-management", 
      icon: MenuIcon, 
      show: isAdmin 
    },
    { 
      label: "Bill Management", 
      path: "/bill-management", 
      icon: Receipt, 
      show: isAdmin 
    },
    { 
      label: "Feedback Analytics", 
      path: "/feedback", 
      icon: BarChart3, 
      show: isAdmin 
    },
    { 
      label: "Mess Management", 
      path: "/super-admin/dashboard", 
      icon: BarChart3, 
      show: isSuperAdmin 
    },
  ];

  const visibleItems = navItems.filter(item => item.show);

  return (
    <header className="bg-background border-b border-border shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Utensils className="h-6 w-6 mr-2 text-mess-primary" />
              <span className="font-bold text-lg text-foreground">Mess Manager</span>
            </Link>
            {isMobile && (
              <div className="ml-4">
                <MobileMenubar />
              </div>
            )}
            {!isMobile && (
              <nav className="ml-8 flex space-x-4">
                {visibleItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors dark:text-foreground dark:hover:bg-accent"
                  >
                    <item.icon className="h-4 w-4 mr-2" />
                    {item.label}
                  </Link>
                ))}
              </nav>
            )}
          </div>
          <div className="flex items-center space-x-3">
            <ThemeToggle />
            <div className="flex items-center">
              <User className="h-5 w-5 text-foreground mr-1" />
              <div className="flex flex-col">
                <span className="text-sm font-medium text-foreground">
                  {user?.name} {isSuperAdmin ? "(Super Admin)" : isAdmin ? "(Admin)" : ""}
                </span>
                {isAdmin && user?.messName && (
                  <span className="text-xs text-mess-primary flex items-center">
                    <Building2 className="h-3 w-3 mr-1" />
                    {user.messName}
                  </span>
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="text-foreground hover:bg-accent"
            >
              <LogOut className="h-4 w-4 mr-1" />
              {isMobile ? "" : "Logout"}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

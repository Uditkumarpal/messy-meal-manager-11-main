
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { 
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  Menu, 
  Utensils, 
  Home, 
  MessageCircle, 
  Receipt, 
  Bell, 
  MenuIcon,
  BarChart3,
  LogOut,
  User,
  ShoppingCart
} from "lucide-react";

const MobileMenubar = () => {
  const { user, logout, isAdmin, isStudent } = useAuth();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);

  const isSuperAdmin = user?.role === 'super-admin';

  const menuItems = [
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
      label: "Mess Management", 
      path: "/super-admin/dashboard", 
      icon: BarChart3, 
      show: isSuperAdmin 
    },
  ];

  const visibleItems = menuItems.filter(item => item.show);

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="sm">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64">
          <SheetHeader>
            <SheetTitle className="flex items-center">
              <Utensils className="h-5 w-5 mr-2 text-mess-primary" />
              Mess Manager
            </SheetTitle>
          </SheetHeader>
          <div className="mt-6 space-y-2">
            {visibleItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === item.path
                    ? "bg-mess-primary/20 text-mess-primary dark:bg-mess-primary/30 dark:text-mess-primary"
                    : "text-foreground hover:bg-accent hover:text-accent-foreground dark:text-foreground dark:hover:bg-accent"
                }`}
              >
                <item.icon className="h-4 w-4 mr-3" />
                {item.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-border">
              <div className="flex items-center px-3 py-2 text-sm text-foreground">
                <User className="h-4 w-4 mr-3" />
                <span>{user?.name}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="w-full justify-start px-3 py-2 text-sm text-foreground hover:bg-accent"
              >
                <LogOut className="h-4 w-4 mr-3" />
                Logout
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Menubar className="border-none bg-transparent">
      {visibleItems.map((item) => (
        <MenubarMenu key={item.path}>
          <MenubarTrigger asChild>
            <Link
              to={item.path}
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                location.pathname === item.path
                  ? "bg-mess-primary/20 text-mess-primary dark:bg-mess-primary/30 dark:text-mess-primary"
                  : "text-foreground hover:bg-accent hover:text-accent-foreground dark:text-foreground dark:hover:bg-accent"
              }`}
            >
              <item.icon className="h-4 w-4 mr-2" />
              {item.label}
            </Link>
          </MenubarTrigger>
        </MenubarMenu>
      ))}
    </Menubar>
  );
};

export default MobileMenubar;

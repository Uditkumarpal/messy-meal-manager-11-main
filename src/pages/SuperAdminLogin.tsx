
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Utensils, Shield, RefreshCw } from "lucide-react";
import { resetUserData } from "@/services/userService";
import { useToast } from "@/hooks/use-toast";

const SuperAdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Attempting super admin login with:', email);
    
    if (email.trim() && password.trim()) {
      const success = await login(email, password);
      console.log('Login result:', success);
      
      if (success) {
        console.log('Navigating to super admin dashboard');
        navigate("/super-admin/dashboard");
      }
    }
  };

  const handleResetData = () => {
    resetUserData();
    toast({
      title: "Data Reset",
      description: "User data has been reset to defaults",
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-mess-light to-background p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-mess-primary rounded-full p-3">
              <Shield className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold">Super Admin</h1>
          <p className="text-muted-foreground mt-1">Mess Management System Control</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Super Admin Login</CardTitle>
            <CardDescription>
              Access the master control panel for mess management
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter super admin email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button 
                type="submit" 
                className="w-full bg-mess-primary hover:bg-mess-dark" 
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login as Super Admin"}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                className="w-full" 
                onClick={handleResetData}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Reset Data
              </Button>
              <div className="text-center text-sm">
                <Link to="/login" className="text-mess-primary hover:underline">
                  Back to Regular Login
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default SuperAdminLogin;

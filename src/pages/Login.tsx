
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Utensils, Key, Building2 } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminKey, setAdminKey] = useState("");
  const [showAdminKey, setShowAdminKey] = useState(false);
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Attempting login with:', email, showAdminKey ? 'with admin key' : 'without admin key');
    
    if (email.trim() && password.trim()) {
      const success = await login(email, password, showAdminKey ? adminKey : undefined);
      console.log('Login result:', success);
      
      if (success) {
        navigate("/");
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-mess-light to-background p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-mess-primary rounded-full p-3">
              <Utensils className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold">Welcome Back</h1>
          <p className="text-muted-foreground mt-1">Sign in to your mess account</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
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
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="adminLogin"
                  checked={showAdminKey}
                  onChange={(e) => setShowAdminKey(e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="adminLogin" className="text-sm flex items-center">
                  <Building2 className="h-4 w-4 mr-1" />
                  Admin Login (requires mess key)
                </Label>
              </div>

              {showAdminKey && (
                <div className="space-y-2">
                  <Label htmlFor="adminKey">Mess Admin Key</Label>
                  <Input
                    id="adminKey"
                    type="text"
                    placeholder="Enter admin key for your mess"
                    value={adminKey}
                    onChange={(e) => setAdminKey(e.target.value)}
                    required={showAdminKey}
                  />
                  <p className="text-xs text-muted-foreground">
                    <Key className="inline h-3 w-3 mr-1" />
                    This key is provided by Super Admin and is specific to your mess
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button 
                type="submit" 
                className="w-full bg-mess-primary hover:bg-mess-dark" 
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>
              <div className="text-center text-sm space-y-2">
                <Link to="/register" className="text-mess-primary hover:underline block">
                  Don't have an account? Sign up
                </Link>
                <Link to="/admin-request" className="text-mess-primary hover:underline block">
                  Request Admin Access
                </Link>
                <Link to="/super-admin/login" className="text-mess-primary hover:underline block">
                  Super Admin Login
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Login;

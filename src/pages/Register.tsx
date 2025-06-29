
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Utensils } from "lucide-react";
import { registerStudent } from "@/services";
import { useToast } from "@/hooks/use-toast";
import MessSelector from "@/components/MessSelector";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedMessId, setSelectedMessId] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Passwords do not match",
      });
      return;
    }

    if (!selectedMessId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a mess",
      });
      return;
    }

    setLoading(true);
    
    try {
      const user = registerStudent(name, email, studentId, password, selectedMessId);
      
      if (user) {
        toast({
          title: "Registration successful",
          description: "Welcome to the mess management system!",
        });
        navigate("/");
      } else {
        toast({
          variant: "destructive",
          title: "Registration failed",
          description: "Email already exists. Please use a different email.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: "An error occurred during registration",
      });
    } finally {
      setLoading(false);
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
          <h1 className="text-3xl font-bold">Create Account</h1>
          <p className="text-muted-foreground mt-1">Join the mess management system</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Student Registration</CardTitle>
            <CardDescription>
              Create your student account to get started
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
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
                <Label htmlFor="studentId">Student ID</Label>
                <Input
                  id="studentId"
                  type="text"
                  placeholder="Enter your student ID"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  required
                />
              </div>
              
              <MessSelector 
                selectedMessId={selectedMessId}
                onMessChange={setSelectedMessId}
                required
              />

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                {loading ? "Creating account..." : "Create Account"}
              </Button>
              <div className="text-center text-sm">
                <Link to="/login" className="text-mess-primary hover:underline">
                  Already have an account? Sign in
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Register;

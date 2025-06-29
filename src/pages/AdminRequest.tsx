
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Building2, Send, CreditCard } from "lucide-react";
import { createAdminRequest } from "@/services/messagingService";

const AdminRequest = () => {
  const [messName, setMessName] = useState("");
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [businessDetails, setBusinessDetails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!messName.trim() || !adminName.trim() || !adminEmail.trim() || !businessDetails.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all required fields",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Create the admin request
      createAdminRequest(messName, adminName, adminEmail, businessDetails);
      
      toast({
        title: "Request Submitted",
        description: "Your admin request has been sent to the Super Admin. You will be contacted once approved.",
      });

      // Clear form
      setMessName("");
      setAdminName("");
      setAdminEmail("");
      setBusinessDetails("");

      // Redirect to payment page (placeholder for now)
      navigate("/admin-payment");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit request. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-mess-light to-background p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-mess-primary rounded-full p-3">
              <Building2 className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold">Request Admin Access</h1>
          <p className="text-muted-foreground mt-1">Apply to become a mess administrator</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Admin Application</CardTitle>
            <CardDescription>
              Fill out this form to request admin access for your mess
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="messName">Mess Name *</Label>
                <Input
                  id="messName"
                  type="text"
                  placeholder="e.g., North Campus Mess"
                  value={messName}
                  onChange={(e) => setMessName(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="adminName">Your Name *</Label>
                <Input
                  id="adminName"
                  type="text"
                  placeholder="Enter your full name"
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="adminEmail">Email Address *</Label>
                <Input
                  id="adminEmail"
                  type="email"
                  placeholder="Enter your email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessDetails">Business Details *</Label>
                <Textarea
                  id="businessDetails"
                  placeholder="Describe your mess business, location, capacity, and experience..."
                  value={businessDetails}
                  onChange={(e) => setBusinessDetails(e.target.value)}
                  rows={4}
                  required
                />
              </div>

              <div className="bg-blue-50 p-4 rounded-md">
                <div className="flex items-start space-x-2">
                  <CreditCard className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">Payment Required</p>
                    <p className="text-xs text-blue-700 mt-1">
                      A one-time setup fee of ₹5,000 is required to activate your mess admin account. 
                      You will be redirected to the payment page after submitting this form.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            
            <div className="px-6 pb-6 space-y-4">
              <Button 
                type="submit" 
                className="w-full bg-mess-primary hover:bg-mess-dark" 
                disabled={isSubmitting}
              >
                <Send className="mr-2 h-4 w-4" />
                {isSubmitting ? "Submitting..." : "Submit Request & Proceed to Payment"}
              </Button>
              
              <div className="text-center">
                <Link to="/login" className="text-sm text-mess-primary hover:underline">
                  Already have admin access? Sign in
                </Link>
              </div>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default AdminRequest;

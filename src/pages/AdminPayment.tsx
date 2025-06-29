
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, Check, Building2, ArrowLeft } from "lucide-react";

const AdminPayment = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const { toast } = useToast();

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentComplete(true);
      toast({
        title: "Payment Successful",
        description: "Your payment has been processed. Super Admin will review your request within 24 hours.",
      });
    }, 3000);
  };

  if (paymentComplete) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-mess-light to-background p-4">
        <div className="max-w-md w-full">
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="flex justify-center mb-4">
                <div className="bg-green-100 rounded-full p-3">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
              <p className="text-muted-foreground mb-6">
                Your admin request has been submitted and payment processed. 
                The Super Admin will review your application within 24 hours.
              </p>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  You will receive an email with your admin key once approved.
                </p>
                <Link to="/login">
                  <Button className="w-full">
                    Back to Login
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-mess-light to-background p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-mess-primary rounded-full p-3">
              <CreditCard className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold">Complete Payment</h1>
          <p className="text-muted-foreground mt-1">Secure your mess admin access</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Admin Setup Fee</CardTitle>
            <CardDescription>
              One-time payment to activate your mess admin account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-gradient-to-r from-mess-primary/10 to-mess-secondary/10 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">Mess Admin License</p>
                  <p className="text-sm text-muted-foreground">Lifetime access</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">₹5,000</p>
                  <p className="text-xs text-muted-foreground">One-time fee</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-medium">What's included:</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  Complete mess management system
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  Student billing and tracking
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  Menu management tools
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  Analytics and feedback system
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  24/7 technical support
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <Button 
                onClick={handlePayment}
                className="w-full bg-mess-primary hover:bg-mess-dark"
                disabled={isProcessing}
              >
                <CreditCard className="mr-2 h-4 w-4" />
                {isProcessing ? "Processing Payment..." : "Pay ₹5,000 Now"}
              </Button>
              
              <Link to="/admin-request">
                <Button variant="outline" className="w-full">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Application
                </Button>
              </Link>
            </div>

            <div className="text-xs text-center text-muted-foreground">
              <p>Secure payment powered by Razorpay</p>
              <p className="mt-1">Your payment information is encrypted and secure</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPayment;

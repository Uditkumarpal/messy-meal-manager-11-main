
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/providers/ThemeProvider";
import Layout from "@/components/Layout";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import Messaging from "@/pages/Messaging";
import Notifications from "@/pages/Notifications";
import MonthlyBill from "@/pages/MonthlyBill";
import MealHistory from "@/pages/MealHistory";
import MenuManagement from "@/pages/MenuManagement";
import FeedbackAnalytics from "@/pages/FeedbackAnalytics";
import SuperAdminLogin from "@/pages/SuperAdminLogin";
import SuperAdminDashboard from "@/pages/SuperAdminDashboard";
import BillManagement from "@/pages/BillManagement";
import StudentOrdering from "@/pages/StudentOrdering";
import AdminRequest from "@/pages/AdminRequest";
import AdminPayment from "@/pages/AdminPayment";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="mess-manager-theme">
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/admin-request" element={<AdminRequest />} />
              <Route path="/admin-payment" element={<AdminPayment />} />
              <Route path="/super-admin/login" element={<SuperAdminLogin />} />
              <Route element={<Layout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/messaging" element={<Messaging />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/monthly-bill" element={<MonthlyBill />} />
                <Route path="/meal-history" element={<MealHistory />} />
                <Route path="/student-ordering" element={<StudentOrdering />} />
                <Route path="/menu-management" element={<MenuManagement />} />
                <Route path="/feedback" element={<FeedbackAnalytics />} />
                <Route path="/super-admin/dashboard" element={<SuperAdminDashboard />} />
                <Route path="/bill-management" element={<BillManagement />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;

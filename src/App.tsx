
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Explore from "./pages/Explore";
import Profile from "./pages/Profile";
import DesignDetail from "./pages/DesignDetail";
import AIGenerator from "./pages/AIGenerator";
import Layout from "./components/Layout";
import SettingsPage from "./pages/SettingsPage";
import TermsOfServicePage from "./pages/TermsOfServicePage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import CookiePolicyPage from "./pages/CookiePolicyPage";
import ArchitectsListPage from "./pages/ArchitectsListPage";
import HomeownerDashboard from "./pages/HomeownerDashboard";
import ArchitectDashboard from "./pages/ArchitectDashboard";

// Auth pages
import SignupPage from "./pages/SignupPage";
import VerifyOTPPage from "./pages/VerifyOTPPage";
import CreatePasswordPage from "./pages/CreatePasswordPage";
import ArchitectProfilePage from "./pages/ArchitectProfilePage";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";

// Auth context
import { AuthProvider } from "./contexts/AuthContext";

// Moving QueryClient inside the component to ensure React context is available
const App = () => {
  // Create a new QueryClient instance inside the component
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Layout><Index /></Layout>} />
              <Route path="/terms-of-service" element={<Layout><TermsOfServicePage /></Layout>} />
              <Route path="/privacy-policy" element={<Layout><PrivacyPolicyPage /></Layout>} />
              <Route path="/cookie-policy" element={<Layout><CookiePolicyPage /></Layout>} />
              
              {/* Auth routes */}
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/verify-otp" element={<VerifyOTPPage />} />
              <Route path="/create-password" element={<CreatePasswordPage />} />
              <Route path="/login" element={<LoginPage />} />
              
              {/* Protected routes - require authentication */}
              <Route 
                path="/homeowner-dashboard" 
                element={
                  <ProtectedRoute>
                    <Layout><HomeownerDashboard /></Layout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/architect-dashboard" 
                element={
                  <ProtectedRoute>
                    <Layout><ArchitectDashboard /></Layout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/explore" 
                element={
                  <ProtectedRoute>
                    <Layout><Explore /></Layout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/architects" 
                element={
                  <ProtectedRoute>
                    <Layout><ArchitectsListPage /></Layout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/architect-profile" 
                element={
                  <ProtectedRoute>
                    <Layout><ArchitectProfilePage /></Layout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile/:id" 
                element={
                  <ProtectedRoute>
                    <Layout><Profile /></Layout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/design/:id" 
                element={
                  <ProtectedRoute>
                    <Layout><DesignDetail /></Layout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/ai-generator" 
                element={
                  <ProtectedRoute>
                    <Layout><AIGenerator /></Layout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/settings" 
                element={
                  <ProtectedRoute>
                    <Layout><SettingsPage /></Layout>
                  </ProtectedRoute>
                } 
              />
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;

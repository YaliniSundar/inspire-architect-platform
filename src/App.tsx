
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
import HireArchitectPage from "./pages/HireArchitectPage";
import ChatPage from "./pages/ChatPage";
import ArchitectProfilePage from "./pages/ArchitectProfilePage";

// Moving QueryClient inside the component to ensure React context is available
const App = () => {
  // Create a new QueryClient instance inside the component
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
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
            <Route path="/explore" element={<Layout><Explore /></Layout>} />
            <Route path="/architects" element={<Layout><ArchitectsListPage /></Layout>} />
            <Route path="/architect-profile" element={<Layout><ArchitectProfilePage /></Layout>} />
            <Route path="/profile/:id" element={<Layout><Profile /></Layout>} />
            <Route path="/design/:id" element={<Layout><DesignDetail /></Layout>} />
            <Route path="/hire/:id" element={<Layout><HireArchitectPage /></Layout>} />
            <Route path="/messages" element={<Layout><ChatPage /></Layout>} />
            <Route path="/ai-generator" element={<Layout><AIGenerator /></Layout>} />
            <Route path="/settings" element={<Layout><SettingsPage /></Layout>} />
            <Route path="/homeowner-dashboard" element={<Layout><HomeownerDashboard /></Layout>} />
            <Route path="/architect-dashboard" element={<Layout><ArchitectDashboard /></Layout>} />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

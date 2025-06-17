
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import DashboardUpload from "./pages/DashboardUpload";
import DashboardFiles from "./pages/DashboardFiles";
import FileShare from "./pages/FileShare";
import NotFound from "./pages/NotFound";
import AuthWrapper from "./components/AuthWrapper";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            <AuthWrapper>
              <Index />
            </AuthWrapper>
          } />
          <Route path="/dashboard" element={
            <AuthWrapper requireAuth>
              <Dashboard />
            </AuthWrapper>
          } />
          <Route path="/dashboard/upload" element={
            <AuthWrapper requireAuth>
              <DashboardUpload />
            </AuthWrapper>
          } />
          <Route path="/dashboard/my-files" element={
            <AuthWrapper requireAuth>
              <DashboardFiles />
            </AuthWrapper>
          } />
          <Route path="/share/:fileId" element={<FileShare />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

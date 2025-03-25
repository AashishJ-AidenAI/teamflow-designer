
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import BuilderPage from "./pages/BuilderPage";
import DashboardPage from "./pages/DashboardPage";
import TestingPage from "./pages/TestingPage";
import FineTuningPage from "./pages/FineTuningPage";
import MainLayout from "./components/layout/MainLayout";
import { AgentProvider } from "./context/AgentContext";
import { KnowledgebaseProvider } from "./context/KnowledgebaseContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AgentProvider>
        <KnowledgebaseProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route element={<MainLayout />}>
                <Route path="/builder" element={<BuilderPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/testing" element={<TestingPage />} />
                <Route path="/finetuning" element={<FineTuningPage />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </KnowledgebaseProvider>
      </AgentProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

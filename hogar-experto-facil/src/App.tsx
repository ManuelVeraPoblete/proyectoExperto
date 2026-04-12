
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import BuscarExpertos from "./pages/BuscarExpertos";
import PublicarTrabajo from "./pages/PublicarTrabajo";
import Dashboard from "./pages/Dashboard";
import BuscarTrabajosExperto from "./pages/BuscarTrabajosExperto";
import MisTrabajosExperto from "./pages/MisTrabajosExperto";
import MisMensajesExperto from "./pages/MisMensajesExperto";
import PerfilExperto from "./pages/PerfilExperto";
import PerfilPublicoExperto from "./pages/PerfilPublicoExperto";
import NotFound from "./pages/NotFound";
import Register from "./pages/Register";
import MensajesDirectos from "./pages/MensajesDirectos";
import AuthDialog from "@/components/AuthDialog";
import Layout from "@/components/Layout";

const queryClient = new QueryClient();

const AppContent = () => {
  const { authDialog, closeAuthDialog, setAuthDialogMode } = useAuth();

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/buscar" element={<BuscarExpertos />} />
        <Route path="/publicar" element={<PublicarTrabajo />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/experto/buscar-trabajos" element={<BuscarTrabajosExperto />} />
        <Route path="/experto/mis-trabajos" element={<MisTrabajosExperto />} />
        <Route path="/experto/mensajes" element={<MisMensajesExperto />} />
        <Route path="/experto/perfil" element={<PerfilExperto />} />
        <Route path="/experto/:id" element={<PerfilPublicoExperto />} />
        <Route path="/register" element={<Register />} />
        <Route path="/mensajes" element={<MensajesDirectos />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <AuthDialog
        isOpen={authDialog.isOpen}
        onClose={closeAuthDialog}
        mode={authDialog.mode}
        onModeChange={setAuthDialogMode}
      />
    </Layout>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

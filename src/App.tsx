import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";
import StaffDirectory from "./pages/StaffDirectory";
import Products from "./pages/Products";
import ProductStatus from "./pages/ProductStatus";
import Facilities from "./pages/Facilities";
import Gallery from "./pages/Gallery";
import Archives from "./pages/Archives";
import Contact from "./pages/Contact";
import AdminPanel from "./pages/AdminPanel";
import Layout from "./components/Layout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Index />} />
              <Route path="staff" element={<StaffDirectory />} />
              <Route path="products" element={<Products />} />
              <Route path="product-status" element={<ProductStatus />} />
              <Route path="facilities" element={<Facilities />} />
              <Route path="gallery" element={<Gallery />} />
              <Route path="archives" element={<Archives />} />
              <Route path="contact" element={<Contact />} />
              <Route 
                path="admin" 
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminPanel />
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={<NotFound />} />
            </Route>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

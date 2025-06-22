import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import TransportBooking from "./pages/TransportBooking";
import HotelBooking from "./pages/HotelBooking";
import UmrahApplication from "./pages/UmrahApplication";
import GroupFlights from "./pages/GroupFlights";
import Services from "./pages/Services";
import UmrahPackages from "./pages/UmrahPackages";
import GroupPackages from "./pages/GroupPackages";
import CustomPackages from "./pages/CustomPackages";
import PackageDetails from "./pages/PackageDetails";
import Blogs from "./pages/Blogs";
import BlogDetail from "./pages/BlogDetail";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/transport" element={<TransportBooking />} />
          <Route path="/hotel" element={<HotelBooking />} />
          <Route path="/apply" element={<UmrahApplication />} />
          <Route path="/group-flights" element={<GroupFlights />} />
          <Route path="/services" element={<Services />} />
          <Route path="/umrah-packages" element={<UmrahPackages />} />
          <Route path="/group-packages" element={<GroupPackages />} />
          <Route path="/custom-packages" element={<CustomPackages />} />
          <Route path="/package-details/:id" element={<PackageDetails />} />
          <Route path="/blog-post" element={<Blogs />} />
          <Route path="/blog-post/:slug" element={<BlogDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

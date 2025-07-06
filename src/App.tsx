
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import React, { Suspense, lazy } from "react";
import ZiarathActivityDetail from "./pages/ZiarathActivityDetail";

const queryClient = new QueryClient();

const Index = lazy(() => import("./pages/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));
const TransportBooking = lazy(() => import("./pages/TransportBooking"));
const HotelBooking = lazy(() => import("./pages/HotelBooking"));
const UmrahApplication = lazy(() => import("./pages/UmrahApplication"));
const GroupFlights = lazy(() => import("./pages/GroupFlights"));
const Services = lazy(() => import("./pages/Services"));
const UmrahPackages = lazy(() => import("./pages/UmrahPackages"));
const GroupPackages = lazy(() => import("./pages/GroupPackages"));
const GroupPackageDetail = lazy(() => import("./pages/GroupPackageDetail"));
const CustomPackages = lazy(() => import("./pages/CustomPackages"));
const PackageDetails = lazy(() => import("./pages/PackageDetails"));
const AdvancedPackageDetails = lazy(
  () => import("./pages/AdvancedPackageDetails"),
);
const Blogs = lazy(() => import("./pages/Blogs"));
const BlogDetail = lazy(() => import("./pages/BlogDetail"));
const Contact = lazy(() => import("./pages/Contact"));
const FAQ = lazy(() => import("./pages/FAQ"));
const AboutUs = lazy(() => import("./pages/AboutUs"));
const ControlPanel = lazy(() => import("./pages/ControlPanel"));
const GuideBooking = lazy(() => import("./pages/GuideBooking"));
const ZiarathBooking = lazy(() => import("./pages/ZiarathBooking"));
const OtherSaudiVisas = lazy(() => import("./pages/OtherSaudiVisas"));
const BuildYourOwnUmrah = lazy(() => import("./pages/BuildYourOwnUmrah"));
const PackageDetailDynamic = lazy(() => import("./pages/PackageDetailDynamic"));
const Terms = lazy(() => import("./pages/Terms"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Refund = lazy(() => import("./pages/Refund"));
const TravelTerms = lazy(() => import("./pages/TravelTerms"));
const Support = lazy(() => import("./pages/Support"));
const Careers = lazy(() => import("./pages/Careers"));
const PaymentSuccess = lazy(() => import("./pages/PaymentSuccess"));
const PaymentFailure = lazy(() => import("./pages/PaymentFailure"));

const Loader = () => (
  <div style={{ textAlign: "center", marginTop: "3rem" }}>Loading...</div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<Loader />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/transport" element={<TransportBooking />} />
              <Route path="/hotel" element={<HotelBooking />} />
              <Route path="/apply" element={<UmrahApplication />} />
              <Route
                path="/apply-umrah-visa-online"
                element={<UmrahApplication />}
              />
              <Route path="/group-flights" element={<GroupFlights />} />
              <Route path="/services" element={<Services />} />
              <Route path="/umrah-packages" element={<UmrahPackages />} />
              <Route path="/group-packages" element={<GroupPackages />} />
              <Route
                path="/group-packages/:slug"
                element={<PackageDetailDynamic />}
              />
              <Route path="/custom-packages" element={<CustomPackages />} />
              <Route
                path="/custom-packages/:slug"
                element={<PackageDetailDynamic />}
              />
              <Route
                path="/package-details/:slug"
                element={<PackageDetailDynamic />}
              />
              <Route
                path="/advanced-package/:slug"
                element={<PackageDetailDynamic />}
              />
              <Route path="/blog-post" element={<Blogs />} />
              <Route path="/blog-post/:slug" element={<BlogDetail />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/guide" element={<GuideBooking />} />
              <Route path="/ziarath" element={<ZiarathBooking />} />
              <Route
                path="/ziarath/:slug"
                element={<ZiarathActivityDetail />}
              />
              <Route path="/other-visas" element={<OtherSaudiVisas />} />
              <Route path="/control-panel" element={<ControlPanel />} />
              <Route
                path="/build-your-own-umrah"
                element={<BuildYourOwnUmrah />}
              />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/cancellation-and-refund" element={<Refund />} />
              <Route path="/travel-terms" element={<TravelTerms />} />
              <Route path="/support" element={<Support />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/payment/success" element={<PaymentSuccess />} />
              <Route path="/payment/failure" element={<PaymentFailure />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;

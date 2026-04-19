import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { SEOProvider } from "./components/SEO";
import { Layout } from "./components/layout/Layout";
import { AdminLayout } from "./components/layout/AdminLayout";
import ChatWidget from "./components/ChatWidget";
import CookieConsent from "./components/CookieConsent";
import Home from "./_pages/Home";
import Products from "./_pages/Products";
import ProductDetail from "./_pages/ProductDetail";
import ProductFamily from "./_pages/ProductFamily";
import About from "./_pages/About";
import Contact from "./_pages/Contact";
import Chat from "./_pages/Chat";
import CatalogDivision from "./_pages/CatalogDivision";
import CatalogIndex from "./_pages/CatalogIndex";
import CatalogProductDetail from "./_pages/CatalogProductDetail";
import CatalogCompare from "./_pages/CatalogCompare";
import DistrictsIndex from "./_pages/DistrictsIndex";
import DistrictPage from "./_pages/DistrictPage";
import AdminLogin from "./_pages/AdminLogin";
import AdminDashboard from "./_pages/AdminDashboard";
import AdminPipeline from "./_pages/AdminPipeline";
import AdminLeads from "./_pages/AdminLeads";
import AdminAnalytics from "./_pages/AdminAnalytics";
import AdminProducts from "./_pages/AdminProducts";
import AdminImports from "./_pages/AdminImports";
import AdminWhatsApp from "./_pages/AdminWhatsApp";
import AdminReview from "./_pages/AdminReview";
import { VisitorProvider } from "./context/VisitorContext";
import "./App.css";

function App() {
  return (
    <SEOProvider>
      <VisitorProvider>
        <BrowserRouter>
          <Toaster position="top-right" richColors closeButton />
        <Routes>
          {/* Public routes with header/footer */}
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Navigate to="/catalog" replace />} />
            <Route path="/products/family/:familyName" element={<ProductFamily />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/catalog" element={<CatalogIndex />} />
            <Route path="/catalog/:divisionSlug" element={<CatalogDivision />} />
            <Route path="/catalog/products/:slug" element={<CatalogProductDetail />} />
            <Route path="/catalog/compare" element={<CatalogCompare />} />
            <Route path="/districts" element={<DistrictsIndex />} />
            <Route path="/districts/:slug" element={<DistrictPage />} />
          </Route>

          {/* Admin login (no layout) */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Admin routes with sidebar */}
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/pipeline" element={<AdminPipeline />} />
            <Route path="/admin/leads" element={<AdminLeads />} />
            <Route path="/admin/analytics" element={<AdminAnalytics />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/admin/imports" element={<AdminImports />} />
            <Route path="/admin/whatsapp" element={<AdminWhatsApp />} />
            <Route path="/admin/review" element={<AdminReview />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={
            <div className="min-h-screen flex items-center justify-center bg-white font-[Manrope]">
              <div className="text-center">
                <h1 className="text-6xl font-bold text-slate-200">404</h1>
                <p className="text-slate-500 mt-2">Page not found</p>
                <a href="/" className="text-sm text-teal-600 font-medium mt-3 inline-block hover:text-teal-700">Go Home</a>
              </div>
            </div>
          } />
        </Routes>
        <ChatWidget />
        <CookieConsent />
      </BrowserRouter>
      </VisitorProvider>
    </SEOProvider>
  );
}

export default App;

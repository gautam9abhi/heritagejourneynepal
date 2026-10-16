import { useState, useRef } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { AuthProvider } from '@/contexts/AuthContext';
import EmergencyNotice from '@/components/EmergencyNotice';

// Pages
import Index from './pages/Index';
import Auth from './pages/Auth';
import Destinations from './pages/destinations';
import DestinationDetail from './pages/destinations/DestinationDetail';
import TrekkingPage from './pages/trekking';
import AnnapurnaBaseCamp from './pages/trekking/AnnapurnaBasecamp';
import RoundAnnapurnaTrek from './pages/trekking/RoundAnnapurnaTrek';
import EverestBaseCampTrek from './pages/trekking/EverestBaseCampTrek';
import LangtangHimalTrek from './pages/trekking/LangtangHimalTrek';
import UpperMustang from './pages/trekking/UpperMustang';
import ShortDurationTreks from './pages/trekking/ShortDurationTreks';
import ManasluCircuitTrek from './pages/trekking/ManasluCircuitTrek';
import MicePage from './pages/mice';
import MiceDetail from './pages/mice/MiceDetail';
import Pages from "./pages/admin/Pages";
import PageEditor from "./pages/admin/PageEditor";
import Settings from "./pages/admin/Settings";
import AboutUs from './pages/AboutUs';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import Dashboard from "./pages/admin/Dashboard";
import Media from "./pages/admin/Media";
import DestinationsAdmin from "./pages/admin/Destinations";
import DestinationEditor from "./pages/admin/DestinationEditor";
import EmergencyNotices from "./pages/admin/EmergencyNotices";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import GalleryPage from "./pages/Gallery";
import ScrollToTop from "./components/ScrollToTop";
import VideosPage from './pages/VideosPage';
import Tours from './components/Tours'; // ← ADDED THIS

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <EmergencyNotice />
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/destinations" element={<Destinations />} />
              <Route path="/destinations/:slug" element={<DestinationDetail />} />
              <Route path="/trekking" element={<TrekkingPage />} />              
              <Route path="/trekking/annapurna-base-camp" element={<AnnapurnaBaseCamp />} />
              <Route path="/trekking/round-annapurna-trek" element={<RoundAnnapurnaTrek />} />
              <Route path="/trekking/everest-base-camp-trek" element={<EverestBaseCampTrek />} />
              <Route path="/trekking/langtang-himal-trek" element={<LangtangHimalTrek />} />
              <Route path="/trekking/upper-mustang" element={<UpperMustang />} />
              <Route path="/trekking/short-duration-treks" element={<ShortDurationTreks />} />
              <Route path="/trekking/manaslu-circuit-trek" element={<ManasluCircuitTrek />} />
              <Route path="/mice-tours" element={<MicePage />} />
              <Route path="/mice-tours/:slug" element={<MiceDetail />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/videos" element={<VideosPage />} />
              <Route path="/tours" element={<Tours />} /> {/* ← ADDED THIS */}

              {/* Admin Routes */}
              <Route path="/admin" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/emergency-notices" element={
                <ProtectedRoute requireEditor>
                  <EmergencyNotices />
                </ProtectedRoute>
              } />
              <Route path="/admin/destinations" element={
                <ProtectedRoute requireEditor>
                  <DestinationsAdmin />
                </ProtectedRoute>
              } />
              <Route path="/admin/destinations/:id" element={
                <ProtectedRoute requireEditor>
                  <DestinationEditor />
                </ProtectedRoute>
              } />
              <Route path="/admin/media" element={
                <ProtectedRoute requireEditor>
                  <Media />
                </ProtectedRoute>
              } />
              <Route path="/admin/pages" element={
                <ProtectedRoute requireEditor>
                  <Pages />
                </ProtectedRoute>
              } />
              <Route path="/admin/pages/:id" element={
                <ProtectedRoute requireEditor>
                  <PageEditor />
                </ProtectedRoute>
              } />
              <Route path="/admin/settings" element={
                <ProtectedRoute requireAdmin>
                  <Settings />
                </ProtectedRoute>
              } />
              
              {/* Fallback route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
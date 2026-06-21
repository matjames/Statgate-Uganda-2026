import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Home from "@/pages/Home";
import Recruitment from "@/pages/Recruitment";
import Ethics from "@/pages/Ethics";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";
import Dashboard from "@/pages/Dashboard";
import Explorer from "@/pages/Explorer";
import Governance from "@/pages/Governance";
import Reports from "@/pages/Reports";
import AIWorkspace from "@/pages/AIWorkspace";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ConsentModal from "@/components/home/ConsentModal";
import { Toaster } from "@/components/ui/sonner";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const user = localStorage.getItem("statgate_user");
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

import ParticipantPortal from "@/pages/ParticipantPortal";

import AdvancedSystems from "@/pages/AdvancedSystems";

export default function App() {
  return (
    <Router>
      <Suspense fallback={<div className="flex h-screen items-center justify-center bg-background text-[#0A1D56] font-bold text-2xl animate-pulse">Initializing StatGate Uganda Operating System...</div>}>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/recruitment" element={<Recruitment />} />
              <Route path="/ethics" element={<Ethics />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/participant-portal" element={<ParticipantPortal />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/explorer" 
                element={
                  <ProtectedRoute>
                    <Explorer />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/governance" 
                element={
                  <ProtectedRoute>
                    <Governance />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/reports" 
                element={
                  <ProtectedRoute>
                    <Reports />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/ai" 
                element={
                  <ProtectedRoute>
                    <AIWorkspace />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/advanced" 
                element={
                  <ProtectedRoute>
                    <AdvancedSystems />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
          <Footer />
          <ConsentModal />
          <Toaster />
        </div>
      </Suspense>
    </Router>
  );
}

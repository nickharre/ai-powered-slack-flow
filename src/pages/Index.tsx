import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HeroSection from "@/components/HeroSection";
import AppDashboard from "@/components/AppDashboard";
import { useAuth } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";

const Index = () => {
  return (
    <ProtectedRoute>
      <HeroSection />
      <AppDashboard />
    </ProtectedRoute>
  );
};

export default Index;

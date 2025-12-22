import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export function LandingRedirect() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      // If user is authenticated, redirect to dashboard
      navigate('/dashboard', { replace: true });
    }
  }, [user, loading, navigate]);

  return null;
}


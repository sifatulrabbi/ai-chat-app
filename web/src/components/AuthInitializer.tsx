import React, { useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { Navigate, Outlet } from "react-router";

export const AuthInitializer: React.FC = () => {
  const { initialize, loading, user } = useAuthStore();

  useEffect(() => {
    initialize();
  }, []);

  return (
    <>
      {loading ? (
        <div className="flex h-screen w-screen items-center justify-center text-2xl font-bold animate">
          Loading...
        </div>
      ) : user ? (
        <Outlet />
      ) : (
        <Navigate to="/login" replace />
      )}
    </>
  );
};

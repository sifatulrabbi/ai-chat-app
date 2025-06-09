import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuthStore } from "../store/authStore";
import { FaX } from "react-icons/fa6";

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { signIn, initialize, loading, error, user } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn(email, password);
  };

  useEffect(() => {
    initialize();
  }, []);

  useEffect(() => {
    if (user) navigate("/", { replace: true });
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-black">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-screen bg-white text-black p-6">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-full max-w-md"
      >
        {error && (
          <div className="flex items-center gap-2 text-red-600 bg-red-100 text-sm p-4 rounded-xs w-full">
            <FaX />
            {error}
          </div>
        )}
        <input
          type="email"
          placeholder="Email"
          autoComplete="email"
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-3 text-base border border-black outline-none"
        />
        <input
          type="password"
          placeholder="Password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-3 text-base border border-black outline-none"
        />
        <button
          type="submit"
          className="p-3 text-base bg-black text-white cursor-pointer"
        >
          Log In
        </button>
      </form>
    </div>
  );
};

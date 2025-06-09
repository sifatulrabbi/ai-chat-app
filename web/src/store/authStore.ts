import { create } from "zustand";
import { supabase } from "../supabase";
import { type User } from "@supabase/supabase-js";
import { REST_API_URL } from "../constants";

type AuthStore = {
  user: User | null;
  profile: any | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  setUser: (user: any | null) => void;
  initialize: () => Promise<void>;
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  profile: null,
  loading: true,
  error: null,

  setUser: (user) => set({ user }),

  signIn: async (email, password) => {
    set({ loading: true, error: null });
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      set({ error: error.message, loading: false, user: null });
      return;
    }
    set({
      user: data.session.user,
      profile: null,
      loading: false,
      error: null,
    });
  },

  signUp: async (email, password) => {
    set({ loading: true, error: null });
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) {
      set({ error: error.message, loading: false, user: null });
      return;
    }
    set({
      user: data.user,
      profile: null,
      loading: false,
      error: null,
    });
  },

  signOut: async () => {
    set({ loading: true, error: null });
    const { error } = await supabase.auth.signOut();
    if (error) {
      set({ error: error.message, loading: false });
      return;
    }
    set({ user: null, profile: null, loading: false, error: null });
  },

  initialize: async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error || !data.session) {
        set({
          error: error?.message || "Failed to get session",
          loading: false,
          profile: null,
          user: null,
        });
        return;
      }
      const profileRes = await fetch(`${REST_API_URL}/api/auth/profile`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${data.session.access_token}`,
        },
      });
      const { profile, message } = await profileRes.json();
      if (!profileRes.ok || !profile) {
        set({
          error: message || "Failed to get profile! Please try again later.",
          user: null,
          profile: null,
          loading: false,
        });
        return;
      }
      console.log("user and profile:", data.session.user, profile);
      set({
        user: data.session.user,
        profile,
        loading: false,
        error: null,
      });
    } catch (err) {
      console.error(err);
      set({
        error: "Failed to get profile! Please try again later.",
        user: null,
        profile: null,
        loading: false,
      });
    }
  },
}));

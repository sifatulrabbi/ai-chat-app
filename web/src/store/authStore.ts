import { create } from "zustand";
import { supabase } from "../supabase";

type AuthStore = {
  user: any | null;
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
      user: data.user ? { id: data.user.id, email: data.user.email } : null,
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
      user: data.user ? { id: data.user.id, email: data.user.email } : null,
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
    set({ user: null, loading: false, error: null });
  },

  initialize: async () => {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      set({ error: error.message, loading: false, user: null });
      return;
    }
    set({
      user: data.session?.user || null,
      loading: false,
      error: null,
    });
  },
}));

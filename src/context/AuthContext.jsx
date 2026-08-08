import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../api"; // Import client đã cấu hình
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("user");
  const [profile, setProfile] = useState(null);
  useEffect(() => {
    // 1. Kiểm tra session hiện tại khi load trang
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        setUser(session.user);
        setProfile(data);
      }
      setLoading(false);
    };
    checkSession();

    // 2. Lắng nghe sự thay đổi (Login/Logout)
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      },
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // Hàm Login với Google
  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) throw error;
    } catch (error) {
      console.error("Login failed:", error.message);
    }
  };
  const registerWithEmail = async (email, password, fullName) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName }, // Lưu tên người dùng
      },
    });
    return { data, error };
  };
  const loginWithEmail = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  };
  // Hàm Logout
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    navigate("/");
    if (error) console.error("Logout failed:", error.message);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        setProfile,
        signInWithGoogle,
        signOut,
        loading,
        registerWithEmail,
        loginWithEmail,
      }}
    >
      {loading ? (
        <div className="fixed inset-0 bg-[#f9f9f9] z-[10000] flex flex-col items-center justify-center gap-4 font-['Poppins']">
          <div className="relative flex items-center justify-center">
            {/* Pulsing glow outer ring */}
            <div className="absolute w-16 h-16 rounded-full border-4 border-[#9e1c20]/20 animate-ping"></div>
            {/* Spinning loader */}
            <div className="w-16 h-16 border-4 border-gray-100 border-t-[#9e1c20] rounded-full animate-spin"></div>
          </div>
          <div className="text-center mt-2">
            <h2 className="text-[#9e1c20] text-xl font-black tracking-wider uppercase mb-1">TasteNest</h2>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest animate-pulse">Loading experience...</p>
          </div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

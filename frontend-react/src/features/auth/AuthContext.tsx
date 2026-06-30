import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { Role, User } from "../../types";

interface AuthState {
  user: User | null;
  login: (role: Role) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>({ id: "u-shop", name: "Krushna Patil", role: "shopkeeper", shopId: "shop-1" });

  const value = useMemo<AuthState>(() => ({
    user,
    login: (role) => setUser(role === "admin" ? { id: "u-admin", name: "Platform Admin", role } : { id: "u-shop", name: "Krushna Patil", role, shopId: "shop-1" }),
    logout: () => setUser(null),
  }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}

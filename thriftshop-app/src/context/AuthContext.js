import { createContext, useContext, useState, useEffect } from "react";
import { useSession } from "next-auth/react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const { data: session } = useSession();
  const [user, setUser] = useState(null);

  useEffect(() => setUser(session?.user || null), [session]);

  return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);

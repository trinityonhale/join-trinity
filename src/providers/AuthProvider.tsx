import { getUserRole } from "@/dao/UserDao";
import { Role } from "@/db/constants";
import { auth } from "@/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";

// Define the shape of the context value
interface AuthContextType {
  user: User | null; // Change undefined to null for better type consistency
  role: Role | "guest";
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: Role.user,
  loading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null); // Change undefined to null for better type consistency
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<AuthContextType['role']>("guest");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user); // Update user state
      if (user) {
        getUserRole(user?.uid).then((role) => {
            setRole(role); // Update role state
            setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe(); // Cleanup function to unsubscribe from the auth state change listener
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, role }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthProvider = () => useContext(AuthContext);

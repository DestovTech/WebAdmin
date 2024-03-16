// auth-context.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
// import { useNavigate } from "react-router-dom";
import { get, ref } from "firebase/database";
import { database } from "../firebase";
import { toast } from "react-toastify";

interface User {
  ID: string;
  PASSWORD: string;
}

interface AuthContextProps {
  user: User | null;
  isAuthenticated: boolean;
  isSubAuthenticated: boolean;
  login: (username: string, password: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSubAuthenticated, setIsSubAuthenticated] = useState(false);

  // Check for stored authentication data on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedAuth = localStorage.getItem("isAuthenticated");
    const storeSubAuth = localStorage.getItem("isSubAuthenticated");

    if (storedUser && storedAuth) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(JSON.parse(storedAuth));
    } else if (storedUser && storeSubAuth) {
      setUser(JSON.parse(storedUser));
      setIsSubAuthenticated(JSON.parse(storeSubAuth));
    }
  }, []);

  const login = async (username: string, password: string) => {
    const userRef = ref(database, `ADMIN/AUTH/admin`);
    const subAdminRef = ref(database, `ADMIN/SUB_ADMIN/${username}/AUTH`);

    try {
      const userSnapshot = await get(userRef);
      const subAdminSnapshot = await get(subAdminRef);

      const userData = userSnapshot.val() as User;
      const subAdminData = subAdminSnapshot.val() as User;

      // Check if the password matches
      if (userData.PASSWORD === password && userData.ID === username) {
        // Update state
        setUser(userData);
        setIsAuthenticated(true);
        setIsSubAuthenticated(false);

        // Store authentication data in localStorage
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("isAuthenticated", JSON.stringify(true));
      } else if (
        subAdminData.ID === username &&
        subAdminData.PASSWORD === password
      ) {
        setUser(subAdminData);
        setIsSubAuthenticated(true);
        setIsAuthenticated(false);

        localStorage.setItem("user", JSON.stringify(subAdminData));
        localStorage.setItem("isSubAuthenticated", JSON.stringify(true));
      } else {
        toast.error("Username or Password not found");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const logout = () => {
    // Clear stored authentication data
    localStorage.removeItem("user");
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("isSubAuthenticated");

    // Update state
    setUser(null);
    setIsAuthenticated(false);
    setIsSubAuthenticated(false);

    // navigate("/login"); // Redirect to login after logout
  };

  return (
    <AuthContext.Provider
      value={{ user, login, isAuthenticated, isSubAuthenticated, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

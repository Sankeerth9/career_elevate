import { createContext, useContext, ReactNode } from "react";
import { User } from "@shared/schema";

// Define the shape of our authentication context
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
}

// Create a default mock implementation
const defaultAuthContext: AuthContextType = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  login: async () => { console.log("Mock login called"); },
  register: async () => { console.log("Mock register called"); },
  logout: async () => { console.log("Mock logout called"); }
};

// Create the context with default values
const AuthContext = createContext<AuthContextType>(defaultAuthContext);

// Auth provider component that will wrap the app
export function AuthProvider({ children }: { children: ReactNode }) {
  // Using the default mock implementation for now
  return (
    <AuthContext.Provider value={defaultAuthContext}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  return context;
}

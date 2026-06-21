import { useState, useEffect } from "react";

export function useAuth() {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("statgate_token");
    const storedUserStr = localStorage.getItem("statgate_user");
    
    if (storedToken) setToken(storedToken);
    
    if (storedUserStr) {
      try {
        setUser(JSON.parse(storedUserStr));
      } catch (err) {
        console.error("Failed to parse user from local storage", err);
      }
    }
  }, []);

  return { token, user };
}

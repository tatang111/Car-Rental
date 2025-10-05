import { useAuthStore } from "@/app/store/useAuthStore";
import { useEffect } from "react";

const useAuthInit = () => {
  const setToken = useAuthStore((state) => state.setToken);
  const token = useAuthStore((state) => state.token);
  const fetchUser = useAuthStore((state) => state.fetchUser);
  const fetchCars = useAuthStore((state) => state.fetchCars);

  // useEffect to retrieve the token from localStorge
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setToken(token);
  }, [setToken]);

  // useEffect to fetch user data when token is available
  useEffect(() => {
    if (token) {
      fetchUser()
    }
    fetchCars();
  }, [token, fetchUser]);

  return { token };
};

export default useAuthInit;

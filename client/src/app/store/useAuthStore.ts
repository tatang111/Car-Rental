import { axiosInstance } from "@/lib/axios";
import type { Car, User } from "@/types/user";
import { toast } from "sonner";
import { create } from "zustand";

type AuthState = {
  showLogin: boolean;
  setShowLogin: (login: boolean) => void;
  token: string | null;
  user: User | null;
  isOwner: boolean | null;
  pickupDate: Date | null;
  returnDate: Date | null;
  cars: Car[];
  searchQuery: string
  
  setToken: (token: string | null) => void;
  setUser: (user: User | null) => void;
  setIsOwner: (isOwner: boolean) => void;
  setPickupDate: (pickupDate: Date | null) => void;
  setReturnDate: (returnDate: Date | null) => void;
  setCars: (cars: Car[]) => void;
  setSearchQuery: (query: string) => void
  
  fetchUser: () => Promise<void>;
  fetchCars: () => Promise<void>;
  logout: () => void
};

export const useAuthStore = create<AuthState>((set) => ({
  showLogin: false,
  setShowLogin: (login) => set({ showLogin: login }),
  token: "",
  user: null,
  isOwner: null,
  pickupDate: null,
  returnDate: null,
  cars: [],
  searchQuery: "",

  setToken: (token) => set({ token }),
  setUser: (user) => set({ user }),
  setIsOwner: (isOwner) => set({ isOwner }),
  setPickupDate: (pickupDate) => set({ pickupDate }),
  setReturnDate: (returnDate) => set({ returnDate }),
  setCars: (cars) => set({ cars }),
  setSearchQuery: (query) => set({ searchQuery: query }),

  // Function to logout the user
  logout: () => { 
    localStorage.removeItem("token");
    set({
      token: null,
      user: null,
      isOwner: false
    })
    toast.success("You have been logged out")
  },

  // Function to fetch all cars from server
  fetchCars: async () => {
    try {
      const { data } = await axiosInstance.get("/user/cars")
      
      data.success ? set({ cars: data.cars }) : toast.error(data.message)
      
    } catch (error) {
      if (error instanceof Error) toast.error(error.message)
    }
  },

  // Function to check user id logged in
  fetchUser: async () => {
    try {
      const { data } = await axiosInstance.get("/user/data");

      if (data.success) {
        set({
          user: data.user,
          isOwner: data.user.role === "owner",
        });
      }
    } catch (error) {
      if (error instanceof Error) console.log(error.message);
    }
  },
}));

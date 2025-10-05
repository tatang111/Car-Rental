import { Booking } from "@/app/my-bookings/page";
import { StaticImageData } from "next/image";

export type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  image: string | StaticImageData; // allow both
}

export type Booking = {
  _id: string;
  car: (typeof dummyCarData)[number];
  user: string;
  owner: string;
  midtransToken: string;
  pickupDate: string;
  returnDate: string;
  status: "confirmed" | "pending" | "cancelled";
  price: number;
  createdAt: string;
};

export type DashboardData = {
  totalCars: number;
  totalBookings: number;
  pendingBookings: number;
  completedBookings: number;
  recentBookings: Booking[];
  monthlyRevenue: number;
};

export type DashboardApiResponse = {
  success: boolean;
  dashboardData: DashboardData;
}

export type Car = {
  id: string;
  owner: string;
  brand: string;
  model: string;
  image: StaticImageData;
  year: number;
  category: string;
  seating_capacity: number;
  fuel_type: string;
  transmission: string;
  pricePerDay: number;
  location: string;
  description: string;
  isAvailable: boolean;
  createdAt: string;
};

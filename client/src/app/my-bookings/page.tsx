"use client";

import { assets } from "@/assets/assets";
import Title from "@/components/Title";
import { Car } from "@/types/user";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useAuthStore } from "../store/useAuthStore";
import { axiosInstance } from "@/lib/axios";
import { toast } from "sonner";
import Loader from "@/components/Loader";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";

export type Booking = {
  id: string;
  car: string;
  carRel: Car;
  user: string;
  owner: string;
  midtransToken: string ;
  pickupDate: string;
  returnDate: string;
  status: "confirmed" | "pending" | "cancelled";
  price: number;
  createdAt: string;
};

const Page = () => {
  const currency = process.env.NEXT_PUBLIC_CURRENCY;
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();

  const { data: bookingsData = [], isLoading } = useQuery<Booking[]>({
    queryKey: ["userrBooking", user?.id],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/bookings/user");

      if (!data.success) {
        toast.error(data.message);
        return null;
      }
      return data.bookings;
    },
    enabled: !!user,
  });

  const handlePayment = async (bookingId: string) => {
    const bookingData = bookingsData.find(
      (booking) => booking.id === bookingId
    );

    if (bookingData?.midtransToken && typeof window !== "undefined" && window.snap) {
      window.snap.pay(bookingData?.midtransToken, {
        onSuccess: async (result) => {
          console.log("✅ Payment success:", result);
          toast.success("Payment successfull");
          await axiosInstance.post("/bookings/change-status", {
            bookingId: bookingData?.id,
            status: "confirmed",
          });
          queryClient.invalidateQueries({
            queryKey: ["userrBooking", user?.id],
          });
        },
        onPending: (result) => {
          console.log("⌛ Payment pending:", result);
          toast.info("Payment pending");
        },
        onError: (result) => {
          console.error("❌ Payment failed:", result);
          toast.error("Payment failed.");
        },
        onClose: () => {
          toast.warning("Payment popup closed.");
        },
      });
    } else {
      console.warn("⚠️ Snap.js not loaded yet");
    }
    scrollTo(0, 0);
  };

  if (isLoading) return <Loader />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="px-6 md:px-16 lg:px-24 xl:px-32 2xl:px-48 mt-16 text-sm max-w-7xl"
    >
      <Title
        title="My Bookings"
        subtitle="View and manage your all car booking"
        align="left"
      />

      <div>
        {bookingsData?.map((booking, index) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 * index }}
            viewport={{ once: true }}
            key={booking.id}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6 border border-borderColor rounded-lg mt-5 first:mt-12"
          >
            {/* Car Image + Info */}
            <div className="md:col-span-1">
              <div className="rounded-md overflow-hidden mb-3">
                <Image
                  src={booking.carRel.image}
                  alt="Car"
                  width={250}
                  height={250}
                  className="w-full h-auto aspect-video object-cover"
                />
              </div>

              <p className="text-lg font-medium mt-2">
                {booking.carRel.brand} {booking.carRel.model}
              </p>
              <p className="text-gray-500">
                {booking.carRel.year} • {booking.carRel.category} •{" "}
                {booking.carRel.location}{" "}
              </p>
            </div>

            {/* Booking info */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2">
                <p className="px-3 py-1.5 bg-light rounded">
                  Booking #{index + 1}
                </p>
                <p
                  className={`px-3 py-1 text-xs rounded-full ${
                    booking.status === "confirmed"
                      ? "bg-green-400/15 text-green-600"
                      : "bg-red-400/15 text-red-600"
                  }`}
                >
                  {booking.status}
                </p>
                {booking.status === "pending" && (
                  <Button
                    onClick={() => handlePayment(booking.id)}
                    className="bg-primary hover:bg-primary-dull text-white font-medium py-3 px-6 rounded-md transition-all shadow-md"
                  >
                    Bayar
                  </Button>
                )}
              </div>

              <div className="flex items-start gap-2 mt-3">
                <Image
                  src={assets.calendar_icon_colored}
                  width={16}
                  height={16}
                  alt="calendar"
                  className="w-4 h-4 mt-1"
                />
                <div>
                  <p className="text-gray-500">Rental Period</p>
                  <p>
                    {booking.pickupDate.split("T")[0]} To{" "}
                    {booking.returnDate.split("T")[0]}{" "}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2 mt-3">
                <Image
                  src={assets.location_icon_colored}
                  width={16}
                  height={16}
                  alt="calendar"
                  className="w-4 h-4 mt-1"
                />
                <div>
                  <p className="text-gray-500">Pick-up Location</p>
                  <p>{booking.carRel.location}</p>
                </div>
              </div>
            </div>
            {/* Price */}
            <div className="md:col-span-1 flex flex-col justify-between gap-6">
              <div className="text-sm text-gray-500 text-right">
                <p>Total Price</p>
                <h1 className="text-2xl font-semibold text-primary">
                  {currency}
                  {booking.price}
                </h1>
                <p>Booked on {booking.createdAt.split("T")[0]}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Page;

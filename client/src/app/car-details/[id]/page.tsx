"use client";

import { useAuthStore } from "@/app/store/useAuthStore";
import { assets } from "@/assets/assets";
import Loader from "@/components/Loader";
import { axiosInstance } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { motion } from "motion/react";
import Image, { StaticImageData } from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

export type DummyCarData = {
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

const Page = () => {
  const { id } = useParams();
  const [car, setCar] = useState<null | DummyCarData>(null);
  const { cars, pickupDate, returnDate, setPickupDate, setReturnDate, user } =
    useAuthStore();
  const router = useRouter();
  const MotionImage = motion.create(Image);

  const currency = process.env.NEXT_PUBLIC_CURRENCY;

  useEffect(() => {
    if (id) {
      setCar(cars.find((car) => car.id === id) ?? null);
    }
  }, [id, cars]);

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const { data } = await axiosInstance.post(`/bookings/create`, {
        car: car?.id,
        pickupDate,
        returnDate,
      });

      const { data: midtransResponse } = await axiosInstance.post(`/midtrans`, {
        id: data.booking.id,
        totalPrice: Number(data.booking.price),
        productName: car?.brand,
      });
      
      return { bookingData: data, snapToken: midtransResponse.token };
    },
    onSuccess: ({ bookingData, snapToken }) => {
      toast.success(bookingData.message);

      if (snapToken && typeof window !== "undefined" && window.snap) {
        window.snap.pay(snapToken, {
          onSuccess: async (result) => {
            console.log(bookingData)
            console.log("✅ Payment success:", result);
            toast.success("Payment successfull");
            await axiosInstance.post("/bookings/change-status", {
              bookingId: bookingData.booking.id,
              status: "confirmed",
            });
            router.push("/my-bookings")
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
      scrollTo(0, 0)
    },
    onError: (error) => {
      if (error instanceof Error) {
        toast.error(error?.message || "Booking failed");
      }
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return toast.error("You must be logged in to booking a car");
    mutate();
  };

  return car ? (
    <div className="px-6 md:px-16 lg:px-24 xl:px-32 mt-16">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 mb-6 text-gray-500 cursor-pointer"
      >
        <Image
          src={assets.arrow_icon}
          width={16}
          height={16}
          alt="Back"
          className="rotate-180 opacity-65"
        />
        Back to all cars
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        {/* Left: Car image and details */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="lg:col-span-2"
        >
          <MotionImage
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            src={car.image}
            width={250}
            height={250}
            alt="Car"
            className="w-full h-auto md:max-h-100 object-cover rounded-xl mb-6 shadow-md"
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div>
              <h1 className="text-3xl font-bold">
                {car.brand} {car.model}
              </h1>
              <p className="text-gray-500 text-lg">
                {car.category} • {car.year}
              </p>
            </div>
            <hr className="border-borderColor my-6" />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                {
                  icon: assets.users_icon,
                  text: `${car.seating_capacity} Seats`,
                },
                {
                  icon: assets.fuel_icon,
                  text: car.fuel_type,
                },
                {
                  icon: assets.car_icon,
                  text: car.transmission,
                },
                {
                  icon: assets.location_icon,
                  text: car.location,
                },
              ].map(({ icon, text }) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  viewport={{ once: true }}
                  key={text}
                  className="flex flex-col items-center bg-light p-4 rounded-lg"
                >
                  <Image
                    src={icon}
                    alt={text}
                    width={20}
                    height={20}
                    className="h-5 mb-2"
                  />
                  {text}
                </motion.div>
              ))}
            </div>

            {/* Description */}
            <div>
              <h1 className="text-xl font-medium mb-3">Description</h1>
              <p className="text-gray-500">{car.description}</p>
            </div>

            {/* Features */}
            <div>
              <h1 className="text-xl font-medium mb-3">Features</h1>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  "360 Camera",
                  "Bluetooth",
                  "GPS",
                  "Heated Seats",
                  "Rear View Mirror",
                ].map((item) => (
                  <li key={item} className="flex items-center text-gray-500">
                    <Image
                      width={16}
                      height={16}
                      src={assets.check_icon}
                      className="h-4 mr-2"
                      alt="Check"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </motion.div>

        {/* Right: Booking form */}
        <motion.form
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          onSubmit={handleSubmit}
          className="shadow h-max sticky top-18 rounded-xl p-6 space-y-6 text-gray-500"
        >
          <p className="flex items-center justify-between text-2xl text-gray-800 font-semibold">
            {currency} {car.pricePerDay}{" "}
            <span className="text-base text-gray-400 font-normal">per day</span>
          </p>

          <hr className="border-borderColor my-6" />

          <div className="flex flex-col gap-2">
            <label htmlFor="pickup-date">Pickup Date</label>
            <input
              type="date"
              id="pickup-date"
              value={pickupDate ? pickupDate.toISOString().split("T")[0] : ""}
              onChange={(e) =>
                setPickupDate(e.target.value ? new Date(e.target.value) : null)
              }
              className="border border-borderColor px-3 py-2 rounded-lg"
              required
              min={new Date().toISOString().split("T")[0]}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="return-date">Return Date</label>
            <input
              type="date"
              id="return-date"
              value={returnDate ? returnDate.toISOString().split("T")[0] : ""}
              onChange={(e) =>
                setReturnDate(e.target.value ? new Date(e.target.value) : null)
              }
              min={
                pickupDate
                  ? new Date(pickupDate.getTime() + 24 * 60 * 60 * 1000)
                      .toISOString()
                      .split("T")[0]
                  : new Date().toISOString().split("T")[0]
              }
              className="border border-borderColor px-3 py-2 rounded-lg"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full disabled:opacity-50 disabled:cursor-not-allowed bg-primary hover:bg-primary-dull transition-all py-3 font-medium text-white rounded-xl cursor-pointer"
          >
            {isPending ? "Booking..." : "Book Now"}
          </button>

          <p className="text-center text-sm">
            No credit card required to reserve
          </p>
        </motion.form>
      </div>
    </div>
  ) : (
    <Loader />
  );
};

export default Page;

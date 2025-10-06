"use client";

import { useAuthStore } from "@/app/store/useAuthStore";
import { assets, cityList } from "@/assets/assets";
import { motion } from "motion/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const Hero = () => {
  const [pickupLocation, setPickupLocation] = useState<string>("");
  const { pickupDate, returnDate, setPickupDate, setReturnDate } =
    useAuthStore();
  const router = useRouter();
  const MotionImage = motion.create(Image);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    router.push(
      `/cars?pickupLocation=${pickupLocation}&pickupDate=${pickupDate}&returnDate=${returnDate}`
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="h-screen flex flex-col items-center justify-center gap-14 md:gap-6 xl:gap-14 bg-light text-center "
    >
      <motion.h1
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-4xl md:text-5xl font-semibold"
      >
        Luxury cars on Rent
      </motion.h1>

      <motion.form
        initial={{ scale: 0.95, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        onSubmit={handleSearch}
        className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 rounded-lg md:rounded-full w-full max-w-80 md:max-w-200 bg-white shadow-[0px_8px_20px_rgba(0,0,0,0.1)]"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center gap-10 min-md:ml-8 ">
          <div className="flex flex-col items-start gap-2">
            <select
              required
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
            >
              <option value="">Pickup Location</option>
              {cityList.map((city, index) => (
                <option key={index} value={city}>
                  {city}
                </option>
              ))}
            </select>

            <p className=" text-sm text-gray-500">
              {pickupLocation ? pickupLocation : "Please select location"}
            </p>
          </div>

          <div className="flex flex-col items-start gap-2">
            <label htmlFor="pickup-date">
              Pick-up Date
              <input
                value={pickupDate ? pickupDate.toISOString().split("T")[0] : ""}
                onChange={(e) =>
                  setPickupDate(
                    e.target.value ? new Date(e.target.value) : null
                  )
                }
                type="date"
                id="pickup-date"
                min={new Date().toISOString().split("T")[0]}
                className="text-sm text-gray-500"
                required
              />
            </label>
          </div>

          <div className="flex flex-col items-start gap-2">
            <label htmlFor="return-date">
              Return-up Date
              <input
                value={returnDate ? returnDate.toISOString().split("T")[0] : ""}
                onChange={(e) =>
                  setReturnDate(
                    e.target.value ? new Date(e.target.value) : null
                  )
                }
                type="date"
                id="return-date"
                min={
                  pickupDate
                    ? new Date(pickupDate.getTime() + 24 * 60 * 60 * 1000)
                        .toISOString()
                        .split("T")[0]
                    : new Date().toISOString().split("T")[0]
                }
                className="text-sm text-gray-500"
                required
              />
            </label>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center justify-center gap-1 px-9 py-3 max-sm:mt-4 bg-primary hover:bg-primary-dull text-white rounded-full cursor-pointer"
        >
          <Image
            width={16}
            height={16}
            src={assets.search_icon}
            alt="Search"
            className="brightness-300"
          />
          Search
        </motion.button>
      </motion.form>

      <div className="w-full relative max-w-5xl">
        <MotionImage
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          src={assets.main_car}
          alt="Car"
          width={1200}
          height={400}
          className="mx-auto h-auto w-full"
          priority
        />
      </div>
    </motion.div>
  );
};

export default Hero;

"use client";

import { assets } from "@/assets/assets";
import CarCard from "@/components/CarCard";
import Title from "@/components/Title";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Car } from "@/types/user";
import { axiosInstance } from "@/lib/axios";
import { toast } from "sonner";
import { motion } from "motion/react";

const Page = () => {
  const {cars, searchQuery, setSearchQuery} = useAuthStore();
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);

  // Getting search params from url
  const searchParams = useSearchParams();
  const pickupLocation = searchParams.get("pickupLocation");
  const pickupDate = searchParams.get("pickupDate");
  const returnDate = searchParams.get("returnDate");

  const isSearchData: boolean = Boolean(
    pickupDate && pickupLocation && returnDate
  );

  const applyFilter = async () => {
    if (searchQuery === "") {
      setFilteredCars(cars);
      return null;
    }

    const filtered = cars.slice().filter((car: Car) => {
      return (
        car.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        car.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
        car.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        car.transmission.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
    setFilteredCars(filtered);
  };

  const searchCarAvailability = async () => {
    const { data } = await axiosInstance.post("/bookings/check-availability", {
      location: pickupLocation,
      pickupDate,
      returnDate,
    });

    if (data.success) {
      setFilteredCars(data.availableCars);
      if (data.availableCars.length === 0) {
        toast.error("No cars available");
      }
      return null;
    }
  };

  useEffect(() => {
    isSearchData && searchCarAvailability();
  }, [isSearchData]);

  useEffect(() => {
    cars.length > 0 && !isSearchData && applyFilter();
  }, [searchQuery, cars]);

  return (
    <div>
      {/* Search bar */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true }}
        className="flex flex-col items-center py-20 bg-light max-md:px-4"
      >
        <Title
          title="Available Cars"
          subtitle="Browse our selection of premium vechiles available for your next adventure"
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="flex items-center bg-white px-4 mt-6 max-w-140 w-full h-12 rounded-full shadow"
        >
          <Image
            src={assets.search_icon}
            width={16}
            height={16}
            alt="Search"
            className="w-4.5 h-4.5 mr-2"
          />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            type="text"
            placeholder="Search by make, model or features"
            className="w-full h-full outline-none text-gray-500"
          />
          <Image
            src={assets.filter_icon}
            width={16}
            height={16}
            alt="Filter"
            className="w-4.5 h-4.5 ml-2"
          />
        </motion.div>
      </motion.div>

      {/* Cars */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        viewport={{ once: true }}
        className="px-6 md:px-16 lg:px-24 xl:px-32 mt-10"
      >
        <p className="text-gray-500 xl:px-20 max-w-7xl mx-auto">
          Showing {filteredCars.length} Cars{" "}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-4 xl:px-20 max-w-7xl mx-auto">
          {filteredCars.map((car, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 * index }}
              viewport={{ once: true }}
              key={index}
            >
              <CarCard car={car} />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Page;

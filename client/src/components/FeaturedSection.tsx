"use client";

import { assets } from "@/assets/assets";
import Title from "./Title";
import CarCard from "./CarCard";
import Image from "next/image";
import Link from "next/link";
import { useAuthStore } from "@/app/store/useAuthStore";
import { Skeleton } from "./ui/skeleton";
import { motion } from "motion/react";

const FeaturedSection = () => {
  const cars = useAuthStore((state) => state.cars);
  const MotionLink = motion.create(Link);

  return (
    <motion.div
      viewport={{ once: true }}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: "easeOut" }}
      className="flex flex-col items-center py-24 px-6 md:px-16 lg:px-24 xl:px-32"
      >
      <motion.div
      viewport={{ once: true }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.5 }}
      >
        <Title
          title="Featured Vechiles"
          subtitle="Explore our selection of premium vechiles available for your next adventure"
          />
      </motion.div>

      <motion.div
        viewport={{ once: true }}
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-18"
      >
        {cars.length === 0 ? (
          <div className="md:flex grid gap-20 mx-auto justify-center items-center">
            <Skeleton className="w-80 h-80 md:ml-20 rounded-xl" />
            <Skeleton className="w-80 h-80 max-md:hidden rounded-xl" />
            <Skeleton className="w-80 h-80 max-md:hidden rounded-xl" />
          </div>
        ) : (
          cars.slice(0, 6).map((car) => (
            <motion.div
            viewport={{ once: true }}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
              key={car.id}
              >
              <CarCard car={car} />
            </motion.div>
          ))
        )}
      </motion.div>

      <MotionLink
        initial={{ opacity: 0, y: 20 }}
        viewport={{ once: true }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.4 }}
        href={"/cars"}
        className="flex items-center justify-center gap-2 px-6 py-2 border border-borderColor hover:bg-gray-50 rounded-md mt-18 cursor-pointer"
        >
        Explore all cars
        <Image src={assets.arrow_icon} width={14} height={14} alt="arrow" />
      </MotionLink>
    </motion.div>
  );
};

export default FeaturedSection;

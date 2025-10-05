"use client";

import { assets } from "@/assets/assets";
import Title from "./Title";
import Image from "next/image";
import { motion } from "motion/react";

const Testimonial = () => {
  const testimonials = [
    {
      name: "Emma Rodriguez",
      location: "Surabaya, Jawa Timur",
      image: assets.testimonial_image_1,
      testimonal:
        "I&apos;ve rented cars from various companies, but the experience with CarRental was exceptional",
    },
    {
      name: "John Smith",
      location: "Malang, Jawa Timur",
      image: assets.testimonial_image_2,
      testimonal:
        "CarRental made my trip so much easier. The car was delivered right to my door, and the customer service was fantastic",
    },
    {
      name: "Ava Johnson",
      location: "Jakarta Timur, Jakarta",
      image: assets.testimonial_image_1,
      testimonal:
        "I highly recommend CarRental! Their fleet is amazing, and I always feel like I&apos;m getting the best deal with excellent service.",
    },
  ];

  return (
    <div className="py-28 px-6 md:px-16 lg:px-24 xl:px-44">
      <Title
        title="What our Customer Says"
        subtitle="Discover why discerning travelers choose StayVenture for their luxury accomodations around the world."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-18">
        {testimonials.map((testimonial, index) => (
          <motion.div
            viewport={{ once: true }}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2, ease: "easeOut" }}
            key={index}
            className="bg-white p-6 rounded-xl shadow-lg hover:-translate-y-1 transition-all duration-500"
          >
            <div className="flex items-center gap-3">
              <Image
                className="w-12 h-12 rounded-full"
                src={testimonial.image}
                width={48}
                height={48}
                alt={testimonial.name}
              />
              <div>
                <p className="text-xl">{testimonial.name}</p>
                <p className="text-gray-500">{testimonial.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 mt-4">
              {Array(5)
                .fill(0)
                .map((_, index) => (
                  <Image key={index} src={assets.star_icon} alt="star-icon" />
                ))}
            </div>
            <p className="text-gray-500 max-w-90 mt-4 font-light">
              "{testimonial.testimonal}"
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Testimonial;

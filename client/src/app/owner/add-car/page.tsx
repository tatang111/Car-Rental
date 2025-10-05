"use client";

import { assets } from "@/assets/assets";
import Title from "@/components/owner/Title";
import { axiosInstance } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import React, { useState } from "react";
import { toast } from "sonner";

const Page = () => {
  const currency = process.env.NEXT_PUBLIC_CURRENCY;
  const [image, setImage] = useState<File | null>(null);
  const [car, setCar] = useState({
    brand: "",
    model: "",
    year: 0,
    pricePerDay: 0,
    category: "",
    transmission: "",
    fuel_type: "",
    seating_capacity: 0,
    location: "",
    description: "",
  });

  const { isPending, mutate, error } = useMutation({
    mutationFn: async () => {
      if (!image) return;
      const formData = new FormData();
      formData.append("image", image);
      formData.append("carData", JSON.stringify(car));

      const { data } = await axiosInstance.post("/owner/add-car", formData );

      if (data.success) {
        toast.success(data.message);
        setImage(null);
        setCar({
          brand: "",
          model: "",
          year: 0,
          pricePerDay: 0,
          category: "",
          transmission: "",
          fuel_type: "",
          seating_capacity: 0,
          location: "",
          description: "",
        });
        return data
      } else {
        toast.error(data.message)
      }
    },
    onError: (error) => {
      toast.error(error.message)
      console.log(error.message)
    }
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    mutate();
  };

  return (
    <div className="px-4 py-10 md:px-10 flex-1">
      <Title
        title="Add New Car"
        subtitle="Fill in details to list a new car for booking, including pricing, avaibility, and car spesifications."
      />

      <form
        className="flex flex-col gap-5 text-gray-500 text-sm mt-6 max-w-xl"
        onSubmit={handleSubmit}
      >
        {/* Car Image */}
        <div className="flex items-center gap-2 w-full">
          <label htmlFor="car-image">
            <Image
              src={image ? URL.createObjectURL(image) : assets.upload_icon}
              alt="image"
              width={100}
              height={100}
              className="h-14 cursor-pointer"
            />
            <input
              type="file"
              id="car-image"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setImage(e.target.files[0]);
                }
              }}
              accept="image/*"
              hidden
            />
          </label>
          <p className="text-sm text-gray-500 ">
            Upload a picture for your car
          </p>
        </div>

        {/* Car Brand And Model */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col w-full">
            <label>Brand</label>
            <input
              type="text"
              placeholder="e.g. BMW, Marcedes, Audi..."
              required
              className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
              value={car.brand}
              onChange={(e) => setCar({ ...car, brand: e.target.value })}
            />
          </div>
          <div className="flex flex-col w-full">
            <label>Model</label>
            <input
              type="text"
              placeholder="e.g. X5, E-Class, M4..."
              required
              className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
              value={car.model}
              onChange={(e) => setCar({ ...car, model: e.target.value })}
            />
          </div>
        </div>

        {/* Car Year, Price and Category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div className="flex flex-col w-full">
            <label>Year</label>
            <input
              type="number"
              placeholder="2025"
              required
              className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
              value={car.year}
              onChange={(e) => setCar({ ...car, year: Number(e.target.value) })}
            />
          </div>
          <div className="flex flex-col w-full">
            <label>Daily Price ({currency})</label>
            <input
              type="number"
              placeholder="100"
              required
              className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
              value={car.pricePerDay}
              onChange={(e) =>
                setCar({ ...car, pricePerDay: Number(e.target.value) })
              }
            />
          </div>
          <div className="flex flex-col w-full">
            <label>Category</label>
            <select
              onChange={(e) => setCar({ ...car, category: e.target.value })}
              value={car.category}
              className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
            >
              <option value="">Select a category</option>
              <option value="Sedan">Sedan</option>
              <option value="SUV">SUV</option>
              <option value="Van">Van</option>
            </select>
          </div>
        </div>

        {/* Car Transmission, Fuel Type, Seating Capacity */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div className="flex flex-col w-full">
            <label>Transmission</label>
            <select
              onChange={(e) => setCar({ ...car, transmission: e.target.value })}
              value={car.transmission}
              className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
            >
              <option value="">Select a transmission</option>
              <option value="Automatic">Automatic</option>
              <option value="Manunal">Manunal</option>
              <option value="Semi-Automatic">Semi-Automatic</option>
            </select>
          </div>
          <div className="flex flex-col w-full">
            <label>Fuel Type</label>
            <select
              onChange={(e) => setCar({ ...car, fuel_type: e.target.value })}
              value={car.fuel_type}
              className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
            >
              <option value="">Select a fuel type</option>
              <option value="Gas">Gas</option>
              <option value="Diesel">Diesel</option>
              <option value="Petrol">Petrol</option>
              <option value="Electric">Electric</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>
          <div className="flex flex-col w-full">
            <label>Seating Capacity</label>
            <input
              type="number"
              placeholder="4"
              required
              className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
              value={car.seating_capacity}
              onChange={(e) =>
                setCar({ ...car, seating_capacity: Number(e.target.value) })
              }
            />
          </div>
        </div>

        {/* Car Location */}
        <div className="flex flex-col w-full">
          <label>Location</label>
          <select
            onChange={(e) => setCar({ ...car, location: e.target.value })}
            value={car.location}
            className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
          >
            <option value="">Select location</option>
            <option value="Surabaya">Surabaya</option>
            <option value="Malang">Malang</option>
            <option value="Yogyakarta">Yogyakarta</option>
            <option value="Jakarta">Jakarta</option>
            <option value="Semarang">Semarang</option>
          </select>
        </div>
        {/* Car Description */}
        <div className="flex flex-col w-full">
          <label>Description</label>
          <textarea
            placeholder="e.g. A luxurious SUV with a spacious interior and powerful engine."
            required
            rows={5}
            className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
            value={car.description}
            onChange={(e) => setCar({ ...car, description: e.target.value })}
          ></textarea>
        </div>

        <button type="submit" disabled={isPending} className="flex items-center gap-2 px-4 py-2.5 mt-4 bg-primary text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed font-medium w-max cursor-pointer">
          <Image src={assets.tick_icon} alt="list" />
          {isPending ? "Listing..." : "List Your Car"} 
        </button>
      </form>
    </div>
  );
};

export default Page;

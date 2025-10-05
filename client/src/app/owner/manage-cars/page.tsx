"use client";

import type { DummyCarData } from "@/app/car-details/[id]/page";
import { useAuthStore } from "@/app/store/useAuthStore";
import { assets } from "@/assets/assets";
import Title from "@/components/owner/Title";
import { axiosInstance } from "@/lib/axios";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import Image from "next/image";
import { toast } from "sonner";


const Page = () => {
  const queryClient = useQueryClient()
  const isOwner = useAuthStore((state) => state.isOwner);
  const currency = process.env.NEXT_PUBLIC_CURRENCY;

  const {
    data: cars,
    isLoading,
    error,
  } = useQuery<DummyCarData[]>({
    queryKey: ["ownerCars"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/owner/cars");
      return data.cars;
    },
  });

  const { mutate: toggleCar, isPending: togglePending } = useMutation({
    mutationFn: async (carId: string) => {
      const { data } = await axiosInstance.post("/owner/toggle-car", { carId });
      return data;
    },
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["ownerCars"] })
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || error.message);
    },
  });

  const { mutate: deleteCar, isPending: deletePending } = useMutation({
    mutationFn: async (carId: string) => {
      const confirm = window.confirm(
        "Are you sure you want to delete this car?"
      );
      if (!confirm) return null;

      const { data } = await axiosInstance.post("/owner/delete-car", { carId });
      return data;
    },
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || error.message);
    },
  });

  if (isLoading) return <p>Loading cars...</p>;
  if (error) {
    toast.error((error as Error).message);
    return <p>Error fetching cars.</p>;
  }
  return (
    <div className="px-4 pt-10 md:px-10 w-full">
      <Title
        title="Manage Cars"
        subtitle="View all listed cars, update their details or remove them from the booking platform."
      />

      <div className="max-w-3xl w-full rounded-md overflow-hidden border border-borderColor mt-6">
        <table className="w-full border-collapse text-left text-sm text-gray-600">
          <thead className="text-gray-500">
            <tr>
              <th className="p-3 font-medium">Car</th>
              <th className="p-3 font-medium max-md:hidden">Category</th>
              <th className="p-3 font-medium">Price</th>
              <th className="p-3 font-medium max-md:hidden">Status</th>
              <th className="p-3 font-medium pl-10">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cars?.map((car, index) => (
              <tr key={index} className="border-t border-borderColor">
                <td className="p-3 flex items-center gap-3">
                  <Image
                    src={car.image}
                    alt="Car"
                    width={48}
                    height={48}
                    className="aspect-square rounded-md object-cover"
                  />
                  <div className="max-md:hidden">
                    <p className="font-medium">
                      {car.brand} {car.model}
                    </p>
                    <p className="text-xs text-gray-500">
                      {car.seating_capacity} • {car.transmission}
                    </p>
                  </div>
                </td>

                <td className="p-3 max-md:hidden">{car.category}</td>
                <td className="p-3">
                  {currency}
                  {car.pricePerDay}/day
                </td>
                <td className="p-3 max-md:hidden">
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${
                      car.isAvailable
                        ? "bg-green-100 text-green-500"
                        : "bg-red-100 text-red-500"
                    }`}
                  >
                    {car.isAvailable ? "Available" : "Unavailable"}
                  </span>
                </td>

                <td className="flex items-center p-3">
                  <Image
                    src={
                      car.isAvailable ? assets.eye_close_icon : assets.eye_icon
                    }
                    onClick={() => toggleCar(car.id)}
                    alt="Action"
                    width={50}
                    height={50}
                    className="cursor-pointer"
                  />

                  <Image
                    src={assets.delete_icon}
                    onClick={() => deleteCar(car.id)}
                    alt="Action"
                    width={50}
                    height={50}
                    className="cursor-pointer"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Page;

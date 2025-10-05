"use client";

import { Booking } from "@/app/my-bookings/page";
import BookingTableSkeleton from "@/components/BookingTableSkeleton";
import Title from "@/components/owner/Title";
import { axiosInstance } from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const Page = () => {
  const currency = process.env.NEXT_PUBLIC_CURRENCY;
  const queryClient = useQueryClient();

  const { data: bookings = [], isLoading } = useQuery<Booking[]>({
    queryKey: ["ownerBookings"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/bookings/owner");

      if (!data.success) return toast.error(data.message);
      return data.bookings;
    },
  });

  const { mutate } = useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: Booking["status"];
    }) => {
      const { data } = await axiosInstance.post(`/bookings/change-status`, {
        bookingId: id,
        status,
      });

      if (!data.success) throw new Error(data.message);
      return data;
    },
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["ownerBookings"] });
    },
    onError: (data) => {
      toast.error(data.message || "Failed to fetch booking");
    },
  });

  return (
    <div className="px-4 pt-10 md:px-10 w-full">
      <Title
        title="Manage Bookings"
        subtitle="Track all customer bookings, approve or cancel requests, and manage booking statuses."
      />

      {isLoading ? (
        <BookingTableSkeleton />
      ) : bookings.length === 0 ? (
        <p>No bookings yet.</p>
      ) : (
        <div className="max-w-3xl w-full rounded-md overflow-hidden border border-borderColor mt-6">
          <table className="w-full border-collapse text-left text-sm text-gray-600">
            <thead className="text-gray-500">
              <tr>
                <th className="p-3 font-medium">Car</th>
                <th className="p-3 font-medium max-md:hidden">Date Range</th>
                <th className="p-3 font-medium">Total</th>
                <th className="p-3 font-medium max-md:hidden">Payment</th>
                <th className="p-3 font-medium pl-10">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings?.map((booking, index) => (
                <tr
                  key={index}
                  className="border-t border-borderColor text-gray-500"
                >
                  <td className="p-3 flex items-center gap-3">
                    <Image
                      src={booking?.carRel.image}
                      alt="carRel"
                      width={48}
                      height={48}
                      className="aspect-square rounded-md object-cover"
                    />
                    <p className="font-medium max-md:hidden">
                      {booking.carRel.brand} {booking.carRel.model}
                    </p>
                  </td>

                  <td className="p-3 max-md:hidden">
                    {booking.pickupDate.split("T")[0]} to{" "}
                    {booking.returnDate.split("T")[0]}
                  </td>

                  <td className="p-3">
                    {currency}
                    {booking.price}
                  </td>

                  <td className="p-3 max-md:hidden">
                    <span className="bg-gray-100 px-3 py-1 rounded-full text-xs">
                      Online
                    </span>
                  </td>

                  <td className="p-3">
                    {booking.status === "pending" ? (
                      <select
                        value={booking.status}
                        onChange={(e) =>
                          mutate({
                            id: booking.id,
                            status: e.target.value as Booking["status"],
                          })
                        }
                        className="px-2 py-1.5 mt-1 text-gray-500 border border-borderColor rounded-md outline-none"
                      >
                        <option value="pending">Pending</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="confirmed">Confirmed</option>
                      </select>
                    ) : (
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          booking.status === "confirmed"
                            ? "bg-green-100 text-green-500"
                            : "bg-red-100 text-red-500"
                        }`}
                      >
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Page;

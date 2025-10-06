"use client";

import { assets } from "@/assets/assets";
import Title from "@/components/owner/Title";
import type { DashboardApiResponse, DashboardData } from "@/types/user";
import { Book } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";

const Page = () => {
  const isOwner = useAuthStore((state) => state.isOwner);
  const currency = process.env.NEXT_PUBLIC_CURRENCY;
  const [data, setData] = useState<DashboardData>({
    totalCars: 0,
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    recentBookings: [],
    monthlyRevenue: 0,
  });

  const {data: dashboardData, isLoading} = useQuery<DashboardApiResponse>({
    queryKey: ["dashboardOwner"],
    queryFn: async () => {
      const { data } = await axiosInstance.get<DashboardApiResponse>("/owner/dashboard");
      
      if (data.success) {
        return data
      } else {
        throw new Error("Failed to fetch dashboard data")
      }
    },
  });

  const dashboardCards = [
    {
      title: "Total Cars",
      value: data?.totalCars ?? 0,
      icon: assets.carIconColored,
    },
    {
      title: "Total Bookings",
      value: data?.totalBookings ?? 0,
      icon: assets.listIconColored,
    },
    {
      title: "Pending",
      value: data?.pendingBookings ?? 0,
      icon: assets.cautionIconColored,
    },
    {
      title: "Confirmed",
      value: data?.completedBookings ?? 0,
      icon: assets.listIconColored,
    },
  ];

  useEffect(() => {
    if (dashboardData?.success && isOwner) {
      setData(dashboardData.dashboardData)
    }  
  }, [isOwner, dashboardData]);


  return (
    <div className="px-4 pt-10 md:px-10 flex-1">
      <Title
        title="Admin Dashboard"
        subtitle="Monitor overall platform performance including total cars, bookings, revenue, and recent activities"
      />

      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 my-8 max-w-3xl">
        {dashboardCards.map((card, index) => (
          <div
            key={index}
            className="flex gap-2 items-center justify-between p-4 rounded-md border border-borderColor"
          >
            <div>
              <h1 className="text-xs text-gray-500">{card.title}</h1>
              <p className="text-lg font-semibold">{card.value}</p>
            </div>
            <div className="flex justify-center items-center w-10 h-10 rounded-full bg-primary/10">
              <Image
                src={card.icon}
                alt="icon"
                className="w-4 h-4"
                width={20}
                height={20}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-start gap-6 mb-8 w-full">
        {/* Recent booking */}
        <div className="p-4 md:p-6 border border-borderColor rounded-md max-w-lg w-full">
          <h1 className="text-lg font-medium">Recent Booking</h1>
          <p className="text-gray-500">Lates customer booking</p>
          {!isLoading && data?.recentBookings?.map((booking, index) => (
            <div
              className="mt-4 flex justify-between items-center "
              key={index}
            >
              <div className="flex items-center gap-2">
                <div className="hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                  <Image
                    src={assets.listIconColored}
                    alt="list-icon"
                    className="w-5 h-5"
                    width={20}
                    height={20}
                  />
                </div>

                <div>
                  <p>
                    {booking.carRel.brand} {booking.carRel.model}
                  </p>
                  <p className="text-sm text-gray-500">
                    {booking.createdAt.split("T")[0]}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 font-medium">
                <p className="text-sm text-gray-500">
                  {currency}
                  {booking.price}
                </p>
                <p className="px-3 py-0.5 border border-borderColor rounded-full text-sm">
                  {booking.status}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Monthly revenue */}
        <div className="p-4 md:p-6 mb-6 border border-borderColor rounded-md w-full md:max-w-xs">
          <h1 className="text-lg font-medium">Monthly Revenue</h1>
          <p className="text-gray-500">Revenue for current month</p>
          <p className="text-3xl mt-6 font-semibold text-primary">
            {currency}
            {data?.monthlyRevenue ?? 0}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page;

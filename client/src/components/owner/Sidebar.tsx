"use client";

import { useAuthStore } from "@/app/store/useAuthStore";
import { assets, ownerMenuLinks } from "@/assets/assets";
import { axiosInstance } from "@/lib/axios";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const Sidebar = () => {
  const user = useAuthStore((state) => state.user);
  const fetchUser = useAuthStore((state) => state.fetchUser);
  const pathname = usePathname();
  const [image, setImage] = useState<File | null>(null);

  const updateImage = async () => {
    if (!image) return;
    try {
      const formData = new FormData();
      formData.append("image", image);

      const { data } = await axiosInstance.post(
        "/owner/update-image",
        formData
      );

      if (data.success) {
        fetchUser();
        toast.success(data.message);
        setImage(null);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  return (
    <div className="relative min-h-screen md:flex flex-col items-center pt-8 max-w-13 md:max-w-60 w-full border-r border-borderColor text-sm">
      <div className="group relative">
        <label htmlFor="image">
          <Image
            src={
              image
                ? URL.createObjectURL(image)
                : user?.image ||
                  "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=300"
            }
            width={250}
            height={250}
            className="h-9 md:h-14 w-9 md:w-14 rounded-full mx-auto"
            // fill
            alt="user-image"
          />

          <input
            type="file"
            id="image"
            accept="image/*"
            hidden
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setImage(e.target.files[0]);
              }
            }}
          />

          <div className="absolute hidden top-0 right-0 left-0 bottom-0 bg-black/10 rounded-full group-hover:flex items-center justify-center cursor-pointer">
            <Image src={assets.edit_icon} alt="edit" />
          </div>
        </label>
      </div>
      {image && (
        <button
          onClick={updateImage}
          className="absolute top-0 right-0 flex p-2 gap-1 bg-primary/10 text-primary cursor-pointer"
        >
          Save <Image src={assets.check_icon} alt="check" width={13} />
        </button>
      )}

      <p className="mt-2 text-base max-md:hidden">{user?.name}</p>

      <div className="w-full">
        {ownerMenuLinks.map((link, index) => (
          <Link
            href={link.path}
            className={`relative flex items-center gap-2 w-full py-3 pl-4 first:mt-6 ${
              link.path === pathname
                ? "bg-primary/10 text-primary"
                : "text-gray-600"
            }`}
            key={index}
          >
            <Image
              src={link.path === pathname ? link.coloredIcon : link.icon}
              alt="car-icon"
            />
            <span className="max-md:hidden">{link.name}</span>
            <div
              className={`${
                link.path === pathname && "bg-primary "
              } w-1.5 h-8 rounded-l right-0 absolute `}
            ></div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;

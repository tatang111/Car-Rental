"use client";

import { useAuthStore } from "@/app/store/useAuthStore";
import { assets } from "@/assets/assets";
import Image from "next/image";
import Link from "next/link";

const NavbarOwner = () => {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="flex items-center justify-between px-6 md:px-10 py-4 text-gray-500 border-b border-borderColor relative transition-all">
      <Link href={"/"}>
        <Image src={assets.logo} alt="Logo" className="h-7" />
      </Link>
      <p>Welcome, {user?.name || "Owner"}</p>
    </div>
  );
};

export default NavbarOwner;

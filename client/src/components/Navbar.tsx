"use client";

import { useAuthStore } from "@/app/store/useAuthStore";
import { assets, menuLinks } from "@/assets/assets";
import useAuthInit from "@/hooks/useAuthInit";
import { axiosInstance } from "@/lib/axios";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { motion } from "motion/react";

const Navbar = () => {
  const pathname = usePathname();
  const [open, setOpen] = useState<boolean>(false);
  const [loadingLogin, setLoadingLogin] = useState<boolean>(true);
  const [googleLoginProcessed, setGoogleLoginProcessed] =
    useState<boolean>(false);
  const router = useRouter();
  const {
    setShowLogin,
    user,
    logout,
    isOwner,
    setIsOwner,
    setToken,
    searchQuery,
    setSearchQuery,
  } = useAuthStore();
  const { data: session, status } = useSession();
  const MotionImage = motion(Image);

  const changeRole = async () => {
    try {
      const { data } = await axiosInstance.put("/owner/change-role");
      if (data.success) {
        setIsOwner(true);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    if (session?.user && status == "authenticated" && !googleLoginProcessed) {
      const sendToBackend = async () => {
        try {
          const { email, name } = session.user;

          const { data } = await axiosInstance.post("/user/login", {
            email,
            name,
            provider: "google",
          });

          if (data.success) {
            localStorage.setItem("token", data.token);
            setToken(data.token);
            setShowLogin(false);
            toast.success("Logged in with Google");
          } else {
            toast.error(data.message);
          }
        } catch (error: any) {
          toast.error(error.response.data.message);
        } finally {
          setLoadingLogin(false);
          setGoogleLoginProcessed(true);
        }
      };
      sendToBackend();
    } else {
      setLoadingLogin(false);
    }
  }, [session]);

  const handleLogout = () => {
    if (session?.user) {
      signOut();
    } else {
      logout();
    }
    localStorage.removeItem("token");
    setLoadingLogin(false);
  };

  useEffect(() => {
    if (searchQuery.length === 1) {
      router.push("/cars");
    }
  }, [searchQuery]);

  if (pathname.startsWith("/owner")) return null;
  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className={`flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 text-gray-600 border-b border-borderColor relative transition-all ${
        pathname === "/" && "bg-light"
      } `}
    >
      <Link href={"/"}>
        <MotionImage
          whileHover={{ scale: 1.05 }}
          src={assets.logo}
          alt="Logo"
          width={300}
          height={300}
          className="max-md:ml-8 h-8"
        />
      </Link>

      <div
        className={`max-sm:fixed max-sm:h-screen max-sm:w-full max-sm:top-16 max-sm:border-t border-borderColor right-0 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 max-sm:p-4 transition-all duration-300 z-50 ${
          pathname === "/" ? "bg-light" : "bg-white"
        } ${open ? "max-sm:translate-x-0" : "max-sm:translate-x-full"}`}
      >
        {menuLinks.map((link, index) => (
          <Link key={index} href={link.path}>
            {link.name}
          </Link>
        ))}

        <div className="hidden lg:flex items-center text-sm gap-2 border border-borderColor px-3 rounded-full max-w-56 ">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className=" py-1.5 w-full bg-transparent outline-none placeholder-gray-500 "
            placeholder="Seearch products"
          />
          <Image src={assets.search_icon} alt="Search" />
        </div>

        <div className="flex max-sm:flex-col items-start sm:items-center gap-6">
          {isOwner && (
            <button
              onClick={() => router.push("/owner")}
              className="cursor-pointer"
            >
              Dashboard
            </button>
          )}

          <button
            onClick={() => (user ? handleLogout() : setShowLogin(true))}
            className="cursor-pointer px-8 py-2 bg-primary hover:bg-primary-dull transition-all text-white rounded-lg"
          >
            {loadingLogin ? "Checked..." : user ? "Logout" : "Login"}
          </button>
        </div>
      </div>

      <button
        className="sm:hidden cursor-pointer"
        aria-label="Menu"
        onClick={() => setOpen(!open)}
      >
        <Image src={open ? assets.close_icon : assets.menu_icon} width={20} height={20} alt="Menu" />
      </button>
    </motion.div>
  );
};

export default Navbar;

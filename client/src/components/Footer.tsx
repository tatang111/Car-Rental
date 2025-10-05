"use client";

import { assets } from "@/assets/assets";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Footer = () => {
  const pathname = usePathname();
  const MotionImage = motion(Image);

  if (pathname.startsWith("/owner")) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="px-6 md:px-16 lg:px-24 xl:px-32 mt-60 text-sm text-gray-500"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        viewport={{ once: true }}
        className="flex flex-wrap justify-between items-start gap-8 pb-6 border-borderColor border-b"
      >
        <div>
          <MotionImage
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            viewport={{ once: true }}
            width={200}
            height={200}
            src={assets.logo}
            alt="logo"
            className="h-8 md:h-9"
          />
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            viewport={{ once: true }}
            className="max-w-80 mt-3"
          >
            Premium car rental service with a wide selection of luxury and
            everyday vechiles for all your driving needs.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 mt-6"
          >
            <Link href={"#"}>
              <Image
                src={assets.facebook_logo}
                width={20}
                height={20}
                alt="facebook"
                className="w-5 h-5"
                />
            </Link>
            <Link href={"#"}>
              <Image
                src={assets.instagram_logo}
                width={20}
                height={20}
                alt="facebook"
                className="w-5 h-5"
                />
            </Link>
            <Link href={"#"}>
              <Image
                src={assets.twitter_logo}
                width={20}
                height={20}
                alt="facebook"
                className="w-5 h-5"
                />
            </Link>
            <Link href={"#"}>
              <Image
                src={assets.gmail_logo}
                width={20}
                height={20}
                alt="facebook"
                className="w-5 h-5"
              />
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-between w-1/2 gap-8"
        >
          <div>
            <h2 className="text-base font-medium text-gray-800 uppercase ">
              Quick Links
            </h2>
            <ul className="mt-3 flex flex-col gap-1.5">
              <li>
                <Link href="#">About</Link>
              </li>
              <li>
                <Link href="#">Browse Cars</Link>
              </li>
              <li>
                <Link href="#">List Your Cars</Link>
              </li>
              <li>
                <Link href="#">About Us</Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-base font-medium text-gray-800 uppercase ">
              Resources
            </h2>
            <ul className="mt-3 flex flex-col gap-1.5">
              <li>
                <Link href="#">Help Center</Link>
              </li>
              <li>
                <Link href="#">Terms of Service</Link>
              </li>
              <li>
                <Link href="#">Privacy Policy</Link>
              </li>
              <li>
                <Link href="#">Insurance</Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-base font-medium text-gray-800 uppercase ">
              Contact
            </h2>
            <ul className="mt-3 flex flex-col gap-1.5">
              <li>1234 Luxury Drive</li>
              <li>Surabaya, Jawa Timur 94107</li>
              <li>+62 88230646040</li>
              <li>lintangpsa@gmail.com</li>
            </ul>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        viewport={{ once: true }}
        className="flex flex-col md:flex-row gap-2 items-center justify-between py-5"
      >
        <p>© {new Date().getFullYear()} Brand. All rights reserved.</p>
        <ul className="flex items-center gap-4">
          <li>
            <a href="#">Privacy</a>
          </li>
          <li>|</li>
          <li>
            <a href="#">Terms</a>
          </li>
          <li>|</li>
          <li>
            <a href="#">Cookies</a>
          </li>
        </ul>
      </motion.div>
    </motion.div>
  );
};

export default Footer;

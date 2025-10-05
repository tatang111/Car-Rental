"use client";

import { useAuthStore } from "@/app/store/useAuthStore";
import { signIn, useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { axiosInstance } from "@/lib/axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const userFormSchema = z.object({
  name: z.string("Username is required").optional(),
  email: z
    .string("Email is required")
    .nonempty("Email is required")
    .email("Invalid email"),
  password: z
    .string("Password is required")
    .nonempty("Password is required")
    .min(8, "Password must be at least 8 characters"),
});

type UserFormSchema = z.infer<typeof userFormSchema>;

const Login = () => {
  const [state, setState] = useState<string>("login");
  const [loading, setLoading] = useState<boolean>(false);
  const form = useForm<UserFormSchema>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });
  const { setShowLogin, setToken } = useAuthStore();
  const router = useRouter();

  const onSubmit = async (values: UserFormSchema) => {
    try {
      console.log(values.email);
      const { email, name, password } = values;
      const { data } = await axiosInstance.post(`/user/${state}`, {
        name,
        email,
        password,
      });

      if (data.success) {
        toast.success("Successfully logged in");
        router.push("/");
        setToken(data.token);
        localStorage.setItem("token", data.token);
      } else {
        toast.error(data.message);
      }
      setShowLogin(false);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  const handleLoginWithGoogle = async () => {
    setLoading(true);
    try {
      await signIn("google", { redirect: false });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={() => setShowLogin(false)}
      className="fixed inset-0 z-100 flex items-center text-sm text-gray-600 bg-black/50"
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          onClick={(e) => e.stopPropagation()}
          className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] text-gray-500 rounded-lg shadow-xl border border-gray-200 bg-white"
        >
          <p className="text-2xl font-medium m-auto">
            <span className="text-primary">User</span>{" "}
            {state === "login" ? "Login" : "Sign Up"}
          </p>
          {state === "register" && (
            <div className="w-full">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
          <div className="w-full">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="w-full">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {state === "register" ? (
            <p>
              Already have account?{" "}
              <span
                onClick={() => setState("login")}
                className="text-primary cursor-pointer"
              >
                click here
              </span>
            </p>
          ) : (
            <p>
              Create an account?{" "}
              <span
                onClick={() => setState("register")}
                className="text-primary cursor-pointer"
              >
                click here
              </span>
            </p>
          )}
          <button
            type="submit"
            className="bg-primary hover:bg-primary-dull transition-all text-white w-full py-2 rounded-md cursor-pointer"
          >
            {state === "register" ? "Create Account" : "Login"}
          </button>
          <div className="flex items-center w-full -my-2">
            <div className="flex-grow h-px bg-gray-300"></div>
            <span className="px-2 text-sm text-gray-500">or</span>
            <div className="flex-grow h-px bg-gray-300"></div>
          </div>
          <button
            type="button"
            onClick={handleLoginWithGoogle}
            disabled={loading}
            className={`w-full flex items-center -mb-5 gap-2 justify-center bg-white border border-gray-500/30 py-2.5 cursor-pointer hover:bg-gray-100 rounded-full text-gray-800 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <img
              className="h-4 w-4"
              src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/login/googleFavicon.png"
              alt="googleFavicon"
            />
            {loading ? "Loading..." : "Log in with Google"}
          </button>
        </form>
      </Form>
    </div>
  );
};

export default Login;

"use client";

import React, { ReactNode, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import useAuthInit from "@/hooks/useAuthInit";
import { MotionConfig } from "motion/react";

const Provider = ({ children }: { children: ReactNode }) => {
  const [queryClient] = useState(() => new QueryClient());
  useAuthInit();

  return (
    <MotionConfig>
      <QueryClientProvider client={queryClient}>
        <SessionProvider>{children}</SessionProvider>
      </QueryClientProvider>
    </MotionConfig>
  );
};

export default Provider;

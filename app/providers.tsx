"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
import { ModalProvider } from "@/components/modal/provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";


const queryClient = new QueryClient()

const API_KEY = (process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY as string);

export function Providers({ children }: { children: React.ReactNode }) {
  return (
	<QueryClientProvider client={queryClient}>
    <SessionProvider>
      <Toaster className="dark:hidden" />
      <Toaster theme="dark" className="hidden dark:block" />
      <ModalProvider>{children}</ModalProvider>
    </SessionProvider>
	</QueryClientProvider>

  );
}




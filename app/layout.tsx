import "@/styles/globals.css";
import { cal, inter } from "@/styles/fonts";
import { Analytics } from "@vercel/analytics/react";
import { Providers } from "./providers";
import { Metadata } from "next";
import { cn } from "@/lib/utils";
import favico from "@/public/favico/favicon.ico"

const title =
  "Kariah.me : Laman Sehenti Untuk Kegunaan Ahli Kariah Kawasan Anda";
const description =
  "Dapatkan Maklumat Setempat Seperti Waktu Solat, Aktiviti Masjid & Surau, Urusan & Temujanji";

export const metadata: Metadata = {
  title,
  description,
  icons: ["https://kariah.me/favicon.ico"],
  openGraph: {
    title,
    description,
  },
  twitter: {
    card: "summary",
    title,
    description,
    creator: "@drmsr_dev",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(cal.variable, inter.variable)}>
        <Providers>
          {children}
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}

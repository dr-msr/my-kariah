import "@/styles/globals.css";
import { cal, inter } from "@/styles/fonts";
import { Analytics } from "@vercel/analytics/react";
import { Providers } from "./providers";
import { Metadata } from "next";
import { cn } from "@/lib/utils";
import { SpeedInsights } from "@vercel/speed-insights/next"

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
		<head>
			<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
			<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
			<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
			<link rel="manifest" href="/site.webmanifest" />
		</head>
      <body className={cn(cal.variable, inter.variable)}>
        <Providers>
          {children}
          <SpeedInsights/>
		  <Analytics />
        </Providers>
      </body>
    </html>
  );
}

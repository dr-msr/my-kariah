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
    card: "summary_large_image",
    title,
    description,
    creator: "@drmsr_dev",
	images: "/full-snapshot.png"
  },
  metadataBase: new URL("https://kariah.me"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {


	const googleMapScriptSrc = "https://maps.googleapis.com/maps/api/js?key=" + process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY + "&loading=async&libraries=places&callback=initMap"

  return (
    <html lang="en" suppressHydrationWarning>
		<head>
			<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
			<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
			<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
			<link rel="manifest" href="/site.webmanifest" />
			<script async src={googleMapScriptSrc}></script>

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

import { Metadata } from "next";
import GoPageClient from "./page.client";

const title =
  "Solat.Today | Go.Kariah.Me : Waktu Solat Anda, Di Mana Jua Anda Berada";
const description =
  "Dapatkan Maklumat Waktu Solat Seperti Waktu Subuh, Zohor, Asar, Maghrib & Isyak, Dan Lokasi Masjid Atau Kariah Terdekat Berhampiran Anda";

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
	images: "/full-snapshot.png?updated=2021-10-20"
  },
};

export default function GoPage() {
	return (
		<GoPageClient />
);
}
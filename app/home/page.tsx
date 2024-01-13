import { InlineSnippet } from "@/components/form/domain-configuration";
import Image from "next/image";
import logo1024 from "@/public/assets/logo_1024.png"
import ai_frontpage from "@/public/assets/ai_frontpage.png"
import { FaMosque } from "react-icons/fa6";
import Link from "next/link"

const content = {
	navbar : {
		title : "Kariah.me",
	},

	headline : "Selamat Datang Kariah.me",
	byline : "Pusat digital sehenti untuk ahli kariah mendapatkan maklumat terkini masjid dan surau anda - pengumuman, aktiviti dan program, waktu solat dan pelbagai lagi.",
	button1 : {
		title : "Cari Kariah",
		url : "",
	},
	button2 : {
		title : "Daftar",
		url : ""
	},

	subcontent_title : "Segalanya Di Satu Aplikasi",
	subcontent_header : "Rujukan Ahli Kariah Anda",
	subcontent_desc : "Laman Kariah.me ini menawarkan pelbagai maklumat dan informasi untuk diakses oleh ahli kariah anda, pada bila-bila masa.",

	subcontent_box1 : {
		title :  "Lokasi dan Pandu Arah",
		desc : "Maklumat lokasi kariah anda secara terperinci. Pandu arah untuk aplikasi seperti Google Maps dan Waze menuju ke masjid dan surau dalam kawasan kariah anda.",
	},
	subcontent_box2 : {
		title :  "Countdown Waktu Solat",
		desc : "Waktu solat terkini, termasuk syuruk dan dhuha. Sumber dari API JAKIM. Reminder waktu solat setiap hari, kepada ahli kariah (opt in).",
		},
	subcontent_box3 : {
		title : "Makluman Whatsapp Terkini",
		desc : "Edaran Whatsapp untuk pengumuman, maklumat, info terkini, terus ke Whatsapp ahli kariah anda. Terhad kepada maksimum sehari sekali sahaja. "
	},
	subcontent_box4 : {
		title : "Jadual Kuliah & Aktiviti",
		desc : "Kemaskini aktivi dan program untuk ahli kariah anda! Senarai penceramah, tajuk, kursus dan bengkel, aktiviti komuniti dan gotong-royong - didalam bentuk jadual dan Google Calendar."
	},
	subcontent_box5 : {
		title : "Urusan & Temujanji",
		desc : "Membantu urusan imam dan pegawai masjid, tempahan dewan masjid, urusan borang perkahwinan, pendaftaran khairat kematian."
	},
	subcontent_box6 : {
		title : "Maklumat Sumbangan & Derma",
		desc : "Pautan dan Kod QR untuk tujuan infaq dan derma. Maklumat dan laporan pungutan derma dan kewangan untuk akses kepada ahli kariah anda sahaja."
	},
	subcontent_cta1 : {
		title : "Daftar Kariah Anda",
		url : "",
	}, 
	subcontent_cta2 : {
		title : "Cari",
		url : "",
	},

	footer : "Kariah.me adalah berasaskan sumber terbuka, dikelolakan oleh drmsr.dev"

}

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link className="flex items-center justify-center" href="#">
          <FaMosque className="h-6 w-6" />
          <span className="sr-only">{content.navbar.title}</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            About Us
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            Events
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            Donate
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            Contact
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full pt-12 md:pt-24 lg:pt-32 border-y">
          <div className="px-4 md:px-6 space-y-10 xl:space-y-16">
            <div className="grid max-w-[1300px] mx-auto gap-4 px-4 sm:px-6 md:px-10 md:grid-cols-2 md:gap-16">
              <div>
                <h1 className="lg:leading-tighter text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-[3.4rem] 2xl:text-[3.75rem]">
					{content.headline}                
				</h1>
              </div>
              <div className="flex flex-col items-start space-y-4">
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
					{content.byline}
                </p>
                <div className="space-x-4">
                  <Link
                    className="inline-flex h-9 items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 "
                    href={content.button1.url}
                  >
					{content.button1.title}
					                  </Link>
                  <Link
                    className="inline-flex h-9 items-center justify-center rounded-md border border-gray-200 border-gray-200 bg-white px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50"
                    href={content.button2.url}
                  >
					{content.button2.title}
                  </Link>
                </div>
              </div>
            </div>
            <Image
              alt="Mosque"
              className="mx-auto aspect-[3/1] overflow-hidden rounded-t-xl object-cover object-bottom"
              height={300}
              src={ai_frontpage}
              width={1270}
            />
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container space-y-12 px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-gray-100 px-3 py-1 text-sm">
					{content.subcontent_title}
				</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">{content.subcontent_header}</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed ">
					{content.subcontent_desc}
                </p>
              </div>
            </div>
            <div className="mx-auto grid items-start gap-8 sm:max-w-4xl sm:grid-cols-2 md:gap-12 lg:max-w-5xl lg:grid-cols-3">
              <div className="grid gap-1">
                <h3 className="text-lg font-bold">{content.subcontent_box1.title}</h3>
                <p className="text-sm text-gray-500 ">
				{content.subcontent_box1.desc}                </p>
              </div>
              <div className="grid gap-1">
                <h3 className="text-lg font-bold">{content.subcontent_box2.title}</h3>
                <p className="text-sm text-gray-500 ">
				{content.subcontent_box2.desc}                </p>
              </div>
              <div className="grid gap-1">
                <h3 className="text-lg font-bold">{content.subcontent_box3.title}</h3>
                <p className="text-sm text-gray-500 ">
				{content.subcontent_box3.desc}                </p>
              </div>
			  <div className="grid gap-1">
                <h3 className="text-lg font-bold">{content.subcontent_box4.title}</h3>
                <p className="text-sm text-gray-500 ">
				{content.subcontent_box4.desc}                </p>
              </div>
              <div className="grid gap-1">
                <h3 className="text-lg font-bold">{content.subcontent_box5.title}</h3>
                <p className="text-sm text-gray-500 ">
				{content.subcontent_box5.desc}                </p>
              </div>
              <div className="grid gap-1">
                <h3 className="text-lg font-bold">{content.subcontent_box6.title}</h3>
                <p className="text-sm text-gray-500 ">
				{content.subcontent_box6.desc}                </p>
              </div>
            </div>
            <div className="flex justify-center flex-col sm:flex-row items-start gap-4">
              <Link
                className="inline-flex h-10 items-center justify-center rounded-md bg-gray-900 px-8 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50"
                href={content.subcontent_cta1.url}

              >
				{content.subcontent_cta1.title}
              </Link>
              <Link
                className="inline-flex h-10 items-center justify-center rounded-md border border-gray-200 border-gray-200 bg-white px-8 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 "
                href={content.subcontent_cta2.url}

              >
				{content.subcontent_cta2.title}
              </Link>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 ">© 2024 {content.footer}</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
)}

// export default function HomePage() {
//   return (
//     <div className="flex h-screen flex-col items-center justify-center space-y-10 bg-black">
//       <Image
//         width={512}
//         height={512}
//         src={logo1024}
//         alt="Platforms on Vercel"
//         className="w-48"
//       />
//       <h1 className="text-white">
//         Edit this page on{" "}
//         <InlineSnippet className="ml-2 bg-blue-900 text-blue-100">
//           app/home/page.tsx
//         </InlineSnippet>
//       </h1>
//     </div>
//   );
// }

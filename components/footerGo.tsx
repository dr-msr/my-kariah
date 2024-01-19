import { Facebook, Twitter } from "lucide-react"
import Link from "next/link"

const FooterGo = () => {
	return (
		<div id="footerGo" className="w-full flex flex-row items-center justify-center gap-5 p-5">
			<Link href="https://www.facebook.com/sharer/sharer.php?u=https://solat.today" target="_blank"><Facebook size={20} color="#9CA3AF" className="hover:fill-gray-400"/></Link>
			<Link href="http://www.twitter.com/share?url=https://solat.today" target="_blank"><Twitter size={20} color="#9CA3AF" className="hover:fill-gray-400" /></Link>
		</div>
	)
}

export default FooterGo




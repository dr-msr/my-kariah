import { Title } from "@tremor/react"


const HeaderGo = () => {
	return (
		<div id="headerGo" className="w-full flex flex-row items-center justify-center gap-1">
				<Title>Solat.Today</Title>
				<Title className="text-gray-400 hover:underline">by kariah.me</Title>
		</div>
	)
}

export default HeaderGo
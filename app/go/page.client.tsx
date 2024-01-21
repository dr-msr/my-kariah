"use client";

import { Card, Text, Subtitle } from "@tremor/react";
import React, { useEffect, useState } from 'react';
import Lottie from 'react-lottie';
import loadingAnim from '../../public/assets/anims/locateGPS.json';
import searchingAnim from '../../public/assets/anims/searching.json';
import WaktuSolat from "@/components/module/waktuSolat";
import GetKariahGo from "@/components/module/getKariahGo";
import { Transition } from '@headlessui/react'
import NavSearch from "@/components/nav-search";
import HeaderGo from "@/components/headerGo";
import FooterGo from "@/components/footerGo";
import SnippetHadis from "@/components/module/snippetHadis";


const GoPageClient = () => {
	const [gpsEnabled, setGPSEnabled] = useState(true);
	const [fadeOut, setFadeOut] = React.useState({
		opacity: 1,
		height : 100,
	});
	const [loadWaktuSolat, setLoadWaktuSolat] = useState(false);
	const [gps, setGPS] = useState({
		lat : 0,
		long : 0,
	})

	function loadGPS(pos: any) {
		setGPS({
			lat : pos.coords.latitude,
			long : pos.coords.longitude,
		})
		setFadeOut({
			opacity: 0,
			height: 0,
		}),
		setLoadWaktuSolat(true)
	}

	function errorGPS(err: { code: any; message: any; }) {
		console.warn(`ERROR(${err.code}): ${err.message}`);
		setGPSEnabled(false)
	}

	useEffect(() => {
		navigator.geolocation.getCurrentPosition(loadGPS, errorGPS);		
	},[])

	return (
	<>	
		{ !gpsEnabled ? (
					
			<div className="flex mt-5 flex-col items-center justify-center gap-5">
				<Transition 
					show={!gpsEnabled}
					enter="transition-opacity duration-1000"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="transition-opacity duration-1000"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				> 
				 <Lottie
					options = {{
			  		loop: true,
			  		autoplay: true,
			  		animationData: searchingAnim,
			  		rendererSettings: {
					preserveAspectRatio: "xMidYMid slice"
			 	 }
					}}
					height={200}
					width='100%'
					style={{marginBottom: '1rem'}} 
		  />
				<Text>Tidak dapat mengenalpasti maklumat lokasi anda.</Text>
				<div className="w-full max-w-md m-2"><NavSearch /></div>
				</Transition>
			</div>
		) : null }
		<Transition 
				show={gpsEnabled}
				enter="transition-opacity duration-1000"
				enterFrom="opacity-0"
				enterTo="opacity-100"
				leave="transition-opacity duration-1000"
				leaveFrom="opacity-100"
				leaveTo="opacity-0"
			>

		<div className="flex mt-4 flex-col items-center justify-center gap-2.5">
			<div className="max-w-xs mx-auto w-full md:w-3/4 max-w-screen-md">
				<HeaderGo />
			</div>
			
			<Lottie
			style ={{transition: 'opacity 0.3s, height 0.3s', ...fadeOut}}
			options = {{
			  loop: true,
			  autoplay: true,
			  animationData: loadingAnim,
			  rendererSettings: {
				preserveAspectRatio: "xMidYMid slice"
			  }
			}}
			height={100}
			width={100} 
			/>

		  	<div id="container" className="flex flex-col gap-2.5 lg:flex-row w-3/4 max-w-screen-md gap-2.5">

				<div id="left" className="max-w-xs mx-auto bg-gray w-full shrink-0 lg:max-w-xs flex flex-col justify-between gap-2.5">
					<Card id="waktuSolat" className="">
						{ loadWaktuSolat && (<WaktuSolat gpsLat={gps.lat} gpsLng={gps.long} /> ) }
					</Card>

					{/* <div id="snippet" className="lg:max-w-xs grow p-2 max-h-36">
					<SnippetHadis />
					</div> */}
				</div>
			
				<Card id="secondCard" className="mx-auto bg-gray w-full max-w-xs lg:max-w-full grow">
					<GetKariahGo lat={gps.lat} lng={gps.long} />
				</Card>
		  	</div>
		  	
			<div className="max-w-xs mx-auto w-full lg:w-3/4 max-w-screen-md">
				<FooterGo />
			</div>
		</div>
		</Transition>
		</>
	  );
}

export default GoPageClient
"use client";

import { Card, Text } from "@tremor/react";
import React, { useEffect, useState } from 'react';
import Lottie from 'react-lottie';
import loadingAnim from '../../public/assets/anims/locateGPS.json';
import WaktuSolat from "@/components/module/waktuSolat";
import GetKariahGo from "@/components/module/getKariahGo";



export default function GoPage() {
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
		console.log(pos)
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
	}

	useEffect(() => {
		const gps = navigator.geolocation.getCurrentPosition(loadGPS, errorGPS);		
	},[])


	return (
		<div className="flex h-screen flex-col items-center justify-center">
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
		  <div id="container" className="flex flex-col gap-2.5 md:flex-row w-3/4 max-w-screen-md gap-2.5">
			<Card id="waktuSolat" className="max-w-xs mx-auto bg-gray w-full shrink-0 md:max-w-fit">
			  { loadWaktuSolat && (<WaktuSolat gpsLat={gps.lat} gpsLng={gps.long} /> ) }
			</Card>
			<Card id="secondCard" className="mx-auto bg-gray w-full max-w-xs md:max-w-full grow">
				<GetKariahGo lat={gps.lat} lng={gps.long} />

			</Card>
		  </div>
		</div>
	  );
}
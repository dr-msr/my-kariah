"use client";

import { Card, Text } from "@tremor/react";
import React, { useEffect, useState } from 'react';
import Lottie from 'react-lottie';
import loadingAnim from '../../public/assets/anims/locateGPS.json';
import searchingAnim from '../../public/assets/anims/searching.json';
import WaktuSolat from "@/components/module/waktuSolat";
// import GetKariahGo from "@/components/module/getKariahGo";
import { Transition } from '@headlessui/react'
import NavSearch from "@/components/nav-search";
import HeaderGo from "@/components/headerGo";
import FooterGo from "@/components/footerGo";


const GoPageClient = () => {
	const lookup = require("coordinate_to_country");
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
	const [notMy, setNotMy]	= useState(false);
	const [errorCountry, setErrorCountry] = useState({
		lat : "",
		long : "",
		country : "",
	});

	var options = {
		enableHighAccuracy: true,
		timeout: 5000,
		maximumAge: 0,
	  };

	function loadGPS(pos: any) {
		const CTY = lookup(pos.coords.latitude, pos.coords.longitude);

		if (CTY[0] == "MYS") {
			setNotMy(false);
			setGPS({
				lat : pos.coords.latitude,
				long : pos.coords.longitude,
			})
			setFadeOut({
				opacity: 0,
				height: 0,
			}),
			setLoadWaktuSolat(true)
		} else {
			setNotMy(true);
			setErrorCountry({
				lat : pos.coords.latitude,
				long : pos.coords.longitude,
				country : CTY[0],
			})
			setGPS({
				lat : 3.1319,
				long : 101.6841,
			})
			setFadeOut({
				opacity: 0,
				height: 0,
			}),
			setLoadWaktuSolat(true)
		}
	}

	function errorGPS(err: { code: any; message: any; }) {
		console.warn(`ERROR(${err.code}): ${err.message}`);
		setGPSEnabled(false)
	}

	useEffect(() => {
		if (navigator.geolocation) {
		  navigator.permissions
			.query({ name: "geolocation" })
			.then(function (result) {
			  console.log(result);
			  if (result.state === "granted") {
					navigator.geolocation.getCurrentPosition(loadGPS, errorGPS, options);
			  } else if (result.state === "prompt") {
					navigator.geolocation.getCurrentPosition(loadGPS, errorGPS, options);
			  } else if (result.state === "denied") {
					setGPSEnabled(false)
			  }
			});
		} else {
		  console.log("Geolocation is not supported by this browser.");
		}
	  }, []);

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
			
			

		  	<div id="container" className="flex flex-col gap-2.5 lg:flex-row w-3/4 max-w-screen-md gap-2.5">

				<div id="left" className="max-w-xs mx-auto bg-gray w-full shrink-0 lg:max-w-xs flex flex-col justify-between gap-2.5">
					
				{ notMy && (

					<Card id="NotMy" decoration="top" decorationColor="red">
							<div className="flex flex-col gap-2">
							<code className="border w-full px-2 text-sm mt-2 text-gray-400">
								GPS Latitude : {errorCountry.lat} <br />
								GPS Longitude : {errorCountry.long}<br />
								Country Detected : {errorCountry.country}
							</code>

							<Text>
								<span className="text-red-400">Your location is not in Malaysia. </span>
								We have defaulted the Prayer Times to <span className="font-bold">Kuala Lumpur</span>.
							</Text>

							</div>
					</Card>
				)}

					
					<Card id="waktuSolat" className="">
						{ loadWaktuSolat && (<WaktuSolat gpsLat={gps.lat} gpsLng={gps.long} /> ) }
					</Card>
				</div>
			
				{/* <Card id="secondCard" className="mx-auto bg-gray w-full max-w-xs lg:max-w-full grow">
					<GetKariahGo lat={gps.lat} lng={gps.long} />
				</Card> */}
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
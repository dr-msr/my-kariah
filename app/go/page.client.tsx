"use client";

import { Card, Subtitle, Text } from "@tremor/react";
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
	const [isLoading, setLoading] = useState(true);
	
	var options = {
		enableHighAccuracy: false,
		timeout: 5000,
		maximumAge: 0,
	  };

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
			setLoading(false)
	}

	function errorGPS(err: { code: any; message: any; }) {
		console.warn(`ERROR(${err.code}): ${err.message}`);
		setGPSEnabled(false)
		setLoading(false)
	}

	useEffect(() => {
		if (navigator.geolocation) {
		  navigator.permissions
			.query({ name: "geolocation" })
			.then(function (result) {
			  if (result.state === "granted") {
					navigator.geolocation.getCurrentPosition(loadGPS, errorGPS);
			  } else if (result.state === "prompt") {
					navigator.geolocation.getCurrentPosition(loadGPS, errorGPS,{
						timeout: 4000,
					});
			  } else if (result.state === "denied") {
					setGPSEnabled(false)
					setLoading(false)
			  }
			});
		} else {
		  console.log("Geolocation is not supported by this browser.");
		  setGPSEnabled(false)
		  setLoading(false)
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

			<div className="max-w-xs mx-auto w-full my-4 md:w-3/4 max-w-screen-md">
				<HeaderGo />

				{ isLoading && ( 
					<div className="mt-2">
						<Lottie
							style ={{transition: 'opacity 0.3s, height 0.3s', ...fadeOut}}
							isClickToPauseDisabled={true}
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


					<Card className="p-2">
						<Subtitle>Obtaining GPS information..</Subtitle>
					</Card>
					</div>
				)}

			</div>



			

		<Transition 
				show={gpsEnabled}
				enter="transition-opacity duration-1000"
				enterFrom="opacity-0"
				enterTo="opacity-100"
				leave="transition-opacity duration-1000"
				leaveFrom="opacity-100"
				leaveTo="opacity-0"
			>

			
		<div className="flex flex-col items-center justify-center gap-2.5">

			
			

		  	<div id="container" className="flex flex-col gap-2.5 lg:flex-row w-3/4 max-w-screen-md gap-2.5">

				<div id="left" className="max-w-xs mx-auto bg-gray w-full shrink-0 lg:max-w-xs flex flex-col justify-between gap-2.5">

					
					{ loadWaktuSolat && ( 
						<Card id="waktuSolat" className="">
							<WaktuSolat gpsLat={gps.lat} gpsLng={gps.long} /> 
						</Card>
					)}
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
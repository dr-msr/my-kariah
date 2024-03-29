"use client";

import { Card, List, ListItem, Metric, Text, Subtitle } from "@tremor/react";
import { useEffect, useState } from "react";
import { Transition } from '@headlessui/react'
import { OverlayArrow, Tooltip, TooltipTrigger, Button } from "react-aria-components";
import getDaerahByJakimCode, { getZoneFromGPS } from "@/lib/waktuSolat";
import NavSearch from "../nav-search";

interface WaktuSolatProps {
	gpsLat : number | null,
	gpsLng : number | null,
  }

interface WaktuSolatIF {
	hijri: string;
	day: number;
	fajr: number;
	syuruk: number;
	dhuhr: number;
	asr: number;
	maghrib: number;
	isha: number;
  }

const WaktuSolat = (input :  WaktuSolatProps) => {
	const lookup = require("coordinate_to_country");
	const [waktuSolat, setWaktuSolat] = useState<WaktuSolatIF[]>([]);
	const [currentTime, setCurrentTime] = useState<Date>();
	const [timerCountdown, setTimerCountdown] = useState('');
	const [nextPrayer, setNextPrayer] = useState( {
		prayer : "",
		time : "",
	})
	const [statusCountdown, setStatusCountdown] = useState('');
	const [loadCountdown, setLoadingCountdown] = useState(false);
	const [zonSolat, setZonSolate] = useState('')
	const [showError, setShowError] = useState(false);


	function getTimerCountdown( current : number, upcoming : number){
		const date1 = new Date(current * 1000);
    	const date2 = new Date(upcoming * 1000);
    	const difference = Math.abs(date1.getTime() - date2.getTime());
    	const hours = Math.floor(difference / 3600000);
    	const minutes = Math.floor((difference % 3600000) / 60000);
    	const seconds = Math.floor((difference % 60000) / 1000);
		const formattedHours = hours.toString().padStart(2, '0');
		const formattedMinutes = minutes.toString().padStart(2, '0');
		const formattedSeconds = seconds.toString().padStart(2, '0');
		
		setTimerCountdown(formattedHours + ":" + formattedMinutes + ":" + formattedSeconds);

		if (hours > 0) {
			setStatusCountdown('indigo')
		} else {
			if (minutes <= 15) {
				setStatusCountdown('red')
			} else {
				setStatusCountdown('orange')
			}
		}
	}

	function getNextPrayer() {
		const today = (new Date().getDate()) - 1

		if (currentTime != undefined && waktuSolat[0] != undefined) {
			const comparedTime = currentTime.getTime() / 1000;

			if (comparedTime > waktuSolat[today].fajr && comparedTime <= waktuSolat[today].dhuhr) {
				setNextPrayer({ prayer : "Dhuhr", time : convertTime(waktuSolat[today].dhuhr)})
				getTimerCountdown(comparedTime, waktuSolat[today].dhuhr )

			} else if (comparedTime > waktuSolat[today].dhuhr && comparedTime <= waktuSolat[today].asr)  {
				setNextPrayer({ prayer : "Asr", time : convertTime(waktuSolat[today].asr)})
				getTimerCountdown(comparedTime, waktuSolat[today].asr )
					
			} else if (comparedTime > waktuSolat[today].asr && comparedTime <= waktuSolat[today].maghrib)  {
				setNextPrayer({ prayer : "Maghrib", time : convertTime(waktuSolat[today].maghrib)})
				getTimerCountdown(comparedTime, waktuSolat[today].maghrib )

			} else if (comparedTime > waktuSolat[today].maghrib && comparedTime <= waktuSolat[today].isha)  {
				setNextPrayer({ prayer : "Isha", time : convertTime(waktuSolat[today].isha)})
				getTimerCountdown(comparedTime, waktuSolat[today].isha )

			} else if (comparedTime > waktuSolat[today].isha && comparedTime <= waktuSolat[today + 1].fajr)  {
				setNextPrayer({ prayer : "Fajr", time : convertTime(waktuSolat[today + 1].fajr)})
				getTimerCountdown(comparedTime, waktuSolat[today + 1].fajr )

			} else {
				setNextPrayer({ prayer : "Fajr", time : convertTime(waktuSolat[today].fajr)})
				getTimerCountdown(comparedTime, waktuSolat[today].fajr )
			}
		}	
		if ((nextPrayer.prayer != "") && (loadCountdown == false)) {
			setLoadingCountdown(true)
		}	
	}

	function formatHijri(input : string) {
		const dateParts = input.split('-');	
		const year = parseInt(dateParts[0], 10);
		const month = parseInt(dateParts[1], 10);
		const day = parseInt(dateParts[2], 10);
		const hijriMonths :  { [key: number]: string }= {
			1 : "Muharram",
			2 : "Safar",
			3 : "Rabiul Awwal",
			4 : "Rabiul Akhir",
			5 : "Jamadil Awwal",
			6 : "Jamadil Akhir",
			7 : "Rejab",
			8 : "Syaaban",
			9 : "Ramadhan",
			10 : "Syawwal",
			11 : "Zulkaedah",
			12 : "Zulhijjah"
		}
		const output = day + " " + hijriMonths[month] + " " + year + "H"
		return output;
	}

	function convertTime(time : number) {
		const date = new Date(time * 1000);
		const localTimeString = date.toLocaleTimeString();
		const parts = localTimeString.split(':');
		const timeWithoutSeconds = parts.slice(0, 2).join(':');
		return timeWithoutSeconds
	}

	function getWaktuSolat(type : string, dayMultiplier : number) {
		const day = (new Date().getDate()) + (dayMultiplier - 1)

		if (waktuSolat[day]) {
			switch (type) {
			case "asr":
				return convertTime(waktuSolat[day].asr);
			case "dhuhr":
				return convertTime(waktuSolat[day].dhuhr);
			case "fajr":
				return convertTime(waktuSolat[day].fajr);
			case "maghrib":
				return convertTime(waktuSolat[day].maghrib);
			case "isha":
				return convertTime(waktuSolat[day].isha);
			case "hijri":
				return waktuSolat[day].hijri;
			default:
				return "Invalid type";
			}
		  } else {
			return "Loading";
		  }
		}

	function countsecond() {
		setCurrentTime(new Date());
		getNextPrayer();
	}
	setTimeout(countsecond,1000);

	useEffect(() => {
		const fetchData = async () => {
		try {
			const zoneResult = getZoneFromGPS(input.gpsLng, input.gpsLat)
			if (zoneResult == null) { 
				throw new Error('Unable to get Zone information');
			}

			const url2 = "https://api.waktusolat.app/v2/solat/" + zoneResult.zone;
			const waktuSolatResponse = await fetch(encodeURI(url2));
	  
			if (!waktuSolatResponse.ok) {
			  throw new Error('Waktu Solat network response was not ok');
			}
			const waktuSolatResult = await waktuSolatResponse.json();
			setWaktuSolat(waktuSolatResult.prayers);
			setZonSolate(zoneResult.zone);

		} catch (error) {
			console.error('Error fetching data:', error);
			setShowError(true);
			setLoadingCountdown(true)
		}};
		fetchData();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
			<div style={{display:"flex", flexDirection:"column", gap:10, justifyContent:'center', alignItems:'center'}}>
	
			{ !loadCountdown ? (	
				<div>
					<div className="w-full max-w-md mx-auto animate-pulse p-1 flex flex-col items-center">
						{ zonSolat != '' && 
							<div className="my-1 flex flex-col items-center"> 
								<div>Retrieving Waktu Solat </div>
								<div><Subtitle>{zonSolat} : {getDaerahByJakimCode(zonSolat)}</Subtitle></div>				
							</div>
						}
						<p className="w-48 h-4 mt-2 bg-gray-200 rounded-lg dark:bg-gray-700"></p>
						<p className="w-48 h-10 mt-2 bg-gray-200 rounded-lg dark:bg-gray-700"></p>
						<p className="w-48 h-4 mt-2 bg-gray-200 rounded-lg dark:bg-gray-700"></p>
					</div>
				</div>

			) : null}

			{ showError && (
				<div className="flex flex-col gap-2">
				<code className="border w-full px-2 text-sm mt-2 text-gray-400">
					GPS Latitude : {input.gpsLat} <br />
					GPS Longitude : {input.gpsLng}<br />
					Country Detected : {lookup(input.gpsLat, input.gpsLng)} <br />
				</code>

				<Text>
					<span className="text-red-400">Solat.Today only works in Malaysia. Please select manually the following Kariah : </span>
				</Text>
				<NavSearch />

				</div>
			)}

			<Transition 
				show={(loadCountdown && !showError)}
				enter="transition-opacity duration-1000"
				enterFrom="opacity-0"
				enterTo="opacity-100"
				leave="transition-opacity duration-1000"
				leaveFrom="opacity-100"
				leaveTo="opacity-0"
			>



				<Card className="w-full mx-auto" style={{padding:10}} decoration="top" decorationColor={statusCountdown}>
					<div style={{display:'flex', flexDirection:'column', gap:5, justifyContent:'space-between', alignItems:'center'}}>
							<Text>Upcoming : {nextPrayer.prayer} - {nextPrayer.time} </Text>
							<Metric>{timerCountdown}</Metric>
							<Text>Now : { currentTime ? currentTime.toLocaleTimeString() : 'Loading..'} </Text>
					</div>
				</Card>

				<List className="min-w-md" style={{ width:'100%', paddingLeft:10, paddingRight:10}}>
					<ListItem><span>Fajr</span><span>{getWaktuSolat('fajr',0)}</span></ListItem>
					<ListItem><span>Dhuhr</span><span>{getWaktuSolat('dhuhr',0)}</span></ListItem>
					<ListItem><span>Asar</span><span>{getWaktuSolat('asr',0)}</span></ListItem>
					<ListItem><span>Maghrib</span><span>{getWaktuSolat('maghrib',0)}</span></ListItem>
					<ListItem><span>Isha</span><span>{getWaktuSolat('isha',0)}</span></ListItem>
				</List>
		

				<div style={{fontSize:12, textAlign:"center"}}><Text style={{textAlign:"center"}}>{currentTime?.toLocaleDateString(undefined, {year: 'numeric', month: 'long', day: 'numeric'})} | {formatHijri(getWaktuSolat('hijri',0))}</Text></div>
				<div style={{fontSize:12, textAlign:"center"}}>
					<TooltipTrigger>
						<Button> <Subtitle>{zonSolat} : {getDaerahByJakimCode(zonSolat)}</Subtitle> </Button>
						<Tooltip>
							<OverlayArrow style={{backgroundColor:'#f3f4f6'}}>
							<svg width={8} height={8} viewBox="0 0 8 8">
								<path d="M0 0 L4 4 L8 0" />
							</svg>
							</OverlayArrow>
							<Text style={{fontSize:10}}>{getDaerahByJakimCode(zonSolat)}</Text>
  						</Tooltip>
					</TooltipTrigger>
				</div>
				</Transition>
			</div>
		)
	}

export default WaktuSolat
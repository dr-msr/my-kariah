"use client";

import { Card, List, ListItem, Metric, Text } from "@tremor/react";
import { getTime } from "date-fns";
import {
	allPostcodes,
	getStates,
	getCities,
	findCities,
	getPostcodes,
	findPostcode,
  } from "malaysia-postcodes";
import { useEffect, useState } from "react";


interface WaktuSolatProps {
	gpsLat : number | null,
	gpsLng : number | null
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

	const [waktuSolat, setWaktuSolat] = useState<WaktuSolatIF[]>([]);
	const [currentTime, setCurrentTime] = useState<Date>();
	const [timerCountdown, setTimerCountdown] = useState('');
	const [nextPrayer, setNextPrayer] = useState( {
		prayer : "",
		time : "",
	})
	const [statusCountdown, setStatusCountdown] = useState('');

	function getTimerCountdown( current : number, upcoming : number){
		const date1 = new Date(current * 1000);
    	const date2 = new Date(upcoming * 1000);

    	const difference = Math.abs(date1.getTime() - date2.getTime());

    	const hours = Math.floor(difference / 3600000);
    	const minutes = Math.floor((difference % 3600000) / 60000);
    	const seconds = Math.floor((difference % 60000) / 1000);

		setTimerCountdown( hours + ":" + minutes + ":" + seconds)

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
		if (currentTime != undefined) {
			const comparedTime = currentTime.getTime() / 1000;
		if (comparedTime > waktuSolat[today].fajr && comparedTime <= waktuSolat[today].dhuhr) {
			setNextPrayer({ prayer : "Dhuhr", time : convertTime(waktuSolat[today].dhuhr)})
			setTimerCountdown((waktuSolat[today].dhuhr - comparedTime).toString())


			
		} else if (comparedTime > waktuSolat[today].dhuhr && comparedTime <= waktuSolat[today].asr)  {
			setNextPrayer({ prayer : "Asr", time : convertTime(waktuSolat[today].asr)})
			getTimerCountdown(comparedTime, waktuSolat[today].asr )
			// setTimerCountdown(Math.floor((waktuSolat[today].asr - comparedTime) / 60) + " min " + Math.floor((waktuSolat[today].asr - comparedTime) % 60) + " sec")
				

		} else if (comparedTime > waktuSolat[today].asr && comparedTime <= waktuSolat[today].maghrib)  {
			setNextPrayer({ prayer : "Maghrib", time : convertTime(waktuSolat[today].maghrib)})
		} else if (comparedTime > waktuSolat[today].maghrib && comparedTime <= waktuSolat[today].isha)  {
			setNextPrayer({ prayer : "Isha", time : convertTime(waktuSolat[today].isha)})
		} else if (comparedTime > waktuSolat[today].isha && comparedTime <= waktuSolat[today + 1].fajr)  {
			setNextPrayer({ prayer : "Fajr", time : convertTime(waktuSolat[today + 1].fajr)})
		} else {
			setNextPrayer({ prayer : "Fajr", time : convertTime(waktuSolat[today].fajr)})
		}}		
	}

	function formatHijri(input : string) {

		const dateParts = input.split('-');
		
		const year = parseInt(dateParts[0], 10);
		const month = parseInt(dateParts[1], 10);
		const day = parseInt(dateParts[2], 10);

		let monthStr = ""

		switch (month) {
			case 1 :
				monthStr = "Muharram"; break;
			case 2 :
				monthStr = "Safar";  break;
			case 3 :
				monthStr = "Rabiul Awwal";  break;
			case 4 :
				monthStr = "Rabiul Akhir";	 break;		
			case 5 :
				monthStr = "Jamadil Awwal"; break;
			case 6 :
				monthStr = "Jamadil Akhir";	 break;		
			case 7 :
				monthStr = "Rejab"; break;
			case 8 :
				monthStr = "Syaaban"; break;
			case 9 :
				monthStr = "Ramadhan"; break;
			case 10 :
				monthStr = "Syawal"; break;
			case 11 :
				monthStr = "Zulkaedah"; break;
			case 12 :
				monthStr = "Zulhijjah";	 break;		
		}



		const output = day + " " + monthStr + " " + year + "H"

		return output;
	}


	function countsecond() {
		setCurrentTime(new Date());
		getNextPrayer();
	}

	setTimeout(countsecond,1000);


	useEffect(() => {
		const fetchData = async () => {
		  try {
			const zoneResponse = await fetch(
			  "https://corsproxy.io/?https://api.waktusolat.app/zones/gps?lat=" + input.gpsLat + "&long=" + input.gpsLng
			);
	  
			if (!zoneResponse.ok) {
			  throw new Error('Zone network response was not ok');
			}
	  
			const zoneResult = await zoneResponse.json();
			console.log(zoneResult);
	  
			const URL = 'https://corsproxy.io/?' + encodeURIComponent('https://api.waktusolat.app/v2/solat/' + zoneResult.zone);
			const waktuSolatResponse = await fetch(URL);
	  
			if (!waktuSolatResponse.ok) {
			  throw new Error('Waktu Solat network response was not ok');
			}
	  
			const waktuSolatResult = await waktuSolatResponse.json();
			console.log(waktuSolatResult);
			console.log(waktuSolatResult.prayers);
			console.log(waktuSolatResult.prayers[0]);
			setWaktuSolat(waktuSolatResult.prayers);
		  } catch (error) {
			console.error('Error fetching data:', error);
		  }
		};
	  
		fetchData();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	  }, []);


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


	return (

	<div style={{display:"flex", flexDirection:"column", gap:10, justifyContent:'center', alignItems:'center'}}>
	<Card className="max-w-xs mx-auto" style={{padding:10}} decoration="top" decorationColor={statusCountdown}>
		<div style={{display:'flex', flexDirection:'column', gap:5, justifyContent:'space-between', alignItems:'center'}}>
    	<Text>Upcoming : {nextPrayer.prayer} - {nextPrayer.time} </Text>
    	<Metric>{timerCountdown}</Metric>
		<Text>Now : { currentTime ? currentTime.toLocaleTimeString() : 'Loading..'} </Text>
		</div>
  	</Card>
	  <List style={{paddingLeft:10, paddingRight:10}}>
        <ListItem><span>Fajr</span><span>{getWaktuSolat('fajr',0)}</span></ListItem>
		<ListItem><span>Dhuhr</span><span>{getWaktuSolat('dhuhr',0)}</span></ListItem>
        <ListItem><span>Asar</span><span>{getWaktuSolat('asr',0)}</span></ListItem>
        <ListItem><span>Maghrib</span><span>{getWaktuSolat('maghrib',0)}</span></ListItem>
        <ListItem><span>Isha</span><span>{getWaktuSolat('isha',0)}</span></ListItem>
    </List>
	<Text style={{fontSize:12, alignSelf:'center'}}>{currentTime?.toLocaleDateString(undefined, {year: 'numeric', month: 'long', day: 'numeric'})} | {formatHijri(getWaktuSolat('hijri',0))}</Text>
	</div>


	)

}

export default WaktuSolat
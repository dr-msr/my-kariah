import getCors from "@/lib/cors";
import { getDistance, getSiteFromPlaceID, getSitesSortedByDistance } from "@/lib/actions";
import { useEffect, useState } from "react";
import { Transition } from '@headlessui/react'
import { Text, Badge, Button } from "@tremor/react";
import { MapPin, Car } from "lucide-react";
import { useRouter } from "next/navigation";

interface GetKariahGoProps {
	lat : number;
	lng : number;
}

type listplace = {
	name : string;
	subdomain : string | null;
	lat : number,
	lng : number,
	placeID : string,
	distance : number,
	duration : number,
}

const getNearestMosque = async (lat : number, lng : number) => {
	const url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' + lat + ',' + lng + '&key=' + process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY + '&keyword=masjid&rankby=distance&language=ms'
	const response = await fetch(getCors(url));
	return (response.json())
}

const GetKariahGo = (input : GetKariahGoProps) => {
	const go = useRouter();
	const [loaded, setLoaded] = useState(false);
	const [listResult, setListResult] = useState<listplace[]>([
		{
			name : "",
			subdomain : null,
			lat : 0,
			lng : 0,
			placeID : "",
			distance : 0,
			duration : 0,
		}])
	const [nearest, setNearest] = useState<any>(null)

	const handleOutro = (url : string | null) => {
		var loadUrl = ""
		if (url) {
			loadUrl = url
		} else {
			loadUrl = "go"
		}
		go.push("https://" + loadUrl + ".kariah.me")
	}

	async function updateListResult() {
		const lokasi = await getDistance(input.lat, input.lng, nearest.geometry.location.lat, nearest.geometry.location.lng);
		if (lokasi && lokasi.routes && lokasi.routes[0] && lokasi.routes[0].legs) {
		  setListResult(prevState => [{
			name: nearest.name,
			subdomain: null,
			lat: nearest.gpsLat,
			lng: nearest.gpsLng,
			placeID: nearest.place_id,
			distance : lokasi.routes[0].legs[0].distance.value,
			duration : lokasi.routes[0].legs[0].duration.value,
		  }, ...prevState]);
		  setLoaded(true);
		}
	}
	  
	function convertDistance(input : number) {
		if (input < 1000) {
			return input + " m"
		} else {
			return Math.floor(input/1000) + " km"
		}
	}

	function convertDuration(input : number) {
		return "~" + Math.floor(input/60) + " min"
	}
	
	function constructURL(placeid : string, originLat : number, originLng : number, name : string) {
		const url = "https://www.google.com/maps/dir/?api=1&origin=" + originLat + "," + originLng + "&destination=" + name + "&destination_place_id=" + placeid + "&travelmode=driving"
		return (encodeURI(url))
	}

	useEffect(() => {
		if (nearest != undefined) {
			getSiteFromPlaceID(nearest.place_id, nearest.name, nearest.geometry.location.lat, nearest.geometry.location.lng)
				.then(async (response_db) => {
					console.log(response_db)
					if (response_db != undefined) {
						updateListResult();
					}})
				.catch((error) => {
					console.log(error)
				})}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [nearest])

	useEffect(() => {

		getNearestMosque(input.lat, input.lng)
		.then((response) => {
			setNearest(response.results[0]);
			})
		.catch((error) => {console.log(error);});
	  
		getSitesSortedByDistance(input.lat, input.lng)
		.then((sites) => {
			const filteredSites = sites.filter(site => site !== null);
			filteredSites.sort((a, b) => a.distance - b.distance);
			const results = filteredSites.slice(0, 4).map(site => ({
			  name: site.name,
			  subdomain: site.subdomain,
			  lat: site.lat,
			  lng: site.lng,
			  placeID: site.placeID,
			  distance : site.distance,
			  duration : site.duration
			}));
			setListResult(results);
			})
		.catch((error) => { console.log(error);});
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [input]);

	return (
	<>
		{ !loaded ? (
			<div id="skeleton" className="w-full max-w-md mx-auto animate-pulse p-1 flex flex-col items-center">
	 				<p className="w-full p-5 h-4 bg-gray-200 rounded-lg dark:bg-gray-700"></p>
	 				<p className="w-full p-5 h-10 mt-2 bg-gray-200 rounded-lg dark:bg-gray-700"></p>
	 				<p className="w-full p-5 h-4 mt-2 bg-gray-200 rounded-lg dark:bg-gray-700"></p>
	 			</div>
		) : null }

		<Transition 
			show={loaded}
			enter="transition-opacity duration-1000"
			enterFrom="opacity-0"
			enterTo="opacity-100"
			leave="transition-opacity duration-1000"
			leaveFrom="opacity-100"
			leaveTo="opacity-0">

		<div id="list result" className="flex flex-col gap-2.5">
		
		{listResult.map((item, index) => (
			<div key={index} style={{display:"flex", flexDirection:"row", justifyContent:"space-between", alignItems:"center"}}>
				<div className='border border-solid border-gray-200 rounded-lg p-2' style={{display:"flex", flexDirection:"row", justifyContent:"space-between", flexGrow:1}}>
					
					<div id="mainrow" style={{display:"flex", flexDirection:"column", justifyContent:"center", gap:10}}>
						
						<div id="name" style={{fontWeight:"bold"}} className="flex max-w-full flex-wrap">
							<Text>{item.name}</Text>
						</div>

						<div id="badge" className="flex flex-row gap-1 text-xs max-w-full flex-wrap">
							{ (index === 0) ?  (<Badge size="xs" icon={MapPin}>Nearest</Badge>) : null }	
							<Badge color="teal" size="xs" icon={MapPin}>{convertDistance(item.distance)}</Badge>
							<Badge color="teal" size="xs" icon={Car}>{convertDuration(item.duration)}</Badge>
						</div>

					</div>

					<div id="actionButton" style={{display:"flex", flexDirection:"column", justifyContent:"flex-end", alignItems:"stretch"}}>
						
						<div id="action1">
							<Button variant="light" className=' min-w-full border border-solid border-gray-200 rounded-lg p-1 hover:border-blue-800' 
							onClick={() => !(index == 0) ? handleOutro(item.subdomain) : console.log("Load")}>
								<Text>{ !(index == 0) ? "Details" : "Register" }</Text>
							</Button>
						</div>

						<div id="action2">
							<a href={constructURL(item.placeID, input.lat, input.lng, item.name)} target="_blank">
								<Button variant="light" className='min-w-full border border-solid border-gray-200 rounded-lg p-1 hover:border-blue-800'>
									<Text>Navigate</Text>
								</Button>
							</a>
						</div>

					</div>
				</div>
			</div>				
		))}
		</div>
		</Transition>
	</>
);}

export default GetKariahGo

import { getDistance, getSiteFromPlaceID, getSitesSortedByDistance } from "@/lib/actions";
import getCors from "@/lib/cors";
import { SetStateAction, useEffect, useState } from "react";
import { RadioGroup, Transition } from '@headlessui/react'
import { Card, Text, Badge, Title, Dialog, DialogPanel, Button } from "@tremor/react";
import { MapPin, Car, CarTaxiFront, Router } from "lucide-react";
import { FaMosque } from "react-icons/fa6";
import { useRouter } from "next/navigation";



interface GetKariahGoProps {
	lat : number;
	lng : number;
}

const getNearestMosque = async (lat : number, lng : number) => {
	const url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' + lat + ',' + lng + '&key=' + process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY + '&keyword=masjid&rankby=distance&language=ms'
	const response = await fetch(getCors(url));
	return (response.json())
}

type listplace = {
	name : string;
	subdomain : string | null;
	lat : number,
	lng : number,
	distance : number,
	duration : number,
}

const GetKariahGo = ( input : GetKariahGoProps) => {
	const [loaded, setLoaded] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const [listResult, setListResult] = useState<listplace[]>([
		{
			name : "",
			subdomain : null,
			lat : 0,
			lng : 0,
			distance : 0,
			duration : 0,
		}
	])
	const [nearest, setNearest] = useState<any>(null)
	const [selectedKariah, setSelectedKariah] = useState<listplace>(listResult[0])
	const [selectedName, setSelectedName] = useState("")
	const go = useRouter();


	useEffect(() => {
		getNearestMosque(input.lat, input.lng)
		  .then((response) => {
			setNearest(response.results[0]);
		  })
		  .catch((error) => {
			console.log(error);
		  });
	  
		getSitesSortedByDistance(input.lat, input.lng)
		  .then((sites) => {
			const filteredSites = sites.filter(site => site !== null);
			filteredSites.sort((a, b) => a.distance - b.distance);
	  
			const results = filteredSites.slice(0, 4).map(site => ({
			  name: site.name,
			  subdomain: site.subdomain,
			  lat: site.lat,
			  lng: site.lng,
			  distance : site.distance,
			  duration : site.duration
			}));
	  
			setListResult(results);
		  })
		  .catch((error) => {
			console.log(error);
		  });
	  }, [input]);

async function updateListResult() {
		const lokasi = await getDistance(input.lat, input.lng, nearest.geometry.location.lat, nearest.geometry.location.lng);
		if (lokasi && lokasi.routes && lokasi.routes[0] && lokasi.routes[0].legs) {
		  setListResult(prevState => [{
			name: nearest.name,
			subdomain: null,
			lat: nearest.gpsLat,
			lng: nearest.gpsLng,
			distance : lokasi.routes[0].legs[0].distance.value,
			duration : lokasi.routes[0].legs[0].duration.value,
		  }, ...prevState]);
		  setLoaded(true);
		}
}
	  
	  

	useEffect(() => {
		console.log(nearest)
		if (nearest != undefined) {
			getSiteFromPlaceID(nearest.place_id, nearest.name, nearest.geometry.location.lat, nearest.geometry.location.lng)
				.then(async (response_db) => {
					console.log(response_db);
					if (response_db != undefined) {
						updateListResult();
					}
				
		})
		.catch((error) => {
			console.log(error)
		})
		}
// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [nearest])

		
function convertDistance(input : number) {
	if (input < 1000) {
		return input + " m"
	} else {
		return (input/1000).toFixed(1) + " km"
	}
}

function convertDuration(input : number) {

		return (input/60).toFixed(1) + " min"
}


const handleOutro = (url : string | null) => {
	var loadUrl = ""
	if (url) {
		loadUrl = url
	} else {
		loadUrl = "go"
	}
	go.push("https://" + loadUrl + ".kariah.me")
}




	
	return (
<>
		{ !loaded ? (
			<div className="w-full max-w-md mx-auto animate-pulse p-1 flex flex-col items-center">
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
				leaveTo="opacity-0"
			>

			<div className="flex flex-col gap-2.5">
		{listResult.map((item, index) => (
			<div key={index} style={{display:"flex", flexDirection:"row", justifyContent:"space-between", alignItems:"center"}}>
				<div className='border border-solid border-gray-200 rounded-lg p-2' style={{display:"flex", flexDirection:"row", justifyContent:"space-between", flexGrow:1}}>
					
					<div style={{display:"flex", flexDirection:"column", justifyContent:"center", gap:10}}>
					<div style={{fontWeight:"bold"}} className="flex max-w-full flex-wrap">
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
						<Button variant="light" className='min-w-full border border-solid border-gray-200 rounded-lg p-1 hover:border-blue-800' 
						onClick={() => go.push("https://" + item.subdomain + ".kariah.me")}>
							<Text>Navigate</Text>
						</Button>
					</div>
					
				</div>


				</div>

				
			
			
			
			
			</div>		



		
		
		
		))}
		
		
		</div>
		<Dialog open={isOpen} onClose={(val) => setIsOpen(val)} static={true}>
		<DialogPanel>
		<Title className="mb-3">Test : {selectedKariah.name}</Title>
		This is a placeholder.
		<div className="mt-3">
			<Button variant="light" onClick={() => setIsOpen(false)}>
			Close
			</Button>
		</div>
		</DialogPanel>
		</Dialog>
	 
	  
	  </Transition>
	  </>
	);
}

export default GetKariahGo

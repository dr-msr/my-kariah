import { getDistance, getSiteFromPlaceID, getSitesSortedByDistance } from "@/lib/actions";
import getCors from "@/lib/cors";
import { SetStateAction, useEffect, useState } from "react";
import { RadioGroup } from '@headlessui/react'
import { Card, Text } from "@tremor/react";



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
	name : string | null;
	subdomain : string | null;
	lat : number | null,
	lng : number | null,
	distance : number,
	duration : number,
}


const GetKariahGo = ( input : GetKariahGoProps) => {
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
	const [exist, setExist] = useState<any>(null)
	const [selectedKariah, setSelectedKariah] = useState<listplace>()
	const [distance, setDistance] = useState<Array<any>>([]);

	// const response = useQuery({
	// 	queryKey : [input], 
	// 	queryFn : ({ queryKey }) => getNearestMosque(queryKey[0].lat, queryKey[0].lng),
	// 	});
	
	// if (response.data != undefined){
	// 	setReceived(response.data.results[0])
	// }

	// useEffect(() => {
	// 	const exist = useQuery({
	// 		queryKey : received, 
	// 		queryFn : ({ queryKey }) => getSiteFromPlaceID(queryKey.place_id),
	// 	});
	// 	setExist(exist.data)
	// },[received])

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
		console.log(lokasi)	
		console.log(nearest)
		
		if (lokasi && lokasi.routes && lokasi.routes[0] && lokasi.routes[0].legs) {
		  setListResult(prevState => [{
			name: nearest.name,
			subdomain: null,
			lat: nearest.gpsLat,
			lng: nearest.gpsLng,
			distance : lokasi.routes[0].legs[0].distance.value,
			duration : lokasi.routes[0].legs[0].duration.value,
		  }, ...prevState]);
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
	
	return (
		<RadioGroup value={selectedKariah} onChange={setSelectedKariah}>
			<div className="flex flex-col gap-2.5">

		{listResult.map((item, index) => (

		<RadioGroup.Option key={index} value={item.subdomain} disabled={true}>
		  {({ checked }) => (
				<div className={checked ? checkedClass : uncheckedClass} style={{display:"flex", flexDirection:"column"}}>
					<div className='flex flex-row justify-between items-center'>
						<div><Text>{item.name}</Text></div>
						<div className="flex flex-row gap-0.5 md:flex-col gap-2">
							<div><Text style={{textAlign:'center'}}>{convertDistance(item.distance)}</Text> </div>
							<div><Text style={{textAlign:'center'}}>{convertDuration(item.duration)}</Text></div>
						</div>
					</div>

				</div>
				
		  )}
		</RadioGroup.Option>))}
		
		
		</div>
	  </RadioGroup>
	);
}

export default GetKariahGo

const uncheckedClass = 'border border-solid border-gray-200 rounded-lg p-2 hover:bg-gray-700 hover:text-white'
const checkedClass = 'border border-solid border-gray-200 rounded-xl p-2 bg-gray-700 text-white'
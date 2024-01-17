import { getSiteFromPlaceID } from "@/lib/actions";
import getCors from "@/lib/cors";
import { Card, Text } from "@tremor/react";
import { useEffect, useState } from "react";
import { RadioGroup } from '@headlessui/react'


interface GetKariahGoProps {
	lat : number;
	lng : number;
}

const getNearestMosque = async (lat : number, lng : number) => {
	const url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' + lat + ',' + lng + '&type=mosque&key=' + process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY + '&keyword=masjid&rankby=distance'
	const response = await fetch(getCors(url));
	return (response.json())
}

const getDistance = async (lat : number, lng : number, place_id : string) => {
	const url = 'https://maps.googleapis.com/maps/api/directions/json?destination=' + place_id + '&origin=' + lat + ',' + lng + '&key=' + process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY
	const response = await fetch(getCors(url));
	return (response.json())
}


type listplace = {
	name : string | null;
	subdomain : string | null;
	lat : number | null,
	lng : number | null,
}


const GetKariahGo = ( input : GetKariahGoProps) => {
	const [listResult, setListResult] = useState<listplace[]>([
		{
			name : "",
			subdomain : null,
			lat : 0,
			lng : 0,
		}
	])
	const [nearest, setNearest] = useState<any>(null)
	const [exist, setExist] = useState<any>(null)
	const [selectedKariah, setSelectedKariah] = useState<listplace>()

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
			setNearest(response.results[0])
		})
		.catch((error) => {
			console.log(error)
		}
	)},[input])

	useEffect(() => {
		console.log(nearest)
		if (nearest != undefined) {
			getSiteFromPlaceID(nearest.place_id, nearest.name, nearest.geometry.location.lat, nearest.geometry.location.lng)
				.then((response_db) => {
					console.log(response_db);
					if (response_db != undefined) {
						setListResult([{
							name : response_db.name,
							subdomain : response_db? response_db.subdomain : null,
							lat : response_db.gpsLat,
							lng : response_db.gpsLng,
						}])

					}
				
		})
		.catch((error) => {
			console.log(error)
		})
		}
	}, [nearest])

	
	// useEffect(() => {
	// 	if (exist == null) {
	// 		setListResult([{
	// 			name : received.name? received.name : null,
	// 			subdomain : null,
	// 			lat : received.geometry.location.lat,
	// 			lng : received.geometry.location.lng,
	// 		}])
		
	
	// 	} else {
	// 		setListResult([{
	// 			name : exist.data? exist.data.name : null,
	// 			subdomain : exist.data? exist.data.subdomain : null,
	// 			lat : exist.data? exist.data.gpsLat : null,
	// 			lng : exist.data? exist.data.gpsLng : null,
	// 		}])
		
	// 	}
	

	// },[exist])


	


	// const distanceResponse = useQuery({
	// 		queryKey : received,  
	// 		queryFn : ({ queryKey }) => getDistance(input.lat, input.lng, queryKey.place_id),
	// 	});
		

	
	return (
		<RadioGroup value={selectedKariah} onChange={setSelectedKariah}>
			<div className="flex flex-col gap-2.5">
		<RadioGroup.Option value="startup">
		  {({ checked }) => (
			<div className={checked ? checkedClass : uncheckedClass}>Startup</div>
		  )}
		</RadioGroup.Option>
		<RadioGroup.Option value="business">
		  {({ checked }) => (
			<div className={checked ? checkedClass : uncheckedClass}>Business</div>
		  )}
		</RadioGroup.Option>
		<RadioGroup.Option value="enterprise">
		  {({ checked }) => (
			<div className={checked ?checkedClass : uncheckedClass}>Enterprise</div>
		  )}
		</RadioGroup.Option>
		</div>
	  </RadioGroup>
	);
}

export default GetKariahGo

const uncheckedClass = 'border border-solid border-gray-200 rounded-xl p-2 hover:bg-gray-700 hover:text-white'
const checkedClass = 'border border-solid border-gray-200 rounded-xl p-2 bg-gray-700 text-white'
import { getSiteFromPlaceID } from "@/lib/actions";
import getCors from "@/lib/cors";
import { Card, Text } from "@tremor/react";
import { useEffect, useState } from "react";

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
	const [listResult, setListResult] = useState<listplace[]>([])
	const [nearest, setNearest] = useState<any>(null)
	const [exist, setExist] = useState<any>(null)

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
							name : response_db? response_db.name : null,
							subdomain : response_db? response_db.subdomain : null,
							lat : response_db? response_db.gpsLat : null,
							lng : response_db? response_db.gpsLng : null,
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
		<div>
			<Card className="max-w-xs mx-auto">
    <Text>{listResult[0].name}</Text>
  </Card>

		</div>
	);
}

export default GetKariahGo
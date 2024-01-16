"use client";

import { geocodeByPlaceId, getLatLng } from "react-google-places-autocomplete";


const getGPS = async (placeID : string, type : string) => {
	try {
		const results = await geocodeByPlaceId(placeID);
		const { lat, lng } = await getLatLng(results[0]);
	
		if (type === "lat") {
		  return lat;
		} else {
		  return lng;
		}
	  } catch (error) {
		console.error(error);
		return null; // Return a default value or handle the error as needed
	  }

}

export default getGPS
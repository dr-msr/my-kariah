
import {
	allPostcodes,
	getStates,
	getCities,
	findCities,
	getPostcodes,
	findPostcode,
  } from "malaysia-postcodes";


  interface WaktuSolatProps {
	postcode : string | null
  }



const WaktuSolat = (input :  WaktuSolatProps) => {
	const output = findPostcode(input.postcode,true);

	return (
	<div> {output.city}</div>)

}

export default WaktuSolat
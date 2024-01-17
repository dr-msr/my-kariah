interface GetKariahGoProps {
	lat : number;
	lng : number;
}

async function getNearestMosque(lat : number, lng : number) {

	const url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?&location=-33.8670522%2C151.1957362&type=mosque&key=YOUR_API_KEY'
}


const GetKariahGo = ( input : GetKariahGoProps) => {
	return (
		<div>
			{input.lat} {input.lng}
		</div>
	);
}
'use client'

import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'

const Map = () => {
	return (
		<MapContainer center={[6.1514,100.5047]} zoom={11} scrollWheelZoom={false} style={{width:'100%', height:'100%'}}>
		<TileLayer
		  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
		  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
		/>
	  	</MapContainer>
	)
}


export default Map;
"use client";

import { getAllKariah } from "@/lib/actions";
import { set } from "date-fns";
import { findPostcode } from "malaysia-postcodes";
import { useRouter } from "next/navigation";
import { SetStateAction, useEffect, useState } from "react"
import Select from "react-tailwindcss-select"
import { SelectValue } from "react-tailwindcss-select/dist/components/type";


const NavSearch = () => {
	const [value, setValue] = useState(null)
	const [loading, setLoading] = useState(true)
	const [placeholder, setPlaceholder] = useState("Loading..")
	const [isDisabled, setDisabled] = useState(true)
	const router = useRouter();
	const [finalList, setFinalList] = useState([{
		label : "",
		options : [{
			value : "",
			label : ""
		}],
	}])

	useEffect(() => {
		const alldata = getAllKariah();
		var outputData = [{
			label : "",
			options : [{
				value : "",
				label : ""
			}]}]
		outputData.length = 0;
		alldata.then((result) => {
			result.forEach((item) => {
				const state = findPostcode(item.postcode);
				if (state.state != undefined) {
				const negeri_exists = outputData.filter(negeri => negeri.label === state.state)
				if (negeri_exists.length > 0) {
					negeri_exists[0].options.push({
						value : item.subdomain ? item.subdomain : "",
						label : item.name ? item.name : ""
					})
				} else {
					outputData.push({
						label : state.state,
						options : [{
							value : item.subdomain ? item.subdomain : "",
							label : item.name ? item.name : ""
						}]
					})
				}}})

				outputData.sort((a, b) => {
					// Sort by outer label
					if (a.label < b.label) return -1;
					if (a.label > b.label) return 1;
				
					// If outer labels are equal, sort by inner label
					if (a.options[0].label < b.options[0].label) return -1;
					if (a.options[0].label > b.options[0].label) return 1;
				
					return 0; // If everything is equal
				});
				
				setFinalList(outputData);
				setLoading(false);
				setPlaceholder("Cari kariah anda disini");
				setDisabled(false);


		alldata.catch((err) => {
			console.log(err)
		})})
	},[])
	
	function handleChange(value : SelectValue | null)  {
		const castedValue = value as { value: string, label: string } | null;
		const go_url = "https://"+ castedValue?.value + ".kariah.me";
		router.push(go_url);
	}

	return (

	<Select
		options={finalList}
		primaryColor={"#1a202c"}
		onChange={(value) => handleChange(value)}
		value={value}
		isClearable={true}
		isSearchable={true}
		loading={loading}
		placeholder={placeholder}
		isDisabled={isDisabled}

	/>

	)
}

export default NavSearch
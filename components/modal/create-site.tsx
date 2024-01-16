"use client";

import { toast } from "sonner";
import { createSite } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";
import LoadingDots from "@/components/icons/loading-dots";
import { useModal } from "./provider";
import va from "@vercel/analytics";
import { useEffect, useState } from "react";
import { SearchSelect, SearchSelectItem } from "@tremor/react";
import { ZonSolat } from "@/lib/waktuSolat";
import GooglePlacesAutocomplete, { getLatLng, geocodeByPlaceId } from 'react-google-places-autocomplete';
import { Option } from "react-google-places-autocomplete/build/types";
import { SingleValue } from "react-select";

export default function CreateSiteModal() {
	const [value, setValue] = useState<SingleValue<Option> | null>(null); // Initialize with null or an appropriate initial value
	const [gps, setGps] = useState({
		lat : 0,
		lon : 0,
	})
	const [add, setAdd] = useState('');
	const router = useRouter();
  const modal = useModal();

  const [data, setData] = useState({
    name: "",
    subdomain: "",
	address : "",
	placeID : "",
	gpsLat : 0,
	gpsLng : 0,
	postcode : "",
  });


  useEffect(() => {
    setData((prev) => ({
      ...prev,
      subdomain: prev.name
        .toLowerCase()
        .trim()
        .replace(/[\W_]+/g, "-"),
    }));
  }, [data.name]);

  useEffect(() => {
    const fetchData = async () => {
		try {
		  const response = await fetch(
			'https://maps.googleapis.com/maps/api/geocode/json?place_id=' + data.placeID + '&region=my&key=' + process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY
		  );
  
		  if (!response.ok) {
			throw new Error('Network response was not ok');
		  }
  
		  const result = await response.json();
		  console.log(result);
		  setData((prev) => ({
			...prev,
			gpsLat : result.results[0].geometry.location.lat,
			gpsLng : result.results[0].geometry.location.lng,
			postcode : result.results[0].address_components[result.results[0].address_components.length - 1].long_name,
		  }))
		} catch (error) {
		  console.error('Error fetching data:', error);
		}
	  };
  
	  fetchData();
  }, [data.placeID]);


  
  async function getGPS(input : SingleValue<Option>) {
	try {
		const results = await geocodeByPlaceId(input?.value.place_id);
		const { lat, lng } = await getLatLng(results[0]);

		return { lat : lat, lon: lng };



	  } catch (error) {
		console.error(error);
	  }
	}	


  function getAddress(input : SingleValue<Option>) {
	return input?.value.structured_formatting.secondary_text
  }


  return (
    <form
      action={async (data: FormData) => {
		console.log(data)
        createSite(data).then((res: any) => {
          if (res.error) {
            toast.error(res.error);
          } else {
            va.track("Created Kariah");
            const { id } = res;
            router.refresh();
            router.push(`/sites/${id}`);
            modal?.hide();
            toast.success(`Successfully created kariah!`);
			console.log(res);
			console.log(data);
          }
        })}
      }
      className="w-full rounded-md bg-white dark:bg-black md:max-w-md md:border md:border-stone-200 md:shadow dark:md:border-stone-700"
    >
      <div className="relative flex flex-col space-y-4 p-5 md:p-10">
        <h2 className="font-cal text-2xl dark:text-white">Create a new Kariah</h2>

        <div className="flex flex-col space-y-2">
          <label
            htmlFor="name"
            className="text-sm font-medium text-stone-500 dark:text-stone-400"
          >
            Name
          </label>
          <input
            name="name"
            type="text"
            placeholder="Nama Kariah (Masjid atau Surau)"
            autoFocus
            value={data.name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
            maxLength={32}
            required
            className="w-full rounded-md border border-stone-200 bg-stone-50 px-4 py-2 text-sm text-stone-600 placeholder:text-stone-400 focus:border-black focus:outline-none focus:ring-black dark:border-stone-600 dark:bg-black dark:text-white dark:placeholder-stone-700 dark:focus:ring-white"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label
            htmlFor="subdomain"
            className="text-sm font-medium text-stone-500"
          >
            URL
          </label>
          <div className="flex w-full max-w-md">
            <input
              name="subdomain"
              type="text"
              placeholder="Alamat URL"
              value={data.subdomain}
              onChange={(e) => setData({ ...data, subdomain: e.target.value })}
              autoCapitalize="off"
              pattern="[a-zA-Z0-9\-]+" // only allow lowercase letters, numbers, and dashes
              maxLength={32}
              required
              className="w-full rounded-l-lg border border-stone-200 bg-stone-50 px-4 py-2 text-sm text-stone-600 placeholder:text-stone-400 focus:border-black focus:outline-none focus:ring-black dark:border-stone-600 dark:bg-black dark:text-white dark:placeholder-stone-700 dark:focus:ring-white"
            />
            <div className="flex items-center rounded-r-lg border border-l-0 border-stone-200 bg-stone-100 px-3 text-sm dark:border-stone-600 dark:bg-stone-800 dark:text-stone-400">
              .{process.env.NEXT_PUBLIC_ROOT_DOMAIN}
            </div>
          </div>
        </div>

        {/* <div className="flex flex-col space-y-2">
          <label
            htmlFor="description"
            className="text-sm font-medium text-stone-500"
          >
            Description
          </label>
          <textarea
            name="description"
            placeholder="Description about the kariah."
            value={data.description}
            onChange={(e) => setData({ ...data, description: e.target.value })}
            maxLength={140}
            rows={3}
            className="w-full rounded-md border border-stone-200 bg-stone-50 px-4 py-2 text-sm text-stone-600 placeholder:text-stone-400 focus:border-black  focus:outline-none focus:ring-black dark:border-stone-600 dark:bg-black dark:text-white dark:placeholder-stone-700 dark:focus:ring-white"
          />
        </div> */}

		{/* <div className="flex flex-col space-y-2">
          <label
            htmlFor="zonsolat"
            className="text-sm font-medium text-stone-500 dark:text-stone-400"
          >
            Zon Solat
          </label>
          <SearchSelect value={data.zonsolat} onValueChange={(newValue) => setData({ ...data, zonsolat: newValue })}>
			{ ZonSolat.map((item) => (
				<SearchSelectItem value={item.jakimCode}>{item.jakimCode} : {item.negeri} - {item.daerah}</SearchSelectItem>
			))}
		  </SearchSelect>
        </div> */}

		<div className="flex flex-col space-y-2">
          <label
            htmlFor="search location"
            className="text-sm font-medium text-stone-500 dark:text-stone-400"
          >
            Search Location
          </label>
		  
		  <GooglePlacesAutocomplete
        	apiKey={process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY}
			autocompletionRequest={{
				componentRestrictions: {
					country: ['my'],
				}
			  }}
			  selectProps={{
				value,
				// onChange: (value) => setValue(value),
				onChange: (value) => {
					console.log(value);
					setData({
						...data, 
						address : value ? value.value.structured_formatting.secondary_text : "Empty" ,
						placeID : value ? value.value.place_id : "Empty",
					
					 }),
					 setValue(value)
				},
			  }}
			 />
        </div>

		<div style={{display:'none'}}>
          <label
            htmlFor="address"
            className="text-sm font-medium text-stone-500"
          >
            Address
          </label>
          <textarea
            name="address"
            placeholder="Address about the kariah."
            value={data.address}
            onChange={(e) => setData({ ...data, address: e.target.value })}
            className="w-full rounded-md border border-stone-200 bg-stone-50 px-4 py-2 text-sm text-stone-600 placeholder:text-stone-400 focus:border-black  focus:outline-none focus:ring-black dark:border-stone-600 dark:bg-black dark:text-white dark:placeholder-stone-700 dark:focus:ring-white"
          />
        </div>

		<div style={{display:'none'}}>
          <label
            htmlFor="placeID"
            className="text-sm font-medium text-stone-500"
          >
            PlaceID
          </label>
          <textarea
            name="placeID"
            placeholder="PlaceID about the kariah."
            value={data.placeID}
            onChange={(e) => setData({ ...data, placeID: e.target.value })}
            className="w-full rounded-md border border-stone-200 bg-stone-50 px-4 py-2 text-sm text-stone-600 placeholder:text-stone-400 focus:border-black  focus:outline-none focus:ring-black dark:border-stone-600 dark:bg-black dark:text-white dark:placeholder-stone-700 dark:focus:ring-white"
          />
        </div>

		<div style={{display: 'none'}}>
          <label
            htmlFor="gpsLat"
            className="text-sm font-medium text-stone-500"
          >
            GPS Latitude
          </label>
          <textarea
            name="gpsLat"
            placeholder="PlaceID about the kariah."
            value={data.gpsLat}
            onChange={(e) => setData({ ...data, gpsLat: parseFloat(e.target.value) })}
            className="w-full rounded-md border border-stone-200 bg-stone-50 px-4 py-2 text-sm text-stone-600 placeholder:text-stone-400 focus:border-black  focus:outline-none focus:ring-black dark:border-stone-600 dark:bg-black dark:text-white dark:placeholder-stone-700 dark:focus:ring-white"
          />
        </div>

		<div style={{ display : 'none'}}>
          <label
            htmlFor="gpsLng"
            className="text-sm font-medium text-stone-500"
          >
            GPS Longitude
          </label>
          <textarea
            name="gpsLng"
            placeholder="PlaceID about the kariah."
            value={data.gpsLng}
            onChange={(e) => setData({ ...data, gpsLng: parseFloat(e.target.value) })}
            className="w-full rounded-md border border-stone-200 bg-stone-50 px-4 py-2 text-sm text-stone-600 placeholder:text-stone-400 focus:border-black  focus:outline-none focus:ring-black dark:border-stone-600 dark:bg-black dark:text-white dark:placeholder-stone-700 dark:focus:ring-white"
          />
        </div>

		<div style={{ display : 'none'}}>
          <label
            htmlFor="postcode"
            className="text-sm font-medium text-stone-500"
          >
Postcode
          </label>
          <textarea
            name="postcode"
            placeholder="postcode about the kariah."
            value={data.postcode}
            onChange={(e) => setData({ ...data, postcode: e.target.value })}
            className="w-full rounded-md border border-stone-200 bg-stone-50 px-4 py-2 text-sm text-stone-600 placeholder:text-stone-400 focus:border-black  focus:outline-none focus:ring-black dark:border-stone-600 dark:bg-black dark:text-white dark:placeholder-stone-700 dark:focus:ring-white"
          />
        </div>



      </div>
      <div className="flex items-center justify-end rounded-b-lg border-t border-stone-200 bg-stone-50 p-3 dark:border-stone-700 dark:bg-stone-800 md:px-10">
        <CreateSiteFormButton />
      </div>
    </form>
  );
}
function CreateSiteFormButton() {
  const { pending } = useFormStatus();
  return (
    <button
      className={cn(
        "flex h-10 w-full items-center justify-center space-x-2 rounded-md border text-sm transition-all focus:outline-none",
        pending
          ? "cursor-not-allowed border-stone-200 bg-stone-100 text-stone-400 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300"
          : "border-black bg-black text-white hover:bg-white hover:text-black dark:border-stone-700 dark:hover:border-stone-200 dark:hover:bg-black dark:hover:text-white dark:active:bg-stone-800",
      )}
      disabled={pending}
    >
      {pending ? <LoadingDots color="#808080" /> : <p>Create Kariah</p>}
    </button>
  );
}

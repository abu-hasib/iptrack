import { key, access } from './api.js';
const ipHolder = document.querySelector('#ip');
const locHolder = document.querySelector('#location');
const timezoneHolder = document.querySelector('#timezone');
const ispHolder = document.querySelector('#isp');
const search = document.querySelector('.search');
let map = L.map('map');

function onStart() {
	let URL = `https://geo.ipify.org/api/v2/country,city?apiKey=${key}`;

	fetch(URL, {
		mode: 'cors',
		headers: {
			'Access-Control-Allow-Origin': 'https://ipify.org',
		},
	})
		.then((response) => response.json())
		.then((data) => {
			const { lat, lng } = data.location;
			displayTrackingDetails(data);
			setMapView(lat, lng);
			pinOnMap(lat, lng);
		})
		.catch((err) => console.error(err));
}

function setMapView(lat, lng) {
	map.setView([`${lat}`, `${lng}`], 13);
	L.tileLayer(
		'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}',
		{
			attribution:
				'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a> <div class="attribution">challenge by <a href="https://www.frontendmentor.io?ref=challenge" target="_blank">Frontend Mentor</a>. dev by <a href="https://ridwanabiola.netlify.app/">Ridwan Abiola</a>.</div>',
			maxZoom: 18,
			id: 'mapbox/streets-v11',
			tileSize: 512,
			zoomOffset: -1,
			accessToken: access,
		}
	).addTo(map);
}

function pinOnMap(lat, lng) {
	var marker = L.marker([`${lat}`, `${lng}`], { color: 'black', fillColor: '#000' }).addTo(map);
	marker.bindPopup('<b>Hey!</b><br>Your ISP is here.').openPopup();
}

function displayTrackingDetails(trackingDetails) {
	const { city, country, timezone } = trackingDetails.location;
	const { ip, isp } = trackingDetails;
	ipHolder.innerHTML = ip;
	locHolder.innerHTML = `${city}, ${country}`;
	timezoneHolder.innerHTML = timezone;
	ispHolder.innerHTML = isp;
}

search.addEventListener('submit', (e) => {
	e.preventDefault();
	let ipAddress = document.querySelector('#ip-address').value;
	main(ipAddress);
});

async function main(searchParams) {
	let URL = `https://geo.ipify.org/api/v2/country,city?apiKey=${key}`;
	/\d/.test(searchParams)
		? (URL += `&ipAddress=${searchParams}`)
		: (URL += `&domain=${searchParams}`);

	const data = await fetch(URL, {
		mode: 'cors',
		headers: {
			'Access-Control-Allow-Origin': '*',
		},
	})
		.then((response) => {
			if (response.status === 422)
				throw new TypeError(response.statusText + ' Try another domain or IP address.');
			return response.json();
		})
		.catch((error) => {
			alert(error);
		});

	if (!data) return;

	const { lat, lng } = data.location;

	displayTrackingDetails(data);
	setMapView(lat, lng);
	pinOnMap(lat, lng);
}

onStart();

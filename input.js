mapboxgl.accessToken = 'pk.eyJ1IjoibGlwaW5sb28iLCJhIjoiY2x6ZTloaW1tMG9rcDJqcG51dG1sMG54ZSJ9.6fM3Sdeox5wE4I3Z8xsR6g'; // Replace with your actual token

const startGeocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    placeholder: 'Start Route',
    types: 'country,region,postcode,district,place,locality,neighborhood,address,poi,poi.landmark',
    countries: 'au'
});

const endGeocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    placeholder: 'End Route',
    types: 'country,region,postcode,district,place,locality,neighborhood,address,poi,poi.landmark',
    countries: 'au'
});

startGeocoder.addTo('#start-geocoder');
endGeocoder.addTo('#end-geocoder');

function searchRoute() {
    const start = startGeocoder.inputString;
    const end = endGeocoder.inputString;
    if (start && end) {
        console.log(`Searching route from ${start} to ${end}`);
        window.location.href = `map.html?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`;
    } else {
        alert('Please enter both start and end locations.');
    }
}

function clearFields() {
    startGeocoder.clear();
    endGeocoder.clear();
}
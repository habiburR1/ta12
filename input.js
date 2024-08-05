mapboxgl.accessToken = 'pk.eyJ1IjoibGlwaW5sb28iLCJhIjoiY2x6ZTloaW1tMG9rcDJqcG51dG1sMG54ZSJ9.6fM3Sdeox5wE4I3Z8xsR6g'; // Replace with your actual token

const melbourneBbox = [144.5937, -38.4339, 145.5125, -37.5113]; // Bounding box for Melbourne

let startFeature = null;
let endFeature = null;

const startGeocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    placeholder: 'Start Route',
    types: 'country,region,postcode,district,place,locality,neighborhood,address,poi,poi.landmark',
    countries: 'au',
    bbox: melbourneBbox
});

const endGeocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    placeholder: 'End Route',
    types: 'country,region,postcode,district,place,locality,neighborhood,address,poi,poi.landmark',
    countries: 'au',
    bbox: melbourneBbox
});

startGeocoder.on('result', (e) => {
    startFeature = e.result;
});

endGeocoder.on('result', (e) => {
    endFeature = e.result;
});

startGeocoder.addTo('#start-geocoder');
endGeocoder.addTo('#end-geocoder');

function searchRoute() {
    if (startFeature && endFeature) {
        const startId = startFeature.id;
        const startText = startFeature.place_name;
        const endId = endFeature.id;
        const endText = endFeature.place_name;
        console.log(`Searching route from ${startId} (${startText}) to ${endId} (${endText})`);
        window.location.href = `map.html?startId=${encodeURIComponent(startId)}&startText=${encodeURIComponent(startText)}&endId=${encodeURIComponent(endId)}&endText=${encodeURIComponent(endText)}`;
    } else {
        alert('Please enter both start and end locations.');
    }
}

function clearFields() {
    startGeocoder.clear();
    endGeocoder.clear();
    startFeature = null;
    endFeature = null;
}

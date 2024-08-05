mapboxgl.accessToken = 'pk.eyJ1IjoibGlwaW5sb28iLCJhIjoiY2x6ZTloaW1tMG9rcDJqcG51dG1sMG54ZSJ9.6fM3Sdeox5wE4I3Z8xsR6g';

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [133.7751, -25.2744], 
    zoom: 4 
});

// directions control
const directions = new MapboxDirections({
    accessToken: mapboxgl.accessToken,
    unit: 'metric',
    profile: 'mapbox/driving'
});

// Add directions control to the map
map.addControl(directions, 'top-left');

// Function to get query parameters
function getQueryParams() {
    const params = {};
    window.location.search.substring(1).split("&").forEach(pair => {
        const [key, value] = pair.split("=");
        params[key] = decodeURIComponent(value);
    });
    return params;
}

// Get start and end locations from query parameters
const params = getQueryParams();
const start = params.start;
const end = params.end;

if (start && end) {
    directions.setOrigin(start);
    directions.setDestination(end);
} else {
    alert('Start or End location is missing.');
}
mapboxgl.accessToken = 'pk.eyJ1IjoibGlwaW5sb28iLCJhIjoiY2x6ZTloaW1tMG9rcDJqcG51dG1sMG54ZSJ9.6fM3Sdeox5wE4I3Z8xsR6g'; // Replace with your Mapbox access token

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [144.9631, -37.8136], // Center on Melbourne
    zoom: 12 // Initial zoom level to show streets of Melbourne
});

// directions control
const directions = new MapboxDirections({
    accessToken: mapboxgl.accessToken,
    unit: 'metric',
    profile: 'mapbox/cycling'
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

// Retry fetch function
function retryFetch(url, options, retries = 3, delay = 1000) {
    return new Promise((resolve, reject) => {
        const fetchAttempt = (attempt) => {
            fetch(url, options)
                .then(response => {
                    if (!response.ok) throw new Error('Fetch failed');
                    return response.json();
                })
                .then(data => resolve(data))
                .catch(error => {
                    if (attempt < retries) {
                        setTimeout(() => fetchAttempt(attempt + 1), delay);
                    } else {
                        reject(error);
                    }
                });
        };
        fetchAttempt(0);
    });
}

// Get start and end locations from query parameters
const params = getQueryParams();
const startId = params.startId;
const startText = params.startText;
const endId = params.endId;
const endText = params.endText;

if (startId && endId) {
    // Fetch the location details from the IDs
    retryFetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${startId}.json?access_token=${mapboxgl.accessToken}`)
        .then(data => {
            const startLocation = data.features[0].center;
            directions.setOrigin(startLocation);
            setTimeout(() => {
                document.querySelector('.mapbox-directions-origin input').value = startText;
            }, 500); // Delay to ensure the input field is available
        })
        .catch(error => console.error('Error fetching start location:', error));

    retryFetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${endId}.json?access_token=${mapboxgl.accessToken}`)
        .then(data => {
            const endLocation = data.features[0].center;
            directions.setDestination(endLocation);
            setTimeout(() => {
                document.querySelector('.mapbox-directions-destination input').value = endText;
            }, 500); // Delay to ensure the input field is available
        })
        .catch(error => console.error('Error fetching end location:', error));
} else {
    alert('Start or End location is missing.');
}

// Function to add heatmap layer
function addHeatmapLayer(geojsonData) {
    if (map.getSource('heatmapData')) {
        map.getSource('heatmapData').setData(geojsonData);
    } else {
        map.addSource('heatmapData', {
            "type": "geojson",
            "data": geojsonData
        });

        map.addLayer({
            "id": "heatmapLayer",
            "type": "heatmap",
            "source": "heatmapData",
            "maxzoom": 22, // Increase max zoom to keep heatmap visible at higher zoom levels
            "paint": {
                // Increase the heatmap weight based on frequency and intensity
                "heatmap-weight": [
                    "interpolate",
                    ["linear"],
                    ["get", "value"],
                    0, 0,
                    50, 1
                ],
                // Increase the heatmap color weight by zoom level
                // heatmap-intensity is a multiplier on top of heatmap-weight
                "heatmap-intensity": [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    0, 1,
                    22, 5 // Increase intensity to make glow bigger
                ],
                // Color ramp for heatmap. Domain is 0 (low) to 1 (high).
                // Begin color ramp at 0-stop with a 0-transparency color
                // to create a blur-like effect.
                "heatmap-color": [
                    "interpolate",
                    ["linear"],
                    ["heatmap-density"],
                    0, "rgba(33,102,172,0)",
                    0.2, "rgb(103,169,207)",
                    0.4, "rgb(209,229,240)",
                    0.6, "rgb(253,219,199)",
                    0.8, "rgb(239,138,98)",
                    1, "rgb(178,24,43)"
                ],
                // Adjust the heatmap radius by zoom level
                "heatmap-radius": [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    0, 5,  // Increase radius to make glow bigger
                    22, 50 // Increase radius to make glow bigger
                ],
                // Transition from heatmap to circle layer by zoom level
                "heatmap-opacity": [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    7, 1,
                    22, 0.5
                ],
            }
        });
    }
}

// Function to create a buffer of 3 km around a line
function bufferLine(line, radius) {
    const buffer = turf.buffer(line, radius, { units: 'kilometers' });
    return buffer;
}

// Function to filter points within a buffer
function filterPointsWithinBuffer(points, buffer) {
    const filteredPoints = points.features.filter(feature => {
        return turf.booleanPointInPolygon(feature, buffer);
    });
    return {
        "type": "FeatureCollection",
        "features": filteredPoints
    };
}

// Listen to the route event to create heatmap around the route
directions.on('route', (e) => {
    const route = e.route[0].geometry;
    const line = turf.lineString(route.coordinates);
    const bufferedLine = bufferLine(line, 3); // Buffer of 3 km

    // Fetch the GeoJSON data from an external file
    fetch('data.geojson')
        .then(response => response.json())
        .then(data => {
            const filteredGeojsonData = filterPointsWithinBuffer(data, bufferedLine);
            // Add the heatmap layer with the filtered data
            addHeatmapLayer(filteredGeojsonData);
        })
        .catch(error => console.error('Error loading GeoJSON data:', error));
});

// Initial load of all heatmap points from external GeoJSON file
map.on('load', () => {
    fetch('data.geojson')
        .then(response => response.json())
        .then(data => {
            addHeatmapLayer(data);
        })
        .catch(error => console.error('Error loading GeoJSON data:', error));
});

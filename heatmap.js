mapboxgl.accessToken = 'pk.eyJ1IjoibGlwaW5sb28iLCJhIjoiY2x6ZTloaW1tMG9rcDJqcG51dG1sMG54ZSJ9.6fM3Sdeox5wE4I3Z8xsR6g'; // Replace with your Mapbox access token

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [144.9631, -37.8136], // Center on Melbourne
    zoom: 12 // Initial zoom level to show streets of Melbourne
});

map.on('load', () => {
    // Sample GeoJSON data for Melbourne
    const geojsonData = {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [144.9631, -37.8136]  // Melbourne CBD
                },
                "properties": {
                    "value": 100
                }
            },
            {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [144.9587, -37.8105]  // Near Melbourne Central
                },
                "properties": {
                    "value": 200
                }
            },
            {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [144.9668, -37.8183]  // Federation Square
                },
                "properties": {
                    "value": 150
                }
            },
            {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [144.9633, -37.8208]  // Flinders Street Station
                },
                "properties": {
                    "value": 250
                }
            },
            {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [144.9714, -37.8141]  // Parliament House
                },
                "properties": {
                    "value": 300
                }
            },
            {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [144.9613, -37.8079]  // Queen Victoria Market
                },
                "properties": {
                    "value": 200
                }
            },
            {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [144.9544, -37.8243]  // Crown Casino
                },
                "properties": {
                    "value": 100
                }
            },
            {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [144.9796, -37.8170]  // Fitzroy Gardens
                },
                "properties": {
                    "value": 50
                }
            }
        ]
    };

    // Add the source of the data
    map.addSource('heatmapData', {
        "type": "geojson",
        "data": geojsonData
    });

    // Add the heatmap layer
    map.addLayer({
        "id": "heatmapLayer",
        "type": "heatmap",
        "source": "heatmapData",
        "maxzoom": 15, // Increase max zoom to keep heatmap visible at higher zoom levels
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
                15, 3
            ],
            // Color ramp for heatmap. Domain is 0 (low) to 1 (high).
            // Begin color ramp at 0-stop with a 0-transparancy color
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
                0, 2,
                15, 20
            ],
            // Transition from heatmap to circle layer by zoom level
            "heatmap-opacity": [
                "interpolate",
                ["linear"],
                ["zoom"],
                7, 1,
                15, 0.5
            ],
        }
    });
});

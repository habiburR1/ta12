const map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/chitransh25/clzge9op400is01r10jl3dt8l' // replace this with your style URL
});

mapboxgl.accessToken = 'pk.eyJ1IjoiYWJiaXNoZWsiLCJhIjoiY2x6Y2trYzY5MGNucTJqcHFnMzVhNnhvcyJ9.ruwp1n7aBJwok0LXQyyRNQ ';

map.on('load', () => {
    const layers = [
        '0-10',
        '10-20',
        '20-50',
        '50-100',
        '100-200',
        '200-500',
        '500-1000',
        '1000+'
    ];
    const colors = [
        '#FFEDA0',
        '#FED976',
        '#FEB24C',
        '#FD8D3C',
        '#FC4E2A',
        '#E31A1C',
        '#BD0026',
        '#800026'
    ];
});


const legend = document.getElementById('legend');

layers.forEach((layer, i) => {
    const color = colors[i];
    const item = document.createElement('div');
    const key = document.createElement('span');
    key.className = 'legend-key';
    key.style.backgroundColor = color;

    const value = document.createElement('span');
    value.innerHTML = `${layer}`;
    item.appendChild(key);
    item.appendChild(value);
    legend.appendChild(item);
});

map.on('mousemove', (event) => {
    const states = map.queryRenderedFeatures(event.point, {
        layers: ['statedata']
    });
    document.getElementById('pd').innerHTML = states.length
        ? `<h3>${states[0].properties.name}</h3><p><strong><em>${states[0].properties.density}</strong> people per square mile</em></p>`
        : `<p>Hover over a state!</p>`;
});

map.getCanvas().style.cursor = 'default';

map.fitBounds([
    [-133.2421875, 16.972741],
    [-47.63671875, 52.696361]
]);
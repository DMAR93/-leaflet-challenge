// Initialize
const map = L.map('map').setView([37.7749, -122.4194], 5);

// Add a tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// URL
const url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

// Fetch te data
fetch(url)
    .then(response => response.json())
    .then(data => {
        createFeatures(data.features);
    });

function getColor(depth) {
    return depth > 90 ? '#d73027' :
           depth > 70 ? '#fc8d59' :
           depth > 50 ? '#fee08b' :
           depth > 30 ? '#d9ef8b' :
           depth > 10 ? '#91cf60' :
                        '#1a9850';
}

function getRadius(magnitude) {
    return magnitude * 4; 
}

function createFeatures(earthquakeData) {
    earthquakeData.forEach(feature => {
        const coords = [feature.geometry.coordinates[1], feature.geometry.coordinates[0]];
        const depth = feature.geometry.coordinates[2];
        const magnitude = feature.properties.mag;

        L.circleMarker(coords, {
            radius: getRadius(magnitude),
            fillColor: getColor(depth),
            color: "#000",
            weight: 0.5,
            fillOpacity: 0.7
        }).bindPopup(`
            <h3>${feature.properties.place}</h3>
            <hr>
            <p>Magnitude: ${magnitude}</p>
            <p>Depth: ${depth} km</p>
        `).addTo(map);
    });
}

const legend = L.control({ position: 'bottomright' });

legend.onAdd = function () {
    const div = L.DomUtil.create('div', 'legend');
    const depths = [-10, 10, 30, 50, 70, 90];
    const labels = [];

    div.innerHTML += '<h4>Depth (km)</h4>';
    depths.forEach((depth, index) => {
        div.innerHTML +=
            `<i style="background:${getColor(depth + 1)}"></i> ` +
            depth + (depths[index + 1] ? '&ndash;' + depths[index + 1] + '<br>' : '+');
    });
    return div;
};

legend.addTo(map);
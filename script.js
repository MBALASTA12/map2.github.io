// Initialize the map
const map = L.map('map', {
    zoomControl: false // Disable zoom control buttons
}).setView([13.41, 122.56], 6); // Centered over the Philippines

// Load OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

// Initialize the map
const map = L.map('map', {
    zoomControl: false // Disable zoom control buttons
}).setView([13.41, 122.56], 6); // Centered over the Philippines

// Load OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

// Create a marker for the user's location
let userMarker;

// Function to get the user's current GPS location
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

// Function to show the user's position on the map
function showPosition(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    // Move the map to the user's location
    map.setView([lat, lon], 15); // Zoom into the user's location

    // Add or update the user marker
    if (userMarker) {
        userMarker.setLatLng([lat, lon]);
    } else {
        userMarker = L.marker([lat, lon]).addTo(map)
            .bindPopup("You are here!").openPopup(); // Popup for user location
    }
}

// Function to handle geolocation errors
function showError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            alert("User denied the request for Geolocation.");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable.");
            break;
        case error.TIMEOUT:
            alert("The request to get user location timed out.");
            break;
        case error.UNKNOWN_ERROR:
            alert("An unknown error occurred.");
            break;
    }
}

// Add a GPS button to the map
const gpsButton = document.createElement('button');
gpsButton.innerHTML = "Get My Location";
gpsButton.id = "gps-button";
gpsButton.onclick = getLocation; // Set the button's click handler
document.body.appendChild(gpsButton);

// Address search functionality remains the same as before...
// (Include the previous address search code here)

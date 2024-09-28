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
const gpsButton = document.getElementById('gps-button');
gpsButton.onclick = getLocation; // Set the button's click handler

// Address search functionality
const searchInput = document.getElementById('search');

searchInput.addEventListener('input', function() {
    const query = this.value;

    if (query.length > 2) { // Trigger suggestions after 2 characters
        fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=5`)
            .then(response => response.json())
            .then(data => {
                // Clear previous suggestions
                clearSuggestions();

                // Display suggestions
                data.forEach(item => {
                    const suggestion = document.createElement('div');
                    suggestion.classList.add('suggestion');
                    suggestion.textContent = item.display_name;
                    suggestion.addEventListener('click', () => {
                        // When a suggestion is clicked, move the map to the location
                        map.setView([item.lat, item.lon], 15); // Zoom to the location
                        L.marker([item.lat, item.lon]).addTo(map); // Optionally add a marker
                        searchInput.value = item.display_name; // Set the input to the selected suggestion
                        clearSuggestions(); // Clear suggestions
                    });
                    document.body.appendChild(suggestion); // Append suggestions to the body
                });
            });
    } else {
        clearSuggestions(); // Clear suggestions if input is less than 2 characters
    }
});

// Function to clear suggestions
function clearSuggestions() {
    const suggestions = document.querySelectorAll('.suggestion');
    suggestions.forEach(suggestion => suggestion.remove());
}

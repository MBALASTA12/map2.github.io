// Initialize the map
const map = L.map('map', {
    zoomControl: false // Disable zoom control buttons
}).setView([13.41, 122.56], 6); // Centered over the Philippines

// Load OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

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

// Optional: Style suggestions in CSS
const style = document.createElement('style');
style.innerHTML = `
    .suggestion {
        position: absolute;
        background: white;
        border: 1px solid #ccc;
        padding: 10px;
        cursor: pointer;
        z-index: 1000; /* Ensure suggestions are on top */
        width: 80%; /* Match input width */
        max-width: 400px; /* Limit width */
        margin: 0 auto; /* Center suggestions */
        box-shadow: 0 2px 5px rgba(0,0,0,0.1); /* Shadow for depth */
    }
    .suggestion:hover {
        background-color: #f0f0f0; /* Highlight on hover */
    }
`;
document.head.appendChild(style);

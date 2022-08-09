const addressInput = document.getElementById('address');
const locationButton = document.getElementById('locate');

// A function that returns a promise with the user's geolocation
function getCoords() {
    return new Promise((resolve) =>
        navigator.geolocation.getCurrentPosition(resolve)
    );
}

const getAddress = async () => {
    // If geolocation permission is granted
    if (navigator.geolocation) {
        // Get user's geolocation and save coordinates in a LatLng object
        const geolocation = await getCoords();
        const location = {
            lat: geolocation.coords.latitude,
            lng: geolocation.coords.longitude,
        };
        // Initialize Google Geocoder
        const geocoder = new google.maps.Geocoder({ language: 'English' });
        // Reverse geocode user's coordinates
        const reverseGeocode = await geocoder.geocode({ location });
        if (reverseGeocode.results[0]) {
            // Set address field to the formatted address of the first result
            addressInput.value = reverseGeocode.results[0].formatted_address;
        }
    }
}

locationButton.addEventListener("click", getAddress);
const sortForm = document.getElementById('sort-by-distance');
const lngInput = document.getElementById('lng-input');
const latInput = document.getElementById('lat-input');

// A function that returns a promise with the user's geolocation
function getCoords() {
    return new Promise((resolve) =>
        navigator.geolocation.getCurrentPosition(resolve)
    );
}

// Event that fires when sort by distance form is submitted
sortForm.onsubmit = async function (event) {
    // Prevent form from being submitted
    event.preventDefault();
    // If browser supports geolocation
    if (navigator.geolocation) {
        // Try to access user's geolocation and set form fields to user's coordinates
        const geolocation = await getCoords();
        lngInput.value = geolocation.coords.longitude;
        latInput.value = geolocation.coords.latitude;
        // Submit form
        sortForm.submit()
    }
}
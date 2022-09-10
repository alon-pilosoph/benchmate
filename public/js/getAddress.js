const addressInput = document.getElementById("address");
const locationButton = document.getElementById("locate");

// Function that returns a promise with the user's geolocation
function getCoords() {
  return new Promise((resolve, reject) =>
    navigator.geolocation.getCurrentPosition(resolve, reject)
  );
}

const getAddress = async () => {
  // If browser supports geolocation
  if (navigator.geolocation) {
    // Try to access user's geolocation
    const geolocation = await getCoords();
    const location = {
      lat: geolocation.coords.latitude,
      lng: geolocation.coords.longitude,
    };
    // Initialize Google Geocoder
    const geocoder = new google.maps.Geocoder({ language: "English" });
    // Reverse geocode user's coordinates
    const reverseGeocode = await geocoder.geocode({ location });
    if (reverseGeocode.results[0]) {
      // Set address field to the formatted address of the first result
      addressInput.value = reverseGeocode.results[0].formatted_address;
    }
  }
};

locationButton.addEventListener("click", getAddress);

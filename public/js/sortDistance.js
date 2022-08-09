// Assign dropdown list to variable
const sortList = document.getElementById("sort-list");
// Assign list item to variable
const sortItem = document.getElementById('sort-item');
// Assign form input fields to variables
const lngInput = document.getElementById('lng-input');
const latInput = document.getElementById('lat-input');

window.addEventListener('load', (event) => {
    // Try to access geolocation when page loads
    if (navigator.geolocation) {
        // If geolocation was accessed successfully, update form fields with coordinates, otherwise remove list item
        navigator.geolocation.getCurrentPosition(
            (position) => {
                lngInput.value = position.coords.longitude;
                latInput.value = position.coords.latitude;
            }, () => sortList.removeChild(sortItem)
        );
    } else {
        // If browser doesn't support geolocation, remove list item
        sortList.removeChild(sortItem);
    }
});

navigator.permissions.query({ name: 'geolocation' }).then(function (permissionStatus) {
    // Fire event when geolocation permission changes
    permissionStatus.onchange = function () {
        // If geolocation permission was changed to granted
        if (this.state === 'granted') {
            // If geolocation was accessed successfully, update form fields with coordinates
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    lngInput.value = position.coords.longitude;
                    latInput.value = position.coords.latitude;
                    sortList.appendChild(sortItem);
                }
            );
        } else {
            // Otherwise, remove list item
            sortList.removeChild(sortItem);
        }
    };
});
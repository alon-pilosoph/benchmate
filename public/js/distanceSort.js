// Assign dropdown list to variable
const sortList = document.getElementById("sort-list");
// Create a new dropdown item
const sortItem = document.createElement('li');
// Create a new anchor tag
const sortLink = document.createElement('a');
sortLink.classList.add("dropdown-item");
sortLink.innerText = 'Closest to Me';
sortItem.appendChild(sortLink);

window.addEventListener('load', (event) => {
    // Try to access geolocation when page loads
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                // If geolocation was accessed successfully, add dropdown item and set anchor href to current location
                sortList.appendChild(sortItem);
                sortLink.href = `benches?sortby=distance&lng=${position.coords.longitude}&lat=${position.coords.latitude}`;
            }
        );
    }
});

navigator.permissions.query({ name: 'geolocation' }).then(function (permissionStatus) {
    // Fire event when geolocation permission changes
    permissionStatus.onchange = function () {
        // If geolocation permission was changed to granted
        if (this.state === 'granted') {
            // Add dropdown item and set anchor href to current location
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    sortLink.href = `benches?sortby=distance&lng=${position.coords.longitude}&lat=${position.coords.latitude}`;
                    sortList.appendChild(sortItem);
                }
            );
        } else {
            // Otherwise, remove dropdown item
            sortList.removeChild(sortItem);
        }
    };
});
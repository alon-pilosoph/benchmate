const mapStyle = [{
    "elementType": "geometry",
    "stylers": [{
        "color": "#ebe3cd"
    }]
},
{
    "elementType": "labels.text.fill",
    "stylers": [{
        "color": "#523735"
    }]
},
{
    "elementType": "labels.text.stroke",
    "stylers": [{
        "color": "#f5f1e6"
    }]
},
{
    "featureType": "administrative",
    "elementType": "geometry",
    "stylers": [{
        "visibility": "off"
    }]
},
{
    "featureType": "administrative",
    "elementType": "geometry.stroke",
    "stylers": [{
        "color": "#c9b2a6"
    }]
},
{
    "featureType": "administrative.land_parcel",
    "elementType": "geometry.stroke",
    "stylers": [{
        "color": "#dcd2be"
    }]
},
{
    "featureType": "administrative.land_parcel",
    "elementType": "labels.text.fill",
    "stylers": [{
        "color": "#ae9e90"
    }]
},
{
    "featureType": "landscape.natural",
    "elementType": "geometry",
    "stylers": [{
        "color": "#dfd2ae"
    }]
},
{
    "featureType": "poi",
    "stylers": [{
        "visibility": "off"
    }]
},
{
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [{
        "color": "#dfd2ae"
    }]
},
{
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [{
        "color": "#93817c"
    }]
},
{
    "featureType": "poi.park",
    "elementType": "geometry.fill",
    "stylers": [{
        "color": "#a5b076"
    }]
},
{
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [{
        "color": "#447530"
    }]
},
{
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [{
        "color": "#f5f1e6"
    }]
},
{
    "featureType": "road",
    "elementType": "labels.icon",
    "stylers": [{
        "visibility": "off"
    }]
},
{
    "featureType": "road.arterial",
    "elementType": "geometry",
    "stylers": [{
        "color": "#fdfcf8"
    }]
},
{
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [{
        "color": "#f8c967"
    }]
},
{
    "featureType": "road.highway",
    "elementType": "geometry.stroke",
    "stylers": [{
        "color": "#e9bc62"
    }]
},
{
    "featureType": "road.highway.controlled_access",
    "elementType": "geometry",
    "stylers": [{
        "color": "#e98d58"
    }]
},
{
    "featureType": "road.highway.controlled_access",
    "elementType": "geometry.stroke",
    "stylers": [{
        "color": "#db8555"
    }]
},
{
    "featureType": "road.local",
    "elementType": "labels.text.fill",
    "stylers": [{
        "color": "#806b63"
    }]
},
{
    "featureType": "transit",
    "stylers": [{
        "visibility": "off"
    }]
},
{
    "featureType": "transit.line",
    "elementType": "geometry",
    "stylers": [{
        "color": "#dfd2ae"
    }]
},
{
    "featureType": "transit.line",
    "elementType": "labels.text.fill",
    "stylers": [{
        "color": "#8f7d77"
    }]
},
{
    "featureType": "transit.line",
    "elementType": "labels.text.stroke",
    "stylers": [{
        "color": "#ebe3cd"
    }]
},
{
    "featureType": "transit.station",
    "elementType": "geometry",
    "stylers": [{
        "color": "#dfd2ae"
    }]
},
{
    "featureType": "water",
    "elementType": "geometry.fill",
    "stylers": [{
        "color": "#b9d3c2"
    }]
},
{
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [{
        "color": "#92998d"
    }]
}
]

function initMap() {
    // Set bench location
    const benchLocation = {
        lng: benchJson.location.coordinates[0],
        lat: benchJson.location.coordinates[1]
    };
    // Create new map
    const map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16,
        center: benchLocation,
        mapTypeControl: false,
        streetViewControl: false,
        scrollwheel: false,
        gestureHandling: 'cooperative',
        mapTypeId: 'mapStyle',

    });
    // Set map style
    map.mapTypes.set('mapStyle', new google.maps.StyledMapType(mapStyle));
    // Set marker image
    const image = {
        url: "https://res.cloudinary.com/dbx3a0ync/image/upload/v1659604618/Benchmate/bench_vmnvfa.png", // url
        scaledSize: new google.maps.Size(30, 30),
    };
    // Add bench marker to map
    const marker = new google.maps.Marker({
        position: benchLocation,
        map: map,
        icon: image,
        animation: google.maps.Animation.DROP,
        title: benchJson.address.replace(/(, Israel)/, '')
    });
}
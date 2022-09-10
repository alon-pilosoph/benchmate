const mapStyle = [
  {
    elementType: "geometry",
    stylers: [
      {
        color: "#ebe3cd",
      },
    ],
  },
  {
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#523735",
      },
    ],
  },
  {
    elementType: "labels.text.stroke",
    stylers: [
      {
        color: "#f5f1e6",
      },
    ],
  },
  {
    featureType: "administrative",
    elementType: "geometry",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "administrative",
    elementType: "geometry.stroke",
    stylers: [
      {
        color: "#c9b2a6",
      },
    ],
  },
  {
    featureType: "administrative.land_parcel",
    elementType: "geometry.stroke",
    stylers: [
      {
        color: "#dcd2be",
      },
    ],
  },
  {
    featureType: "administrative.land_parcel",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#ae9e90",
      },
    ],
  },
  {
    featureType: "landscape.natural",
    elementType: "geometry",
    stylers: [
      {
        color: "#dfd2ae",
      },
    ],
  },
  {
    featureType: "poi",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "poi",
    elementType: "geometry",
    stylers: [
      {
        color: "#dfd2ae",
      },
    ],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#93817c",
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "geometry.fill",
    stylers: [
      {
        color: "#a5b076",
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#447530",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [
      {
        color: "#f5f1e6",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "labels.icon",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "road.arterial",
    elementType: "geometry",
    stylers: [
      {
        color: "#fdfcf8",
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [
      {
        color: "#f8c967",
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [
      {
        color: "#e9bc62",
      },
    ],
  },
  {
    featureType: "road.highway.controlled_access",
    elementType: "geometry",
    stylers: [
      {
        color: "#e98d58",
      },
    ],
  },
  {
    featureType: "road.highway.controlled_access",
    elementType: "geometry.stroke",
    stylers: [
      {
        color: "#db8555",
      },
    ],
  },
  {
    featureType: "road.local",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#806b63",
      },
    ],
  },
  {
    featureType: "transit",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "transit.line",
    elementType: "geometry",
    stylers: [
      {
        color: "#dfd2ae",
      },
    ],
  },
  {
    featureType: "transit.line",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#8f7d77",
      },
    ],
  },
  {
    featureType: "transit.line",
    elementType: "labels.text.stroke",
    stylers: [
      {
        color: "#ebe3cd",
      },
    ],
  },
  {
    featureType: "transit.station",
    elementType: "geometry",
    stylers: [
      {
        color: "#dfd2ae",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "geometry.fill",
    stylers: [
      {
        color: "#b9d3c2",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#92998d",
      },
    ],
  },
];

let openInfo, geolocationMarker;

function initMap() {
  // Create new map
  const map = new google.maps.Map(document.getElementById("index-map"), {
    mapTypeControl: false,
    streetViewControl: false,
    scrollwheel: false,
    gestureHandling: "cooperative",
    mapTypeId: "mapStyle",
  });
  // Set map style
  map.mapTypes.set("mapStyle", new google.maps.StyledMapType(mapStyle));
  // Start with empty map bounds
  const bounds = new google.maps.LatLngBounds();
  // Set marker image
  const image = {
    url: "https://res.cloudinary.com/dbx3a0ync/image/upload/v1659604618/Benchmate/bench_vmnvfa.png",
    scaledSize: new google.maps.Size(30, 30),
  };
  // For each bench
  for (let bench of benchList) {
    // Add new marker
    let marker = new google.maps.Marker({
      position: {
        lng: bench.location.coordinates[0],
        lat: bench.location.coordinates[1],
      },
      map: map,
      icon: image,
      animation: google.maps.Animation.DROP,
      title: bench.address.replace(/(, Israel)/, ""),
    });

    // Extend map bounds to include new marker
    bounds.extend(marker.position);

    // Set info window of marker
    let rating = "<p>";
    if (bench.reviews.length === 0) {
      rating += '<span class="text-muted">No Reviews</span>';
    } else {
      rating += '<span class="stars">';
      if (bench.rating.average % 1 != 0) {
        const full = '<i class="fa-solid fa-star"></i>'.repeat(
          Math.floor(bench.rating.average)
        );
        const empty = '<i class="fa-regular fa-star"></i>'.repeat(
          Math.floor(5 - bench.rating.average)
        );
        rating += full + '<i class="fa-solid fa-star-half-stroke"></i>' + empty;
      } else {
        rating +=
          '<i class="fa-solid fa-star"></i>'.repeat(bench.rating.average) +
          '<i class="fa-regular fa-star"></i>'.repeat(5 - bench.rating.average);
      }
      rating += "</span>" + ` (${parseFloat(bench.rating.average.toFixed(2))})`;
    }
    rating += "</p>";

    const contentString =
      '<div class="mt-2 ms-2">' +
      `<p class="fs-6 mb-2">${bench.address.replace(/(, Israel)/, "")}</p>` +
      rating +
      `<a href="/benches/${bench._id}" class="link-success">More details</a>` +
      "</div>";

    const infoWindow = new google.maps.InfoWindow({
      content: contentString,
    });

    // When marker is clicked, open info window
    marker.addListener("click", () => {
      // Close previously open info window
      if (openInfo) {
        openInfo.close();
      }
      infoWindow.open({
        anchor: marker,
        map,
        shouldFocus: false,
      });
      openInfo = infoWindow;
    });
  }

  // Set map bounds
  map.fitBounds(bounds);

  // Add custom controller to locate user on map
  if (navigator.geolocation) {
    // Set custom map controller
    const controlDiv = document.createElement("div");
    const controlUI = document.createElement("div");
    controlUI.setAttribute("class", "controlUI");
    controlUI.title = "Click to find your location";
    controlDiv.appendChild(controlUI);
    const controlText = document.createElement("div");
    controlText.innerHTML = "My Location";
    controlText.setAttribute("class", "controlText");
    controlUI.appendChild(controlText);

    map.controls[google.maps.ControlPosition.TOP_LEFT].push(controlDiv);

    // When clicked, add a marker of user's current position and focus map
    controlUI.addEventListener("click", () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const pos = {
            lng: position.coords.longitude,
            lat: position.coords.latitude,
          };
          // If marker was set before, remove it before setting it again
          if (typeof geolocationMarker !== "undefined") {
            geolocationMarker.setMap(null);
          }
          let marker = new google.maps.Marker({
            position: {
              lng: pos.lng,
              lat: pos.lat,
            },
            title: "You are here",
            animation: google.maps.Animation.DROP,
            map: map,
          });
          // Extend map bounds to include new marker
          bounds.extend(marker.position);
          // Set map bounds
          map.fitBounds(bounds);
          // Close previously open info window
          if (openInfo) {
            openInfo.close();
          }
          geolocationMarker = marker;
        });
      }
    });
  }
}

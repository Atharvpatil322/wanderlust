// normally in coordinates = [latitude, longitude]
//  but in mapbox its opposite 
// process.env are not accessible here as this is a public file.

// Geocoding is the process of taking an address or name of a place and converting it into latitude and longitude values. 
// Forward geocoding converts text into geographic coordinates.
// Reverse geocoding converts geographic coordinates into a text description.



mapboxgl.accessToken = mapToken;
    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v9',
        zoom: 9,
        center: listing.geometry.coordinates
    });

// Create a new marker.
const marker = new mapboxgl.Marker({color : "red"})
    .setLngLat(listing.geometry.coordinates) //Listing.geometry.coordinates
    .setPopup(new mapboxgl.Popup({offset: 25})
    .setHTML(`<h4>${listing.title}</h4><p>Exact location will be provided after booking</p>`))
    .addTo(map);
    


  

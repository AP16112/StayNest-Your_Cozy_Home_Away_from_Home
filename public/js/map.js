// Here this is the script for initializing the map i.e the JS code required for mapbox maps to use here, it is available on the mapbox documentation 

// Now currently all the variables only have access to be used inside the ejs file , so we can't use 'process.env.MAP_TOKEN' here because it is only available in our server side code but not in client side code.
// so public folder JS files don't have access to the environment variables that we define in our server side code, so we can't use 'process.env.MAP_TOKEN' here because it is only available in our server side code but not in client side code.


mapboxgl.accessToken = mapToken;
// Now here we can easily use this mapToken variable in our map initialization code here because it's defined in the global scope, so we can use it anywhere in this file and also in any other JS file that we create in public/js folder because it's defined in the global scope, so we can use it anywhere in this file and also in any other JS file that we create in public/js folder.

const map = new mapboxgl.Map({     // Here this mapboxgl.Map fn is used to create or initialize the map 
    container: 'map', // container ID
    // Choose from Mapbox's core styles, or make your own style with mapbox Studio
    style: "mapbox://styles/mapbox/streets-v12", // style URL
    center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
    // Generally when we define any location in corrdinates , we define it as (latitude, longitude) but here in mapbox, we need to define it as (longitude, latitude) because mapbox uses the GeoJSON format for coordinates, which specifies them in the order of longitude first and then latitude. So here we need to set the longitude value first and then the latitude value in the center property of the map initialization code.
    zoom: 9, // starting zoom
});


// const element = document.createElement('div');
// element.innerHTML = '<i class="fa-solid fa-house fa-2x" style="color:red;"></i>';

// Now this map.js is public JS file, so we can't access the listing.geometry.coordinates directly here because this listing object is only available in our server side code but not in client side code, so we can't access the listing.geometry.coordinates directly here because this listing object is only available in our server side code but not in client side code.
// So we will access them in the same way as we access the mapToken variable here, so we will pass the listing.geometry.coordinates from the show.ejs file to this map.js file using a script tag in show.ejs file and then we can use that coordinates variable here in this map.js file to set the marker on the map for that listing, so that we can show the location of that listing on the map in the show page of that listing.

// Create a default Marker and add it to the map.
const defaultMarker = new mapboxgl.Marker({color: "red"})
    .setLngLat(listing.geometry.coordinates)           // here we wiil pass the listing.geometry.coordinates
    .setPopup( 
        new mapboxgl.Popup({offset: 25 }).setHTML(
            `<h4>${listing.title}</h4><p>Exact Location will be provided after booking</p>`
        )
    )
    .addTo(map);


// If we want we can also add multiple marker by just creating another markers as marker1, marker2, or etc but with some different coordinates, so that all markers do not overlap.


// Custom home icon marker (initially hidden)
const homeEl = document.createElement('div');
homeEl.innerHTML = '<i class="fa-solid fa-house fa-2x" style="color:red;"></i>';


const homeMarker = new mapboxgl.Marker(homeEl)
    .setLngLat(listing.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 }).setHTML(
        `<h4>${listing.title}</h4><p>Exact Location will be provided after booking</p>`
    )
);

// Get the DOM element of the default marker
const defaultEl = defaultMarker.getElement();

// On hover → hide default pin and show home icon
defaultEl.addEventListener('mouseenter', () => {
    defaultMarker.remove();
    homeMarker.addTo(map);
});

// On mouse leave → hide home icon and show default pin
homeEl.addEventListener('mouseleave', () => {
    homeMarker.remove();
    defaultMarker.addTo(map);
});


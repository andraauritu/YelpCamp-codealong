mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/satellite-streets-v12', // style URL
    //give example of coordinates
    center: campground.geometry.coordinates, // starting position [lng, lat]
    // center: [-74.5, 40], // starting position [lng, lat]    
    zoom: 8, // starting zoom
});


new mapboxgl.Marker()
    .setLngLat(campground.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(
                `<h3>${campground.title}</h3> <p>${campground.location}</p>`
            )
    )
    .addTo(map)
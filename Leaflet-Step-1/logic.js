// Store our API endpoint as queryUrl.
//var queryUrl = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2021-07-01&endtime=2021-08-01&maxlongitude=-69.52148437&minlongitude=-123.83789062&maxlatitude=48.74894534&minlatitude=25.16517337";
queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson"
// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
  // Once we get a response, send the data.features object to the createFeatures function.
  createFeatures(data.features);
});

var markerSize = 0.0;

//return color based on value
function getColor(x) {
  return x > 12 ? "#ea1212" :
    x > 10 ? "#f43302" :
      x > 8 ? "#f46402" :
        x > 6 ? "#f2ab23" :
          x > 4 ? "#c1f402" :
            x > 2 ? "#39e71e" :
              "#ceffa0";
}
function createFeatures(earthquakeData) {

  // style function
  function style(feature) {
    return {
      color: "black",
      fillColor: getColor(feature.geometry.coordinates[2]),
      fillOpacity: 0.85,
      opacity: 1,
      weight: 1,
      stroke: true,
      radius: +feature.properties.mag * 4.5
    };
  }
  // Create a GeoJSON layer that contains the features array on the earthquakeData object.
  var earthquakes = L.geoJson(earthquakeData, {

    pointToLayer: function (feature, latlng) {

      //console.log("markersize: "+markerSize);
      //return L.circleMarker(latlng,  geojsonMarkerOptions );
      return L.circleMarker(latlng, style(feature));
    },
    // Run the onEachFeature function once for each piece of data in the array.
    // Define a function that we want to run once for each feature in the features array.
    // Give each feature a popup that describes the place, magnitude, and time of the earthquake.
    onEachFeature: function (feature, layer) {
      layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><h4> Magnitude: ${feature.properties.mag}</h4><p>${new Date(feature.properties.time)}</p>`);
    }

  });

  // Send our earthquakes layer to the createMap function/
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Create the base layers.
  var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  // Create a baseMaps object.
  var baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
  };

  // Create an overlay object to hold our overlay.
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load.
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [street, earthquakes]
  });

  // Create a layer control.
  // Pass it our baseMaps and overlayMaps.
  // Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  function getColor(x) {
    return x > 12 ? "#ea1212" :
      x > 10 ? "#f43302" :
        x > 8 ? "#f46402" :
          x > 6 ? "#f2ab23" :
            x > 4 ? "#c1f402" :
              x > 2 ? "#39e71e" :
                "#ceffa0";
  }
//add legend
var legend = L.control({position: 'bottomright'});
legend.onAdd = function (map) {
  var div = L.DomUtil.create('div', 'info legend'),
      grades = [0, 2, 4, 6, 8, 10, 12],
      labels = [];

      div.innerHTML+='Depth<br><hr>'
  
      // loop through our density intervals and generate a label with a colored square for each interval
      for (var i = 0; i < grades.length; i++) {
          div.innerHTML +=
              '<i style="background:' + getColor(grades[i] + 1) + '">&nbsp&nbsp&nbsp</i> ' +
              grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
  }
  
  return div;
  };
  
  legend.addTo(myMap);

}

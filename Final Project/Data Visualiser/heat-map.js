///// START OF MY CODE /////

function HeatMap(lat, lng, zoom, data, year) {

    // Set coordinates of base map layer and zoom level
    this.latitude = lat;
    this.longitude = lng;
    this.zoom = zoom;
    this.data = data;
    this.year = year;
    
    // Creat a map div DOM element.
    this.mapDiv = createDiv();
    this.mapDiv.id('map');
    this.mapDiv.position(400, 80);
    
    // Create map tile layer from OpenStreetMap.
    // https://leafletjs.com/examples/quick-start/
    var baseLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    // Configuration Variable as dpecified in documentation
    var cfg = {
    // radius should be small ONLY if scaleRadius is true (or small radius is intended)
    // if scaleRadius is false it will be the constant radius used in pixels
    "radius": 0.7,
    "maxOpacity": .8,
    // scales the radius based on map zoom
    "scaleRadius": true,
    // if set to false the heatmap uses the global maximum for colorization
    // if activated: uses the data maximum within the current map boundaries
    "useLocalExtrema": false,
    // which field name represents the latitude, longitude, data
    latField: 'lat', 
    lngField: 'lng',
    valueField: 'value'
    };
    
    // Create and configure heat map layer
    var heatMapLayer = new HeatmapOverlay(cfg);
    
    // Update method to set new data
    this.updateData = function(newData, newYear) {
        // Update variables with new data
        this.data = newData;
        this.year = newYear;
    
        // Get necessary data
        var regions = this.data.getColumn('Region');
        var latitudes = this.data.getColumn('Latitude');
        var longitudes = this.data.getColumn('Longitude')
        var numSeizures = this.data.getColumn(this.year);

        // Convert string to numbers where necesssary
        latitudes = stringsToNumbers(latitudes);
        longitudes = stringsToNumbers(longitudes);
        numSeizures = stringsToNumbers(numSeizures);

        // Find max value
        var valueMax = max(numSeizures);

        // Initialize data in proper format
        var heatmapData = {
            max: valueMax,
            data: []
        };
    
        // Push all data points to array in correct format
        for(var i = 0; i < this.data.getRowCount(); i++){
            heatmapData.data.push({
                lat: latitudes[i],
                lng: longitudes[i],
                value: numSeizures[i]
            });
        }
    
        // Set data for heat map layer
        heatMapLayer.setData(heatmapData);
    };
    
    
    // Create map with base layer and heat map layer
    this.map = new L.Map('map', {
        center: new L.LatLng(this.latitude, this.longitude),
        zoom: this.zoom,
        layers: [baseLayer, heatMapLayer]
    });
    
    // Method to remove the map when another visual selected
    this.mapDestroy = function(){
        this.map.remove();
        this.mapDiv.remove();
    };
}

///// END OF MY CODE /////
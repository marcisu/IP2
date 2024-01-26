function SeizuresByArea() {

    // Name for the visualisation to appear in the menu bar.
    this.name = 'UK Seizures by Region';

    // Each visualisation must have a unique ID with no special
    // characters.
    this.id = 'seizures-by-region';

    // Property to represent whether data has been loaded.
    this.loaded = false;

    // Preload the data. This function is called automatically by the
    // gallery when a visualisation is added.
    this.preload = function() {
        var self = this;
        this.data = loadTable(
          './data/seizures/seizures-by-area-06-18.csv', 'csv', 'header',
          // Callback function to set the value
          // this.loaded to true.
          function(table) {
            self.loaded = true;
        });
    };
    
///// START OF MY CODE /////
    
    this.setup = function() {
        if (!this.loaded) {
            console.log('Data not yet loaded');
            return;
        }

        // Create a select DOM element.
        this.select = createSelect();
        this.select.position(400, 20);

        // Fill the options with all years names.
        var years = this.data.columns;
        
        // First entry is empty.
        for (var i = 3; i < years.length; i++) {
          this.select.option(years[i]);
        }
        
        // Load first option data as default
        this.selectedYear = this.select.value(years[3]);
           
        // Create new heat map with coordinates of UK and zoom 
        // Provide data in required format and year
        this.heatmap = new HeatMap(53.0, -3.3, 6, this.data, this.selectedYear); 
        
    };
    
    // Remove visual (select object and map object)
    this.destroy = function() {
        this.select.remove();
        this.heatmap.mapDestroy();

    };

    this.draw = function() {
        if (!this.loaded) {
            console.log('Data not yet loaded');
        return;
        }
        
        // Check if the selected year has changed
        var newSelectedYear = this.select.value();
        if (newSelectedYear != this.selectedYear) {
            // Update the heatmap data with the new selected year
            this.heatmap.updateData(this.data, newSelectedYear);
            this.selectedYear = newSelectedYear;
        }
        
        // Draw title with the selected year
        this.drawTitle(this.selectedYear);
     
    };
    
    // Method to draw title
    this.drawTitle = function(value) {
        fill(0);
        noStroke();
        textSize(22);
        textAlign(CENTER,CENTER);
        text(this.name + ": " + value, width/2, 20);
    };
}

///// END OF MY CODE /////

function AirQuality() {

    // Name for the visualisation for menu bar.
    this.name = 'Air Quality across G20 Countries';

    // Unique ID with no special characters.
    this.id = 'air-quality-g20';

    // Property to represent whether data has been loaded.
    this.loaded = false;

    // Preload the data.
    this.preload = function() {
    var self = this;
    this.data = loadTable(
        './data/air-quality/airQualityG20.csv', 'csv', 'header',
        // Callback function to set this.loaded to true.
        function(table) {
        self.loaded = true;
        });
    };

    this.setup = function() {
        // Check if data loaded
        if (!this.loaded) {
          console.log('Data not yet loaded');
          return;
        }

    // Create a select DOM element
    this.select = createSelect();
    this.select.position(400, 70);

    // Fill the options with various metrics of AQI
    var metrics = this.data.columns;
    
    // First entry is empty.
    for (let i = 1; i < metrics.length; i++) {
        this.select.option(metrics[i]);
        }
    };

    // Remove visual
    this.destroy = function() {
        this.select.remove();
    };

    // Create a new bar chart object
    this.bar = new BarChart(100, 450, 800, 200);

    this.draw = function() {
        if (!this.loaded) {
            console.log('Data not yet loaded');
            return;
        }
        // Get the value of the selected metric 
        var metricName = this.select.value();

        // Get the column of raw data for selected metric
        var col = this.data.getColumn(metricName);

        // Convert all data strings to numbers
        col = stringsToNumbers(col);

        // Copy the row labels from the table (the first item of each row).
        var labels = this.data.getColumn(0);
        
////// START OF MY CODE (ABOVE IS MODIFIED TECH DIV. RACE)//////
        
        // Create array of objects for colour-coded legend
        var legend = [];
        
        for (var i = 0; i < col.length; i++)
        {
            var cat = {};
            switch (true) {
                case (col[i] <= 50):
                    cat = {
                        "colour": '#00FF00',
                        "category": 'Good'
                    };
                    break;
                case (col[i] <= 100):
                    cat = {
                        "colour": '#FFFF00',
                        "category": 'Moderate'
                    };
                    break;
                case (col[i] <= 150):
                    cat = {
                        "colour": '#FF8000',
                        "category": 'Unhealthy for Sensitive Groups'
                    };
                    break;
                case (col[i] <= 200):
                    cat = {
                        "colour": '#FF0000',
                        "category": 'Unhealthy'
                    };
                    break;
                case (col[i] <= 300):
                    cat = {
                        "colour": '#660066',
                        "category": 'Very Unhealthy'
                    };
                    break;
                default:
                    cat = {
                        "colour": '#660033',
                        "category": 'Hazardous'
                    };
                    break;
            }
            legend.push(cat);
        }

        // Draw title
        var title = 'Air Quality Index in Nov 2022 by ' + metricName;

        // Draw the bar chart
        this.bar.draw(col, labels, legend, title);
    };
}

////// END OF MY CODE //////
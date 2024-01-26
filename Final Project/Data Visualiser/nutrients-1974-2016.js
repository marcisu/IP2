function NutrientsTimeSeries() {

    // Name for the visualisation to appear in the menu bar.
    this.name = 'Nutrients: 1974-2016';

    // Each visualisation must have a unique ID with no special
    // characters.
    this.id = 'nutrients-timeseries';

    ///// MAYBE GET RID OF TITLES, MAKE IT A HELPER FUNCTION, ALSWAY USE NAME RATHER THAN 2 FIELDS...???/////
    
    // Title to display above the plot.
    this.title = 'Nutrient Consumption as a Percentage of Requirements 1974-2016';

    // Names for each axis.
    this.xAxisLabel = 'Year';
    this.yAxisLabel = '%';

    var marginSize = 35;
    
    this.colours = [];
    this.stats = []; /// WHy do I have this initialized 2 times??? ////

    // Layout object to store all common plot layout parameters and
    // methods.
    this.layout = {
        marginSize: marginSize,

        // Locations of margin positions. Left and bottom have double margin
        // size due to axis and tick labels.
        leftMargin: marginSize * 2,
        rightMargin: width - marginSize,
        topMargin: marginSize,
        bottomMargin: height - marginSize * 2,
        pad: 5,

        plotWidth: function() {
          return this.rightMargin - this.leftMargin;
        },

        plotHeight: function() {
          return this.bottomMargin - this.topMargin;
        },

        // Boolean to enable/disable background grid.
        grid: true,

        // Number of axis tick labels to draw so that they are not drawn on
        // top of one another.
        numXTickLabels: 10,
        numYTickLabels: 8,
    };

    // Property to represent whether data has been loaded.
    this.loaded = false;

    // Preload the data. This function is called automatically by the
    // gallery when a visualisation is added.
    this.preload = function() {
        var self = this;
        this.data = loadTable(
        './data/food/nutrients74-16.csv', 'csv', 'header',
        // Callback function to set the value
        // this.loaded to true.
        function(table) {
            self.loaded = true;
        });
    };


    this.setup = function() {
        // Font default
        textSize(16);

        // Set min and max years: assumes data is sorted by date.
        this.startYear = Number(this.data.columns[1]);
        this.endYear = Number(this.data.columns[this.data.columns.length-1]);
        
///// START OF MY CODE /////
        
        var minVal = Infinity;
        var maxVal = 0;
        
        // Store row and column count for reuse
        this.rowCount = this.data.getRowCount();
        this.colCount = this.data.getColumnCount();

        for(var i = 0; i < this.rowCount; i++){
            // Set random colour for each row of data
            this.colours.push(color(random(0,255),random(0,255),random(0,255)));
            
            // Find min for mapping to canvas height
            for(var j = 1; j < this.colCount; j++)
            {
                var val = this.data.getNum(i, j);
                if(val < minVal)
                {
                    minVal = val;
                }
            }
            
            // Find max for mapping to canvas height
            for(var j = 1; j < this.colCount; j++)
            {
                var val = this.data.getNum(i, j);
                if(val > maxVal)
                {
                    maxVal = val;
                }
            }
        }
        
        // Store these Min and Max values for drawing graph
        this.minPercentage = minVal;     
        this.maxPercentage = maxVal;
        
        this.nutrients = [];
                
        // Get statistics for each row
        for (var i = 0; i < this.rowCount; i++) {
            var row = this.data.getRow(i);
            // Get nutrient name
            var l = row.getString(0);
            this.nutrients.push(l);
        }
    
        // Create a select DOM element.
        this.select = createSelect();
        this.select.position(1100,15);
    
        // Fill with options: First entry is empty.
        for (let i = 0; i < this.nutrients.length; i++)
        {
            this.select.option(this.nutrients[i]);
        }
            
        // Call to function that creates 2D array of stats
        this.getRowStats();
    };


    this.destroy = function() {
        this.select.remove();
    };
    
///// END OF MY CODE (CONTINUES BELOW)/////

    this.draw = function() {
        if (!this.loaded) {
            console.log('Data not yet loaded');
            return;
        }
        // Draw Title
        this.drawTitle();

        // Draw all y-axis labels.
        drawYAxisTickLabels(this.minPercentage,
                            this.maxPercentage,
                            this.layout,
                            this.mapPercentageToHeight.bind(this),
                            0);

        // Draw x and y axis.
        drawAxis(this.layout);

        // Draw x and y axis labels.
        drawAxisLabels(this.xAxisLabel,
                       this.yAxisLabel,
                       this.layout);

        // Plot all values between startYear and endYear using the width
        // of the canvas minus margins.
        var numYears = this.endYear - this.startYear;

        // Loop over all rows and draw a line from the previous value to
        // the current.
        for (var i = 0; i < this.rowCount; i++) {
            var row = this.data.getRow(i);
            var previous = null;

            var l = row.getString(0);

            for (var j = 1; j < numYears; j++)
            {
                // Create an object to store data for the current year.
                var current = {
                    // Convert strings to numbers.
                    'year': this.startYear + j - 1,
                    'percentage': row.getNum(j)
                };
                
                if (previous != null) {
                    // Draw line segment connecting previous year to current year.
                    stroke(this.colours[i]);
                    line(this.mapYearToWidth(previous.year),
                         this.mapPercentageToHeight(previous.percentage),
                         this.mapYearToWidth(current.year),
                         this.mapPercentageToHeight(current.percentage));

                    // The number of x-axis labels to skip so that only
                    // numXTickLabels are drawn.
                    var xLabelSkip = ceil(numYears / this.layout.numXTickLabels);

                    // Draw the tick label marking the start of the previous year.///// MODIFIED THIS CODE /////
                    if (j % xLabelSkip == 0 && (i % 2 == 0)) {
                      drawXAxisTickLabel(previous.year, this.layout,
                                         this.mapYearToWidth.bind(this));
                    }
                }
                else 
                {
                    noStroke();
                    fill(this.colours[i]);
                    text(l,105,this.mapPercentageToHeight(current.percentage));
                }
                // Assign current year to previous year so that it is available
                // during the next iteration of this loop to give us the start
                // position of the next line segment.
                previous = current;
            }
        }
        
        // Draw Stats box for the selected nutrient
        var nutrientName = this.select.value();
        this.drawStatsBox(nutrientName);
    };

    // Method to draw title
    this.drawTitle = function() {
        fill(0);
        noStroke();
        textAlign('center', 'center');

        text(this.title,
             (this.layout.plotWidth() / 2) + this.layout.leftMargin,
             this.layout.topMargin - (this.layout.marginSize / 2));
    };

    this.mapYearToWidth = function(value) {
        return map(value,
               this.startYear,
               this.endYear,
               this.layout.leftMargin,   // Draw left-to-right from margin.
               this.layout.rightMargin);
    };

    this.mapPercentageToHeight = function(value) {
        return map(value,
               this.minPercentage,
               this.maxPercentage,
               this.layout.bottomMargin, // Smaller value at bottom.
               this.layout.topMargin);   // Bigger value at top.
    };
    
///// START OF MY CODE /////
    
    // Create 2D array of Objects
    this.getRowStats = function(){
        this.stats = [];
        for (var i = 0; i < this.rowCount; i++) {
            var row = this.data.getRow(i);
            // Get nutrient name
            var l = row.getString(0);
            //Create an array of row values to calculate stats 
            // by passing these arrays to helper functions
            var rowArr = [];
            for (var j = 1; j < this.colCount; j++)
            {
                var val = row.getNum(j);
                rowArr.push(val);
            }
            //Creat an Array of objects for each row
            var rowStats = [];
            var rowAvg = {
                name: l,
                stat: "Average",
                value: getArrayAverage(rowArr)
                }
            var rowMed = {
                name: l,
                stat: "Median",
                value: getArrayMedian(rowArr)
                }
            var rowMax = {
                name: l,
                stat: "Max",
                value: max(rowArr)
                }
            var rowMin = {
                name: l,
                stat: "Min",
                value: min(rowArr)
                }
            rowStats.push(rowAvg);
            rowStats.push(rowMed);
            rowStats.push(rowMax);
            rowStats.push(rowMin);
            this.stats.push(rowStats);
        }
        return this.stats;
    }
    
    // Method to draw calculated statistics to the graph
    this.drawStatsBox = function(nutrient) {
        var boxX = 800;
        var boxY = 40;
        push();
        noStroke();
        rect(boxX, boxY, 160, 100);
        pop();
        // Cycle through all stats for selected nutrient
        for(var i = 0; i < this.stats.length; i++)
        {
            // Cycle through sub array to access properties
            for(var j = 0; j < this.stats[i].length; j++){
                if(this.stats[i][j].name == nutrient){
                    var boxY = 40 + j * 20;
                    push();
                    fill(255);
                    noStroke();
                    textAlign('left', 'center');
                    textSize(14);
                    text(this.stats[i][j].stat, boxX + 10, boxY + 20);
                    text(this.stats[i][j].value  + " %", boxX + 80, boxY + 20);
                    pop();
                }
            }
        }
    }
                
}

///// END OF MY CODE /////
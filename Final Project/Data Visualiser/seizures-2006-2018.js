///// CODE ADAPATED AND MODED FROM TECH DIVERSITY RACE CODE/////

function NumberOfSeizures() {

  // Name for the visualisation to appear in the menu bar.
  this.name = 'Seizures by Substance: 2006-2018';

  // Each visualisation must have a unique ID with no special
  // characters.
  this.id = 'seizures-by-substance';

  // Property to represent whether data has been loaded.
  this.loaded = false;

  // Preload the data. This function is called automatically by the
  // gallery when a visualisation is added.
  this.preload = function() {
    var self = this;
    this.data = loadTable(
      './data/seizures/seizures-uk-06-18.csv', 'csv', 'header',
      // Callback function to set the value
      // this.loaded to true.
      function(table) {
        self.loaded = true;
      });
  };

  this.setup = function() {
    if (!this.loaded) {
      console.log('Data not yet loaded');
      return;
    }

    // Create a select DOM element.
    this.select = createSelect();
    this.select.position(350, 40);

    // Fill the options with all substance names.
    var years = this.data.columns;
    // First entry is empty.
    for (var i = 1; i < years.length; i++) {
      this.select.option(years[i]);
    }
    
//      this.data.getRowCount()
    
      
    this.colours = [];
    for(var i = 0; i < 10; i++){
    // Colour to use for each category.
     this.colours.push(color(random(0,255),random(0,255),random(0,255)));
    }
  };

  this.destroy = function() {
    this.select.remove();
  };

  // Create a new pie chart object.
  this.pie = new PieChart(width / 2, height / 2, width * 0.4);

  this.draw = function() {
    if (!this.loaded) {
      console.log('Data not yet loaded');
      return;
    }

    // Get the value of the company we're interested in from the
    // select item.
    var selectedYear = this.select.value();

    // Get the column of raw data for years.
    var col = this.data.getColumn(selectedYear);

    // Convert all data strings to numbers.
    col = stringsToNumbers(col);

    // Copy the row labels from the table (the first item of each row).
    var labels = this.data.getColumn(0);
      
    // Sort the data in descending order.
    var sortedData = col.map(function(value, index) {
        return { value: value, label: labels[index] };
    }).sort(function(a, b) {
        return b.value - a.value;
    });

    // Take the top 10 values.
    var top10Data = sortedData.slice(0, 10);

    // Extract the values and labels from the top 10 data.
    var top10Values = top10Data.map(function(item) {
    return item.value;
    });
    var top10Labels = top10Data.map(function(item) {
    return item.label;
    });

    // Make a title.
    var title = "Top 10 Seizures by Substance: " + selectedYear;

    // Draw the pie chart!
    this.pie.draw(top10Values, top10Labels, this.colours, title);
  };
}

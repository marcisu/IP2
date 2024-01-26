// --------------------------------------------------------------------
// Data processing helper functions.
// --------------------------------------------------------------------
function sum(data) {
  var total = 0;

  // Ensure that data contains numbers and not strings.
  data = stringsToNumbers(data);

  for (let i = 0; i < data.length; i++) {
    total = total + data[i];
  }

  return total;
}

function mean(data) {
  var total = sum(data);

  return total / data.length;
}

function sliceRowNumbers (row, start=0, end) {
  var rowData = [];

  if (!end) {
    // Parse all values until the end of the row.
    end = row.arr.length;
  }

  for (i = start; i < end; i++) {
    rowData.push(row.getNum(i));
  }

  return rowData;
}

function stringsToNumbers (array) {
  return array.map(Number);
}

// --------------------------------------------------------------------
// Plotting helper functions
// --------------------------------------------------------------------

function drawAxis(layout, colour=0) {
  stroke(color(colour));

  // x-axis
  line(layout.leftMargin,
       layout.bottomMargin,
       layout.rightMargin,
       layout.bottomMargin);

  // y-axis
  line(layout.leftMargin,
       layout.topMargin,
       layout.leftMargin,
       layout.bottomMargin);
}

function drawAxisLabels(xLabel, yLabel, layout) {
  fill(0);
  noStroke();
  textAlign('center', 'center');

  // Draw x-axis label.
  text(xLabel,
       (layout.plotWidth() / 2) + layout.leftMargin,
       layout.bottomMargin + (layout.marginSize * 1.5));

  // Draw y-axis label.
  push();
  translate(layout.leftMargin - (layout.marginSize * 1.5),
            layout.bottomMargin / 2);
  rotate(- PI / 2);
  text(yLabel, 0, 0);
  pop();
}

function drawYAxisTickLabels(min, max, layout, mapFunction,
                             decimalPlaces) {
  // Map function must be passed with .bind(this).
  var range = max - min;
  var yTickStep = range / layout.numYTickLabels;

  fill(0);
  noStroke();
  textAlign('right', 'center');

  // Draw all axis tick labels and grid lines.
  for (i = 0; i <= layout.numYTickLabels; i++) {
    var value = min + (i * yTickStep);
    var y = mapFunction(value);

    // Add tick label.
    text(value.toFixed(decimalPlaces),
         layout.leftMargin - layout.pad,
         y);

    if (layout.grid) {
      // Add grid line.
      stroke(200);
      line(layout.leftMargin, y, layout.rightMargin, y);
    }
  }
}

function drawXAxisTickLabel(value, layout, mapFunction) {
  // Map function must be passed with .bind(this).
  var x = mapFunction(value);

  fill(0);
  noStroke();
  textAlign('center', 'center');

  // Add tick label.
  text(value,
       x,
       layout.bottomMargin + layout.marginSize / 2);

  if (layout.grid) {
    // Add grid line.
    stroke(220);
    line(x,
         layout.topMargin,
         x,
         layout.bottomMargin);
  }
}



// function to generate Random ID
function getRandomID(){
    var alpha = "abcdefghijklmnopqrstuvwxyz0123456789";
    var s = "";
    for(var i = 0; i < 10;i++){
        s += alpha[floor(random(0, alpha.length))];
    }
    
    return s;
}

///// START OF MY CODE /////

// This function calculates the the average of an array fo numbers to 2 decimal points.
function getArrayAverage(arr){
    var sum = 0;
    for(var i = 0; i < arr.length; i++){
        sum += arr[i];
    }
    var avg = (sum/arr.length).toFixed(2);
    return avg;
}


// This function uses an algortihm to calculate the median of an array of numbers
function getArrayMedian(arr){
    // Check if arr is an array
    if (!Array.isArray(arr)) {
        console.error("Error: Input is not an array.");
        return undefined; // or handle the error in an appropriate way
    }
    
    // Using this comparator function, we can assure expected result
    arr.sort((a, b) => a - b);
    var middleIndex = Math.floor(arr.length / 2);

    // Check if array is of even length, return average of 2 middle elements
    if (arr.length % 2 == 0){
        return (arr[middleIndex - 1] + arr[middleIndex]) / 2;
    }
    // Else return the middle item
    else{
        return arr[middleIndex];
    }
}

///// END OF MY CODE /////


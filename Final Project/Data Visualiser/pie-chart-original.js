function PieChart(x, y, diameter) {

    this.x = x;
    this.y = y;
    this.diameter = diameter;
    this.labelSpace = 25;
    
    this.get_values = function(data) {
        var values = [];

        for (let i = 0; i < data.length; i++) {
            var value = (data[i]);
            values.push(value);
        }

        return values;
      };

    this.get_proportions = function(data) {
        var total = sum(data);
        var proportions = [];

        for (let i = 0; i < data.length; i++) {
            var proportion = (data[i] / total);
            proportions.push(proportion);
        }

        return proportions;
      };

    this.get_radians = function(proportions) {
        var radians = [];

        for (let i = 0; i < proportions.length; i++) {
            radians.push(proportions[i] * TWO_PI);
        }

        return radians;
    };
    

    this.draw = function(data, labels, colours, title) {

        // Test that data is not empty and that each input array is the
        // same length.
        if (data.length == 0) {
          alert('Data has length zero!');
        } else if (![labels, colours].every((array) => {
          return array.length == data.length;
        })) {
          alert(`Data (length: ${data.length})
        Labels (length: ${labels.length})
        Colours (length: ${colours.length})
        Arrays must be the same length!`);
        }

        // https://p5js.org/examples/form-pie-chart.html

        var angles = this.get_radians(this.get_proportions(data));
        var lastAngle = 0;
        var colour;

        for (var i = 0; i < data.length; i++) {
            if (colours) {
                colour = colours[i];
            } else {
                colour = map(i, 0, data.length, 0, 255);
            }

            fill(colour);
            stroke(0);
            strokeWeight(1);

            arc(this.x, this.y, this.diameter, this.diameter, lastAngle, lastAngle + angles[i] + 0.001); // Hack for 0!
            

            if (labels) {
                this.makeLegendItem(labels[i], i, colour, angles[i]);
            }

            lastAngle += angles[i];
        }

        if (title) {
            noStroke();
            textAlign('center', 'center');
            textSize(22);
            text(title, this.x, this.y - this.diameter * 0.6);
        }
    };

    this.makeLegendItem = function(label, i, colour, angle) {
        var x = this.x + 50 + this.diameter / 2;
        var y = this.y + (this.labelSpace * i) - this.diameter / 2;
        var boxWidth = this.labelSpace / 2;
        var boxHeight = this.labelSpace / 2;

        fill(colour);
        rect(x, y, boxWidth, boxHeight);

        fill('black');
        noStroke();
        textAlign('left', 'center');
        textSize(12);
        text(label, x + boxWidth + 10, y + boxWidth / 2);
    };
}

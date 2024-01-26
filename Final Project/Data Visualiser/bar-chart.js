///// START OF MY CODE /////

function BarChart(x, y, w, h) {

    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;

    this.draw = function(data, labels, legend, title) {

    // Check that data is not empty
        if (data.length == 0) {
            alert('Data has length zero!');
        }

        var barWidth = this.width / data.length;
        var colour;
        var category;
        var uniqueCategories = [];
        var count = 0;

        for (var i = 0; i < data.length; i++) {
            var maxData = max(data);
            var barHeight = map(data[i], 0, maxData, 0, this.height);
            var xPos = this.x + i * barWidth;
            var yPos = this.y - barHeight;

            // Get correct bar colour
            if (legend[i].colour) {
                colour = legend[i].colour;
            } else {
                colour = '#FFFFFF';
            }

            push();
            fill(colour);
            stroke(0);
            strokeWeight(1);
            
            // Draw bars
            rect(xPos, yPos, barWidth, barHeight);
            
            // Display data value on top of the bar
            textSize(14);
            fill(0);
            textAlign(CENTER);
            text(data[i], xPos + barWidth / 2, yPos - 20);

            // Display Labels diagonally with origin to the center of the label
            translate(xPos + barWidth / 2, this.y + 15);
            // Rotate by 45 degrees
            rotate(radians(45));
            textAlign(LEFT);
            // Draw the label
            text(labels[i], 0, 0);
            pop();
            
            // Check to see if legend item already exists, only add new items to the legend
            if (legend[i].category) {
                category = legend[i].category;
                if(!uniqueCategories.includes(category))
                    {
                        uniqueCategories.push(category);
                        count++;
                        this.makeLegendItem(category, count, colour); 
                    }
            }
        }
        // Get the title and draw it
        if (title) {
            noStroke();
            textAlign('center','center');
            textSize(22);
            text(title, this.x + this.width/2, 30);
        }
        
        // MAYBE TAKE THIS OUT OF DRAW FUNCTION TO MAKE MORE EFFICIENT
        // CALL INDEPENDANT FUNCTION IN SETUP MAYBE?? ********
        // magari non è possibile. Occorre sempre controllare l'opzione selezionata, c'è possibilità (devi guardare a heatmao.js)
        
        
        // Calculate average for each metric selected
        var average = Math.round(getArrayAverage(data)*100)/100;
        // Set height of average line and Draw it
        var avgHeight = map(average, 0, maxData, 0, this.height);
        
        push();
        stroke(100);
        line(this.x, this.y - avgHeight, this.x + this.width, this.y - avgHeight);
        textSize(14);
        fill(100);
        text("Avg:", this.x - 30, this.y - avgHeight);
        text(average, this.x - 30, this.y - avgHeight + 20);
        pop();
    };

    // Method to draw unique colour coded legend item
    this.makeLegendItem = function(category, pos, colour) {
        var legendX = this.width - this.x;
        var legendY = 40 + pos * 20;

        fill(colour);
        rect(legendX, legendY, 15, 15);

        fill(0);
        noStroke();
        textAlign('left', 'center');
        textSize(12);
        text(category, legendX + 20, legendY + 8);
    };
}

///// END OF MY CODE /////

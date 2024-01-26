function PayGapByJob2017() {

    // Name for the visualisation to appear in the menu bar.
    this.name = 'Pay gap by Occupation: 2017';

    // Each visualisation must have a unique ID with no special
    // characters.
    this.id = 'pay-gap-by-job-2017';

    // Property to represent whether data has been loaded.
    this.loaded = false;

    // Graph properties.
    this.pad = 50;
    this.dotSizeMin = 15;
    this.dotSizeMax = 40;

    // Preload the data. This function is called automatically by the
    // gallery when a visualisation is added.
    this.preload = function() {
        var self = this;
        this.data = loadTable(
        './data/pay-gap/occupation-hourly-pay-by-gender-2017.csv', 'csv', 'header',
        // Callback function to set the value
        // this.loaded to true.
        function(table) {
        self.loaded = true;
        });

    };
    
///// START OF MY CODE /////

    this.setup = function() {
        
        // (Adapted from original code)
        // Get necessary data from the table object.
        this.jobs = this.data.getColumn('job_subtype');
        this.propFemale = this.data.getColumn('proportion_female');
        this.payGap = this.data.getColumn('pay_gap');
        this.numJobs = this.data.getColumn('num_jobs');

        // (Adapted from original code)
        // Convert numerical data from strings to numbers.
        this.propFemale = stringsToNumbers(this.propFemale);
        this.payGap = stringsToNumbers(this.payGap);
        this.numJobs = stringsToNumbers(this.numJobs);
        
        // (Adapted from original code)
        // Set ranges for axes.
        // Use full 100% for x-axis (proportion of women in roles).
        var propFemaleMin = 0;
        var propFemaleMax = 100;

        // (Adapted from original code)
        // For y-axis (pay gap) use a symmetrical axis equal to the
        // largest gap direction so that equal pay (0% pay gap) is in the
        // centre of the canvas. Above the line means men are paid
        // more. Below the line means women are paid more.
        var payGapMin = -20;
        var payGapMax = 20;

        // Find smallest and largest numbers of people across all
        // categories to scale the size of the dots.
        var numJobsMin = min(this.numJobs);
        var numJobsMax = max(this.numJobs);
        
        // Create array of ellipses to store objects for each data point
        this.ellipses = [];
        
        for (i = 0; i < this.data.getRowCount(); i++) {
            // map X, Y and Size to proper proportions
            var ellipseX = map(this.propFemale[i], propFemaleMin, propFemaleMax, this.pad, width - this.pad);
            var ellipseY = map(this.payGap[i], payGapMin, payGapMax, height - this.pad, this.pad);
            var ellipseSize = map(this.numJobs[i], numJobsMin, numJobsMax,this.dotSizeMin, this.dotSizeMax);
            
            // Use conditionals to define colour and store in data point object
            var ellipseColour;
            // Get colour based on pay gap size
            if (abs(this.payGap[i]) < 5) {
                ellipseColour = "Green"; // Green for less than 5 Percent
            } else if (abs(this.payGap[i]) < 10) {
                ellipseColour = "Yellow"; // Yellow for less than 10 percent
            } else {
                ellipseColour = "Red"; // Red for greater than 10%
            }
            this.ellipses.push(
                {
                    x: ellipseX,
                    y: ellipseY,
                    size: ellipseSize,
                    colour: ellipseColour
                }
            );
        }
    };
    
///// END OF MY CODE (Continues below)/////

    
///// MODIFIED CODE BELOW /////
    
    this.draw = function() {
        if (!this.loaded) {
            console.log('Data not yet loaded');
            return;
        }

        // Draw the axes.
        this.addAxes();
        
///// START OF MY CODE /////
        
        // Draw title
        this.drawTitle();

        stroke(0);
        strokeWeight(1);

        // Draw ellipses using object properties
        for (i = 0; i < this.ellipses.length; i++) {
            // Draw an ellipse for each point.
            // x = propFemale
            // y = payGap
            // size = numJobs
            fill(this.ellipses[i].colour);
            ellipse(this.ellipses[i].x, this.ellipses[i].y, this.ellipses[i].size);
        }
        
        // Print data when hovering over ellipse
        for (i = 0; i < this.ellipses.length; i++) {
            // Check if mouseOver using method below
            var mouseOver = this.mouseOver(mouseX, mouseY, this.ellipses[i].x, this.ellipses[i].y, this.ellipses[i].size);
            if(mouseOver != false){
                // Draw Name of Job, Prop. Female, and Pay gap when hovering
                push();
                fill(0);
                textSize(15);
                var tWidth = textWidth(this.jobs[i]);
                textAlign(LEFT, TOP);
                rect(mouseX - 80, mouseY, tWidth + 30, 75);
                fill(255);
                text(this.jobs[i], mouseX - 70, mouseY + 10);
                text("Pay Gap: " + this.payGap[i].toFixed(2) + " %", mouseX - 70, mouseY + 30);
                text("Prop. Female: " + this.propFemale[i].toFixed(2) + " %", mouseX - 70, mouseY + 50);
                pop();
                break;
            }
        }
    };
    
///// END OF MY CODE (CONTINUES BELOW)/////

    this.addAxes = function () {
        stroke(200);

        // Add vertical line.
        line(width / 2,
             0 + this.pad,
             width / 2,
             height - this.pad);

        // Add horizontal line.
        line(0 + this.pad,
             height / 2,
             width - this.pad,
             height / 2);
        
///// START OF MY CODE /////

        // Add Axis titles and subtitles
        push();
        fill(0);
        textSize(13);
        textAlign(LEFT);
        text("Wage Disparity", this.pad, height/2 - 8);
        rotate(-PI/2);
        text("Proportion Male to Female", -height + this.pad, width/2 - 8);
        
        // Subtitles
        textAlign(CENTER,CENTER);
        fill(150);
        textSize(20);
        
        // Y Axis subtitle
        text("Higher Wages for Males", -160, width - this.pad);
        text("Higher Wages for Females", -430, width - this.pad);
        rotate(PI/2);
        
        // X Axis subtitle
        text("Male Dominated", width/4, height - 12);
        text("Female Dominated", width*3/4, height - 12);
        pop();
    };
    
    // Method to draw title
    this.drawTitle = function() {
        fill(0);
        noStroke();
        textSize(22);
        textAlign(CENTER,CENTER);
        text(this.name,width/2, 20);
    };
    
    // Method to check mouse over
    this.mouseOver = function(mouseX, mouseY, x, y, size){
        if(mouseX > x - size/2 && mouseX < x + size/2 && mouseY > y - size/2 && mouseY < y + size/2)
        {
            return true;
        }
        return false;
    }
};

///// END OF MY CODE /////
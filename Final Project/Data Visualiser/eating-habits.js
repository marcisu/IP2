function EatingHabits() {
    
    // Name for the visualisation to appear in the menu bar.
    this.name = 'Eating Habits Survey';

    // Each visualisation must have a unique ID with no special
    // characters.
    this.id = 'eating-habits';

    // Property to represent whether data has been loaded.
    this.loaded = false;

    // Preload the data. This function is called automatically by the
    // gallery when a visualisation is added.
  this.preload = function() {
    var self = this;
    this.data = loadTable(
      './data/food/finalData.csv', 'csv', 'header',
      // Callback function to set the value
      // this.loaded to true.
      function(table) {
        self.loaded = true;
      });
    
  };

    this.setup = function() {
        if (!this.loaded){
            console.log('Data not yet loaded');
            return;
        }
        
        this.waffles = [];
        
        // Fill with days
        this.days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",
		"Sunday"];
        
        // Fill the values
        this.values = ['Take-away', 'Cooked from fresh', 'Ready meal', 'Ate out',
		'Skipped meal', 'Left overs'];
        
        // fill waffles array with waffles
        
        for(var i = 0; i < this.days.length; i++){
            if(i < 4){
                this.waffles.push(new Waffle(100 + (i*220), 90, 200, 200, 10, 10, this.data, this.days[i], this.values, this.days[i]));
            } else {
                this.waffles.push(new Waffle(100 + ((i-4)*220), 330, 200, 200, 10, 10, this.data, this.days[i], this.values, this.days[i]));
            }
        }
    };

    this.destroy = function() {
    };

    this.draw = function() {
      

        // Draw a title
        this.drawTitle();
        
        // Draw the Waffles
        for(var i = 0; i < this.waffles.length; i++){
            this.waffles[i].draw();
        }
        
        for(var i = 0; i < this.waffles.length; i++){
            this.waffles[i].checkMouse(mouseX, mouseY);
        }
    };
    
    this.drawTitle = function() {
        fill(0);
        noStroke();
        textSize(22);
        textAlign(CENTER,CENTER);
        text(this.name,width/2, 20);
    };
    
}

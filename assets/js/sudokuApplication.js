
// Selectors
var BOARD_SEL = "#sudoku-board";
var MESSAGE_SEL = "#message";
var CHECK_SOLUTION = "#check-solution";


var boards = {
    "medium": null,
};

/*Construct the sudoku board*/
var buildBoard = function () {
  
    for(var r = 0; r < 9; ++r){
        var $row = $("<tr/>", {});
        for(var c = 0; c < 9; ++c){
            var $square = $("<td/>", {});
            if(c % 3 == 2 && c != 8){
                $square.addClass("border-right");
            }
            $square.append(
                $("<input/>", {
                    id: "row" + r + "-col" + c,
                    class: "square",
                    maxlength: "9",
                    type: "text"
                })
            );
            $row.append($square);
        }
        if(r % 3 == 2 && r != 8){
            $row.addClass("border-bottom");
        }
        $(BOARD_SEL).append($row);
    }
};


/*Initialize the sudoku board depending on text size and display the board*/
var initializeBoard = function(){
   
    $(BOARD_SEL + " input.square").change(function(){
        
        var $square = $(this);
        var nr_digits = $square.val().length;
        var font_size = "40px";
        if(nr_digits === 3){
            font_size = "35px";
        } else if(nr_digits === 4){
            font_size = "25px";
        } else if(nr_digits === 5){
            font_size = "20px";
        } else if(nr_digits === 6){
            font_size = "17px";
        } else if(nr_digits === 7){
            font_size = "14px";
        } else if(nr_digits === 8){
            font_size = "13px";
        } else if(nr_digits >= 9){
            font_size = "11px";
        }
        $(this).css("font-size", font_size);
    });
    $(BOARD_SEL + " input.square").keyup(function(){
        $(this).change();
    });
  
    generatePuzzle("medium");
	
};



 /*Gets called when check button is clicked */   
$(CHECK_SOLUTION + " #check-board").click(function(e){
        /*Get board values entered by user*/
        e.preventDefault();
        getBoardValues();
});



/*Initialize the message bar*/
var initializeMessage = function(){
    //Initially hide it 
    $(MESSAGE_SEL).hide();
}


/*Get the board values entered by user*/
var getBoardValues = function(){
	var sudokuData =[];
	    for(var r = 0; r < 9; ++r){
			sudokuData[r] = [];
        for(var c = 0; c < 9; ++c){
            var $square = $(BOARD_SEL + " input#row" + r + "-col" + c);
				sudokuData[r][c] = $square.val();
        }
    }
	
	checkValidity.init(sudokuData).isValid();
	
}

/*Check if the solution is valid solution or not*/
var checkValidity = (function () {
	var rows, cols, grid;

    // initialize with input data
    init = function(data){
        reorganizeData(data);
        return this;
    };
	
    // return true if sudoku solution is valid
    isValid = function(){
		var valid = validate(rows) && validate(cols) && validate(grid);
		if (valid){
			$(MESSAGE_SEL + " #text").html("<strong>Sudoku Solution is Valid Congrats!!!</strong> ");
            $(MESSAGE_SEL).show();
		}
		else{
			$(MESSAGE_SEL + " #text").html("<strong>Sudoku Solution is Invalid!!!</strong> ");
            $(MESSAGE_SEL).show();
		}
        return (valid);
    };

    // validate rows 
    validate = function(data){

        for (var row = 0; row < 9; row++) {

            data[row].sort();
            
            for (var col = 0; col < 9; col++) {

                var value = data[row][col], next_value = data[row][col + 1];

                // check if value is a valid number
                if (!(value && value > 0 && value < 10)){
                    return false;
                }

                // check if numbers are unique
                if (col !== 8 && value === next_value){
                    return false;
                }

            }
        }
        return true;
    };

    //reorganize data into three structures
    reorganizeData = function(data){
        rows = data;
        cols = [];
        grid = [];

        //filling the structures with empty array objects
        for (var i = 0; i < 9; i++) {
            cols.push([]);
            grid.push([]);
        }
        
        for (var row = 0; row < 9; row++) {

            for (var col = 0; col < 9; col++) {

                // Save each of the column in a new row
                cols[col][row] = data[row][col];

                // Calculate all grid identifiers
                gridRow = Math.floor( row / 3 );
                gridCol = Math.floor( col / 3 );
                gridIndex = gridRow * 3 + gridCol;

                // Save each of the grid in a new row
                grid[gridIndex].push(data[row][col]);
                
            }
        }

    };
 
    // make below functions public
    return {
        init: init,
        isValid: isValid
    };
})();


var generatePuzzle = function(puzzle){
    
    if(boards[puzzle] === null){
            boards[puzzle] = sudoku.board_string_to_grid(sudoku.generate(puzzle));
        }
    
    
    // Display the puzzle
    displayPuzzle(boards[puzzle]);
}

/*Display the puzzle*/
var displayPuzzle = function(board){
    for(var r = 0; r < 9; ++r){
        for(var c = 0; c < 9; ++c){
            var $square = $(BOARD_SEL + " input#row" + r + "-col" + c);
            $square.removeClass("green-text");
            if(board[r][c] != sudoku.BLANK_CHAR){
                var board_val = board[r][c];
                var square_val = $square.val();
                $square.val(board_val);
				$square.attr("disabled", "disabled");
            } else {
                $square.val('');
            }
            // Fire off a change event on the square
            $square.change();
        }
    }
	
	
};


// "Main" (function gets called when document id ready)
$(function(){
    buildBoard();
    initializeBoard();
	initializeMessage();
    
    // Initialize tooltips
    $("[rel='tooltip']").tooltip();
    
    
    // Hide the loading screen, show the app
    $("#app-wrap").removeClass("hidden");
    $("#loading").addClass("hidden");
});
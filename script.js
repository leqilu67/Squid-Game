var gameContainer = document.getElementById("gameContainer");

function setup(){
	
	// 7x7 grid setup
	for (var i  = 0; i < 7; i++){
		var gridContainer = document.createElement("div");
		gridContainer.setAttribute("class", "container");
		gameContainer.appendChild(gridContainer);
		for (var j = 0; j < 7; j++){
			var grid = document.createElement("div");
			grid.setAttribute("id", "button" + j + i);
			grid.setAttribute("class", "button");
			grid.row = i; 
			grid.col = j;
			grid.occupied = 0;
			grid.addEventListener("click", buttonClicked);
			gridContainer.appendChild(grid);
		}
	}
	
	// squid setup
	for (var i = 0; i < 3; i++){
		var squid = new Object();
		// direction of squid: 0 = horizontal, 1 = vertical
		squid.direction = getRandomInt(0, 1);
		squid.length = i + 2;
		
		decideLocation(squid);
	}
}

function decideLocation(squid){
	if (squid.direction == 0){ //horizontal
		squid.x = getRandomInt(0, 6 - squid.length);
		squid.y = getRandomInt(0, 6);
		
		var gridArray = [];
		for (var i = 0; i < squid.length; i++){
			var grid = document.getElementById("button" + (squid.x + i) + squid.y);
			gridArray.push(grid);
		}
			
		if (conflict(gridArray)){
			gridArray = [];
			decideLocation(squid);
		} else {
			for (var i = 0; i < gridArray.length; i++){
				gridArray[i].occupied = 1;
				gridArray[i].style.backgroundColor = "yellow";
			}
		}
		
	} else { //vertical	
		squid.x = getRandomInt(0, 6);
		squid.y = getRandomInt(0, 6 - squid.length);
		
		var gridArray = [];
		for (var i = 0; i < squid.length; i++){
			var grid = document.getElementById("button" + squid.x + (squid.y + i));
			gridArray.push(grid);
		}
		
		if (conflict(gridArray)){
			gridArray = [];
			decideLocation(squid);
		} else {
			for (var i = 0; i < gridArray.length; i++){
				gridArray[i].occupied = 1;
				gridArray[i].style.backgroundColor = "yellow";
			}
		}
	}	
}

function conflict(gridArray){
	for (var i = 0; i < gridArray.length; i++){
		if (gridArray[i].occupied)
			return true;
	}
	
	return false;
}

function buttonClicked(e){
	var t = e.target;
	console.log(t.row, t.col);
}

function getRandomInt(min, max){
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

window.onload = setup();
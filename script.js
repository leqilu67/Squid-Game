var gameContainer = document.getElementById("gameContainer");

gameContainer.minSquidLength = 2;
gameContainer.squidNum = 3;
gameContainer.gridNum = 7;

gameContainer.chances = 20;

gameContainer.squidArray = [];
gameContainer.gridArray = [];

function setup(){
	// 7x7 grid setup
	for (var i  = 0; i < gameContainer.gridNum; i++){
		var gridContainer = document.createElement("div");
		gridContainer.setAttribute("class", "container");
		gameContainer.appendChild(gridContainer);
		for (var j = 0; j < gameContainer.gridNum; j++){
			var grid = document.createElement("div");
			grid.setAttribute("id", "button" + j + i);
			grid.setAttribute("class", "button");
			grid.row = i; 
			grid.col = j;
			grid.occupied = 0;
			grid.clicked = 0;
			grid.addEventListener("click", buttonClicked);
			gridContainer.appendChild(grid);
		}
	}
	
	// squid setup
	for (var i = 0; i < gameContainer.squidNum; i++){
		var squid = new Object();
		// direction of squid: 0 = horizontal, 1 = vertical
		squid.direction = getRandomInt(0, 1);
		squid.length = i + gameContainer.minSquidLength;
		squid.num = i;
		
		gameContainer.squidArray.completedSquid = 0;
		gameContainer.squidArray.push(squid);
		
		decideLocation(squid);
	}
}

function decideLocation(squid){
	squid.direction = 0;
	if (squid.direction == 0){ //horizontal
		squid.x = getRandomInt(0, gameContainer.gridNum - 1 - squid.length);
		squid.y = getRandomInt(0, gameContainer.gridNum - 1);
		
		gameContainer.gridArray = [];
		for (var i = 0; i < squid.length; i++){
			var grid = document.getElementById("button" + (squid.x + i) + squid.y);
			gameContainer.gridArray.push(grid);
		}
		
		gameContainer.squidArray[squid.num] = [];
		gameContainer.squidArray[squid.num].numClicked = 0;
		gameContainer.squidArray[squid.num].complete = 0;
			
		if (conflict(gameContainer.gridArray)){
			gameContainer.gridArray = [];
			decideLocation(squid);
		} else {
			for (var i = 0; i < gameContainer.gridArray.length; i++){
				gameContainer.gridArray[i].occupied = 1;
				gameContainer.gridArray[i].style.backgroundColor = "yellow";
				gameContainer.gridArray[i].belongTo = squid.num;
				gameContainer.squidArray[squid.num].push(gameContainer.gridArray[i]);
			}
		}
		
	} else { //vertical	
		squid.x = getRandomInt(0, gameContainer.gridNum - 1);
		squid.y = getRandomInt(0, gameContainer.gridNum - 1 - squid.length);
		
		gameContainer.gridArray = [];
		for (var i = 0; i < squid.length; i++){
			var grid = document.getElementById("button" + squid.x + (squid.y + i));
			gameContainer.gridArray.push(grid);
		}
		
		if (conflict(gameContainer.gridArray)){
			gameContainer.gridArray = [];
			decideLocation(squid);
		} else {
			for (var i = 0; i < gameContainer.gridArray.length; i++){
				gameContainer.gridArray[i].occupied = 1;
				gameContainer.gridArray[i].style.backgroundColor = "yellow";
				gameContainer.gridArray[i].belongTo = squid.num;
				gameContainer.squidArray[squid.num].push(gameContainer.gridArray[i]);
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
	var target = e.target;
	
	if (target.clicked) return;
	
	gameContainer.chances--;
	if (gameContainer.chances == 0){
		// remove listeners
		for (var i = 0; i < gameContainer.gridNum; i++){
			for (var j = 0; j < gameContainer.gridNum; j++){
				document.getElementById("button" + j + i).removeEventListener("click", buttonClicked);
			}
		}
	}
	
	target.clicked = 1;
	
	if (target.occupied){
		target.style.backgroundColor = "red";
		gameContainer.squidArray[target.belongTo].numClicked++;
	} else {
		target.style.backgroundColor = "blue";
	}
	
	checkEndGame();
}

function checkEndGame(){
	for (var i = 0; i < gameContainer.squidArray.length; i++){
		if (gameContainer.squidArray[i].complete) continue;
		if (gameContainer.squidArray[i].numClicked == gameContainer.squidArray[i].length){
			gameContainer.squidArray[i].complete = 1;
			gameContainer.squidArray.completedSquid++;
		}
	}
	
	endGame();
}

function endGame(){
	if (gameContainer.squidArray.completedSquid == gameContainer.squidArray.length){
		console.log("YOU WON!");
	} else if (gameContainer.chances == 0) {
		console.log("sorry you lost");
	}
}

function getRandomInt(min, max){
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

window.onload = setup();
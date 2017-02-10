var gameContainer = document.getElementById("gameContainer");

gameContainer.chancesLeft = document.getElementById("chancesLeft");

gameContainer.minSquidLength = 2;
gameContainer.squidNum = 3;
gameContainer.gridNum = 8;

gameContainer.maxBomb = 24;
gameContainer.chances = 24;

//preload images before setting up game
gameContainer.preload = function(){
	var images = new Array();
	for (var i = 0; i < gameContainer.preload.arguments.length; i++){
		images[i] = new Image();
		images[i].src = gameContainer.preload.arguments[i];
	}

	if (images.length == gameContainer.preload.arguments.length){
		gameContainer.setup();
	}
}

gameContainer.setup = function(){
	gameContainer.squidArray = [];
    gameContainer.gridArray = [];
	gameContainer.chancesLeft.innerHTML = "Bombs used: 0";
	
	// bomb grid setup
	var counter = gameContainer.chances;
	var counterDiv = document.getElementById("counter");
	
	for (var i = 0; i < 3; i++){
		var bombContainer = document.createElement("div");
		bombContainer.setAttribute("class", "bombContainer");
		counterDiv.appendChild(bombContainer);
		for (var j = 0; j < 8; j++){
			var bomb = document.createElement("div");
			bomb.setAttribute("id", "bomb" + counter);
			bomb.setAttribute("class", "bomb");
			bombContainer.appendChild(bomb);
			counter--;
		}
	}
	
	// 8x8 grid setup
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
			grid.addEventListener("click", gameContainer.buttonClicked);
			gridContainer.appendChild(grid);
		}
	}
	
	// squid setup
	for (var i = 0; i < gameContainer.squidNum; i++){
		var squid = new Object();
		// direction of squid: 0 = horizontal, 1 = vertical
		squid.direction = gameContainer.getRandomInt(0, 1);
		squid.length = i + gameContainer.minSquidLength;
		// squid.num: 0= length 2; 1= length 3; 2= length 4;
		squid.num = i; 
		
		gameContainer.squidArray.completedSquid = 0;
		gameContainer.squidArray.push(squid);
		
		gameContainer.decideLocation(squid);
	}
	
	// squid symbol setup
	for (var i = 0; i < 3; i++){
		var squid = document.createElement("div");
		squid.setAttribute("id", "squid_" + i);
		squid.setAttribute("class", "squid");
		squid.hit = 0;
		document.getElementById("squidSymbol").appendChild(squid);
	}
}

gameContainer.decideLocation = function(squid){
	if (squid.direction == 0){ //horizontal
		squid.x = gameContainer.getRandomInt(0, gameContainer.gridNum - 1 - squid.length);
		squid.y = gameContainer.getRandomInt(0, gameContainer.gridNum - 1);
		
		gameContainer.gridArray = [];
		for (var i = 0; i < squid.length; i++){
			var grid = document.getElementById("button" + (squid.x + i) + squid.y);
			gameContainer.gridArray.push(grid);
		}
		
		gameContainer.squidArray[squid.num] = [];
		gameContainer.squidArray[squid.num].numClicked = 0;
		gameContainer.squidArray[squid.num].complete = 0;
		gameContainer.squidArray[squid.num].direction = squid.direction;
		gameContainer.squidArray[squid.num].startingPostion = {x: squid.x, y: squid.y};
			
		if (gameContainer.conflict(gameContainer.gridArray)){
			gameContainer.gridArray = [];
			gameContainer.decideLocation(squid);
		} else {
			var parts = 0;
			for (var i = 0; i < gameContainer.gridArray.length; i++){
				gameContainer.gridArray[i].occupied = 1;				
				
				var backgroundImageURL = "Assets/squid_" + squid.num + "_" + parts + ".png";
				parts++;
				gameContainer.gridArray[i].backgroundImage = "url(" + backgroundImageURL + ")";
				gameContainer.rotateImage(gameContainer.gridArray[i], -90);
				
				gameContainer.gridArray[i].belongTo = squid.num;
				gameContainer.squidArray[squid.num].push(gameContainer.gridArray[i]);
			}
		}
		
	} else { //vertical	
		squid.x = gameContainer.getRandomInt(0, gameContainer.gridNum - 1);
		squid.y = gameContainer.getRandomInt(0, gameContainer.gridNum - 1 - squid.length);
		
		gameContainer.gridArray = [];
		for (var i = 0; i < squid.length; i++){
			var grid = document.getElementById("button" + squid.x + (squid.y + i));
			gameContainer.gridArray.push(grid);
		}
		
		gameContainer.squidArray[squid.num] = [];
		gameContainer.squidArray[squid.num].numClicked = 0;
		gameContainer.squidArray[squid.num].complete = 0;
		gameContainer.squidArray[squid.num].direction = squid.direction;
		gameContainer.squidArray[squid.num].startingPostion = {x: squid.x, y: squid.y};
		
		if (gameContainer.conflict(gameContainer.gridArray)){
			gameContainer.gridArray = [];
			gameContainer.decideLocation(squid);
		} else {
			var parts = 0;
			for (var i = 0; i < gameContainer.gridArray.length; i++){
				gameContainer.gridArray[i].occupied = 1;
				
				var backgroundImageURL = "Assets/squid_" + squid.num + "_" + parts + ".png";
				parts++;
				gameContainer.gridArray[i].backgroundImage = "url(" + backgroundImageURL + ")";
				
				gameContainer.gridArray[i].belongTo = squid.num;
				gameContainer.squidArray[squid.num].push(gameContainer.gridArray[i]);
			}
		}
	}	
}

gameContainer.conflict = function(gridArray){
	for (var i = 0; i < gridArray.length; i++){
		if (gridArray[i].occupied)
			return true;
	}
	
	return false;
}

gameContainer.buttonClicked = function(e){	
	var target = e.target;
	
	if (target.clicked) return;
	
	document.getElementById("bomb"+gameContainer.chances).style.backgroundImage = "url('Assets/bomb_used.png')";

	gameContainer.chances--;
	gameContainer.chancesLeft.innerHTML = "Bombs used: " + (gameContainer.maxBomb - gameContainer.chances);
	
	if (gameContainer.chances == 0){
		// remove listeners
		for (var i = 0; i < gameContainer.gridNum; i++){
			for (var j = 0; j < gameContainer.gridNum; j++){
				document.getElementById("button" + j + i).removeEventListener("click", gameContainer.buttonClicked);
			}
		}
	}
	
	target.clicked = 1;
	
	if (target.occupied){
		target.style.backgroundImage = "url('Assets/hit.png')";
		gameContainer.squidArray[target.belongTo].numClicked++;
	} else {
		target.style.backgroundImage = "url('Assets/miss.png')";
	}
	
	gameContainer.checkEndGame();
}

gameContainer.changeSquidSymbol = function(){
	for (var i = 0; i < gameContainer.squidNum; i++){
		var squid = document.getElementById("squid_" + i);
		if (!squid.hit){
			squid.style.backgroundImage = "url('Assets/squid_hit.png')";
			squid.hit = 1;
			break;
		}
	}
}

gameContainer.showLocations = function(){
	for (var i = 0; i < gameContainer.squidArray.length; i++){
		var squid = gameContainer.squidArray[i];
		if (squid.direction == 0){
			for (var j = 0; j < squid.length; j++){
				var backgroundImageURL = "Assets/squid_" + i + "_" + j + ".png";			
				var grid = document.getElementById("button" + (squid.startingPostion.x + j) + squid.startingPostion.y);
				grid.style.backgroundImage = "url(" + backgroundImageURL + ")";
				gameContainer.rotateImage(grid, -90);
			}
			
		} else {
			for (var j = 0; j < squid.length; j++){
				var backgroundImageURL = "Assets/squid_" + i + "_" + j + ".png";
				var grid = document.getElementById("button" + squid.startingPostion.x + (squid.startingPostion.y + j));
				grid.style.backgroundImage = "url(" + backgroundImageURL + ")";
			}
		}
	}
}

gameContainer.rotateImage = function(grid, deg){
	grid.style.webkitTransform = "rotate(" + deg + "deg)";
	grid.style.mozTransform = "rotate(" + deg + "deg)";
	grid.style.msTransform = "rotate(" + deg + "deg)";
	grid.style.OTransform = "rotate(" + deg + "deg)";
	grid.style.transform = "rotate(" + deg + "deg)";
}

gameContainer.checkEndGame = function(){
	for (var i = 0; i < gameContainer.squidArray.length; i++){
		if (gameContainer.squidArray[i].complete) continue;
		if (gameContainer.squidArray[i].numClicked == gameContainer.squidArray[i].length){
			gameContainer.squidArray[i].complete = 1;
			gameContainer.changeSquidSymbol();
			gameContainer.squidArray.completedSquid++;
		}
	}
	
	gameContainer.endGame();
}

gameContainer.endGame = function(){
	if (gameContainer.squidArray.completedSquid == gameContainer.squidArray.length){
		gameContainer.showLocations();
		setTimeout(function(){
			if(confirm("You won! Your score is " + (gameContainer.maxBomb - gameContainer.chances) + ". Replay?")){
				gameContainer.reset();
			}
		}, 200);
	} else if (gameContainer.chances == 0) {
		gameContainer.showLocations();
		setTimeout(function(){
			if (confirm("Aww almost! Try again?")){
				gameContainer.reset();
			}
		}, 200);
	}
}

gameContainer.reset = function(){
	gameContainer.removeChildrenNodes(document.getElementById("counter"));
	gameContainer.removeChildrenNodes(document.getElementById("gameContainer"));
	gameContainer.removeChildrenNodes(document.getElementById("squidSymbol"));
	
	gameContainer.maxBomb = 24;
	gameContainer.chances = 24;
	
	gameContainer.setup();
}

gameContainer.getRandomInt = function(min, max){
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

gameContainer.removeChildrenNodes = function(parentNode){
	while (parentNode.hasChildNodes()) {
		parentNode.removeChild(parentNode.lastChild);
	}
}

window.onload = gameContainer.preload("Assets/bomb_unused.png",
		"Assets/bomb_used.png",
		"Assets/hit.png",
		"Assets/miss.png",
		"Assets/squid_0_0.png",
		"Assets/squid_0_1.png",
		"Assets/squid_1_0.png",
		"Assets/squid_1_1.png",
		"Assets/squid_1_2.png",
		"Assets/squid_2_0.png",
		"Assets/squid_2_1.png",
		"Assets/squid_2_2.png",
		"Assets/squid_2_3.png",
		"Assets/squid_hit.png",
		"Assets/squid_symbol.png");
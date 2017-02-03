var gameContainer = document.getElementById("gameContainer");

function setup(){
	for (var i  = 0; i < 7; i++){
		var gridContainer = document.createElement("div");
		gridContainer.setAttribute("class", "container");
		gameContainer.appendChild(gridContainer);
		for (var j = 0; j < 7; j++){
			var grid = document.createElement("div");
			grid.setAttribute("class", "button");
			grid.row = i + 1; 
			grid.col = j + 1;
			grid.addEventListener("click", buttonClicked);
			gridContainer.appendChild(grid);
		}
	}
}

function buttonClicked(e){
	var t = e.target;
	console.log(t.row, t.col);
}

window.onload = setup();
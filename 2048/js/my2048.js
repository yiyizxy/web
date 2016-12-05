var Grids;
var roundFlag = false;
var deBug = false;
window.onload = function(){
	originGrids();
	if (deBug);
	else{
	randomOriginNum();
	// debugger;
	randomOriginNum();
	randomOriginNum();
	}
	moveDirection();
	getColor();	
}

// Grids.map(function(row,y){
// 	row.map(function(grid,x){
// 		grid[0] =

// 	})
// });
function originGrids(){
	Grids = [
		[[0,true],[0,true],[0,true],[0,true]],
		[[0,true],[0,true],[0,true],[0,true]],
		[[0,true],[0,true],[0,true],[0,true]],
		[[0,true],[0,true],[0,true],[0,true]]
	];
}
function Map(Func){
	Grids.map(function(row,y){
		row.map(function(grid,x){
			Func(grid,x,y);
		});
	});
}
function getColor(){
	Map(function(grid,x,y){
		grid[1] = true;
		var id = y.toString() + x.toString();
		if(grid[0]!==0){
			document.getElementById(id).className = 'v' + grid[0];
		if (grid[0]==2048) {
			alert('成功啦哈哈哈哈哈');
			}
		}
		else{
			document.getElementById(id).className = '';
		}
	});
	roundFlag = false;
}
function randomOriginNum(){
	var emptyGrids = [];
	Map(function(grid,x,y){
		if (grid[0]==0) {
			emptyGrids.push([x,y]);
		}
	});
	if (emptyGrids.length!==0) {
	var randomOriginNum = parseInt(Math.random()*emptyGrids.length);
	var x = emptyGrids[randomOriginNum][0],y = emptyGrids[randomOriginNum][1];
	Grids[y][x][0] = Math.random() > 0.05 ? 2:4;
	}
}

function moveDirection(){
	document.body.onkeyup = function(e){
		var eve = e || window.event;
		switch(eve.keyCode){
			case 37:
				Move.left();
				break;
			case 38:
				Move.up();
				break;
			case 39:
				Move.right();
				break;
			case 40:
				Move.down();
		}
		if (deBug); else{if(roundFlag) randomOriginNum();}
		getColor();
	}
}
var Move = {
	left : function() {
        for(var y = 0; y < 4; y++) {
            for(var x = 0; x < 4; x++) {
                canMove('left', x, y);
            }
        }
    },
    right : function() {
        for(var y = 0; y < 4; y++) {
            for(var x = 3; x >= 0; x--) {
                canMove('right', x, y);
            }
        }
    },
    up : function() {
        for(var x = 0; x < 4; x++) {
            for(var y = 0; y < 4; y++) {
                canMove('up', x, y);
            }
        }
    },
    down : function() {
        for(var x = 0; x < 4; x++) {
            for(var y = 3; y >= 0; y--) {
                canMove('down', x, y);
            }
        }
    }
}
function canMove(direction, x , y){
	var grid = {
		x : x,
		y : y,
		v : Grids[y][x][0]
	}
	if(grid.v!==0){
		//while循环上下，保证一次性上下左右
		while(canGo(direction, grid)){
			  letGo(direction, grid);
		}
	    if(canAdd(direction, grid)){
	    	letAdd(direction, grid);
		}
	}
}
function canGo(direction, grid){
	var x = grid.x , y = grid.y;
	var flag = false;
	switch(direction){
		case 'left':
			if(Grids[y][x - 1])if(Grids[y][x - 1][0] === 0) flag = true;
			break;
		case 'right':
			if(Grids[y][x + 1]) if(Grids[y][x + 1][0] === 0) flag = true;
			break;
		case 'up':
			if(Grids[y - 1]) if(Grids[y - 1][x][0] === 0) flag = true;
			break;
		case 'down':
			if(Grids[y + 1]) if(Grids[y + 1][x][0] === 0) flag = true;
			break;
	}
	return flag;
}
function letGo(direction, grid){
	var x = grid.x , y = grid.y;
	switch(direction){
		case 'left': 
			Grids[y][x - 1][0] = grid.v;
			grid.x--;
			break;
		case 'right':
			Grids[y][x+1][0] = grid.v;
			grid.x++;
			break;
		case 'up':
			Grids[y-1][x][0] = grid.v;
			grid.y--;
			break;
		case 'down':
			Grids[y+1][x][0] = grid.v;
			grid.y++;
	}
	Grids[y][x][0] = 0;
	roundFlag = true;
}

function canAdd(direction,grid){
	var x = grid.x, y = grid.y;
	var flag = false;
	switch(direction){
		case 'left':
            if(Grids[y][x - 1]) if(Grids[y][x - 1][0] === grid.v && Grids[y][x - 1][1]) flag = true;
            break;
		case 'right':
            if(Grids[y][x + 1]) if(Grids[y][x + 1][0] === grid.v && Grids[y][x + 1][1]) flag = true;
            break;
        case 'up':
            if(Grids[y - 1]) if(Grids[y - 1][x][0] === grid.v && Grids[y - 1][x][1]) flag = true;
            break;       
        case 'down':
            if(Grids[y + 1]) if(Grids[y + 1][x][0] === grid.v && Grids[y + 1][x][1]) flag = true;
	}
	return flag;
}

function letAdd(direction,grid){
	var x = grid.x, y = grid.y;
	switch(direction){
		case 'left':
			Grids[y][x - 1][0] = grid.v*2;
			Grids[y][x - 1][1] = false;
			break;
		case 'up':
			Grids[y - 1][x][0] = grid.v*2;
			Grids[y - 1][x][1] = false;
			break;
		case 'right':
			Grids[y][x + 1][0] = grid.v*2;
			Grids[y][x + 1][1] = false;
			break;
		case 'down':
			Grids[y + 1][x][0] = grid.v*2;
			Grids[y + 1][x][1] = false;
	}
	Grids[y][x][0] = 0;
	roundFlag = true;
}


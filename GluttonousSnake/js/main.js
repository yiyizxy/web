var widthNum = 20;
var heightNum = 20;
var food_x;
var food_y;
var score;
var direction = 1;
var speed = 1000;
var running = false;
var snake = new Array();
window.onload = function(){
	drawPan();
	var beginButton = document.getElementById('begin');
    beginButton.onclick = function(){
    	direction = 1;
		run();
	}
	//键盘监听事件
	document.onkeydown=function(event){
		handleKeyPress(event);
	}
	var newGameButton = document.getElementById('newGame');
    newGameButton.onclick = function(){
		document.getElementById('gamePan').innerHTML = "";
    	document.getElementById('value').innerHTML = "";
    	direction = 5;
    	snake = [];
		drawPan();
		
		running = true;
	}
}	
	function drawPan(){
		var gamePan = document.getElementById('gamePan');
		gamePan.style.width = 20 * widthNum +'px';
		gamePan.style.height = 20 * heightNum + 'px';
		var topPan = document.getElementById('topPan');
		topPan.style.width = 20 * widthNum +'px';
		for (var i = 0; i < heightNum; i++) {
			for (var j = 0; j < widthNum; j++) {
				var smallPan = document.createElement('div');
				smallPan.setAttribute('class','smallPan');
				smallPan.setAttribute('id', i + '-' + j);	
				gamePan.appendChild(smallPan);		
			}
		}
		initializeSnake();
		initializeFood();
		// direction = 1;
		}
	//使蛇在面板正中央，且对蛇头蛇身进行上色
	function initializeSnake(){
		var x = widthNum/2;
		var y = heightNum/2;
		snake[0] = snakePosition(x,y);
	    drawSnakeColor(x, y, 1);//蛇头
		snake[1] = snakePosition(x+1,y);
		drawSnakeColor(x+1, y, 2);//蛇身
		snake[2] = snakePosition(x+2,y);
		drawSnakeColor(x+2, y, 2);//蛇身
	}
	//得到蛇头蛇身三维数组
	function snakePosition(x,y){
		var body = new Array();
		body.x = x;
		body.y = y;
		return body;
	}
	//给蛇设置颜色
	function drawSnakeColor(x,y,state){
		switch(state){
			case 0://空
				document.getElementById(x + '-' + y).style.background = 'Transparent';
				break;
			case 1://蛇头
				document.getElementById(x + '-' + y).style.background = 'green';
				break;
			case 2://蛇身
				document.getElementById(x + '-' + y).style.background = 'purple';
				break;
			case 3://食物
				document.getElementById(x + '-' + y).style.background = 'yellow';
				break;
			default:
				break;
		}
	}
	//得到食物的位置
	function initializeFood(){
		var x = Math.round(Math.random() * (widthNum - 1));
		var y = Math.round(Math.random() * (heightNum - 1));
		while(judgeSnake(x, y)){
			var x = Math.round(Math.random() * (widthNum - 1));
			var y = Math.round(Math.random() * (heightNum - 1));
		}
		food_x = x;
		food_y = y;
		drawSnakeColor(x, y, 3);
	}
	//判断食物生成的位置是否为蛇的位置
	function judgeSnake(x, y){
		for (var i = 0; i < snake.length; i++) {
			if (snake[i].x == x && snake[i].y == y) {
				return true;
			}
		}
		return false;
	}
	//监听事件
	function handleKeyPress(event){
		var eve = event || window.event;
		var newDirection = direction;
		console.log(eve);		
		switch(eve.keyCode){
			// console.log(eve);
			case 13://'回车'
				if(running == false)
					run();
				break;
			case 37://'左'
				newDirection = 4;
				break;
			case 38://'上'
				newDirection = 1;
				break;
			case 39://'右'
				newDirection = 2;
				break;
			case 40://'下'
				newDirection = 3;
				break;
			default:
				break;
		}
		if(Math.abs(direction - newDirection) != 2) {
			direction = newDirection;
		}
	}
	function run(){
		running = true;
		var next_x = snake[0].x;
		var next_y = snake[0].y;
		switch(direction){
			case 1:
				next_x -=1;//上
				break;
			case 2:
				next_y +=1;//右
				break;
			case 3:
				next_x +=1;//下
				break;
			case 4:
				next_y -=1;//左
				break;
			default:
				break;
		}
		if(newJudgePosition(next_x, next_y)){
			if(food_x == next_x && food_y == next_y){
				drawSnakeColor(snake[0].x, snake[0].y, 2);
				drawSnakeColor(next_x, next_y, 1);
				for (var i = snake.length; i >= 1; --i) {
					snake[i] = snake[i-1];
				}
				snake[0] = snakePosition(next_x, next_y);
				initializeFood();			
			}
			else {
				drawSnakeColor(snake[snake.length - 1].x, snake[snake.length - 1].y, 0);
				drawSnakeColor(snake[0].x, snake[0].y, 2);
				drawSnakeColor(next_x, next_y, 1);			
				for(var i = snake.length - 1; i >= 1; --i) {
					snake[i] = snake[i-1];
				}
				snake[0] = snakePosition(next_x, next_y);
			}
		    var value = document.getElementById('value');
		    score = (snake.length - 3)*5;
		    value.innerHTML = score;
			var time = setTimeout("run();", speed);
		}
		else{   if(direction != 5){
				alert('game over!');
				document.getElementById('gamePan').innerHTML = "";
		    	document.getElementById('value').innerHTML = "";
		    	snake = [];
		    	direction = 1;
				drawPan();
				clearTimeout(time);
				}		
		}
	}
	//判断是否可进行移动
	function newJudgePosition(x, y){
		if(x < 0|| x >= widthNum ||y < 0|| y >= heightNum)
			return false;
		else if(judgeSnake(x, y))
			return false;
		else return true;
	}

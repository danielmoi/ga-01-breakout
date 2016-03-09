var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');

var bX = canvas.width / 2;
var bY = canvas.height - 30;

var dbX = 2;
var dbY = -2;

var bRadius = 10;
var bColor = 'tomato';

var drawBall = function() {
  ctx.beginPath();
  ctx.arc(bX, bY, bRadius, 0, Math.PI * 2);
  ctx.fillStyle = bColor;
  ctx.fill();
  ctx.closePath();
};

var drawEverything = function() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBall();

  incrementBall();

  var rAFid = requestAnimationFrame(drawEverything);
};

var incrementBall = function() {

  // If ball hits left / right walls, change direction and color
  if (bX + dbX > (canvas.width - bRadius) || bX + dbX < bRadius) {
    dbX = -dbX;
  }

  // If ball hits top wall
  if (bY + dbY < bRadius) {
    dbY = -dbY;
  }
  // If ball hits bottom wall
  else if (bY + dbY > (canvas.height - bRadius)) {
    dbY = -dbY;
  }


  bX += dbX;
  bY += dbY;
};

drawEverything();

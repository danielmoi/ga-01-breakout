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
  drawBall();

  var rAFid = requestAnimationFrame(drawEverything);
};

drawEverything();

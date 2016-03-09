// CREATE c
var c = document.getElementById('myCanvas');
var ctx = c.getContext('2d');

// BALL VARIABLES
var bX = c.width / 2; // initial ball x
var bY = c.height - 30; // initial ball y

var dbX = 2;
var dbY = -2;

var bRadius = 10;
var bColor = 'tomato';

// PADDLE VARIABLES
var pHeight = 10;
var pWidth = 70;
var pX = (c.width - pWidth) / 2; // initial paddle x

var pColor = 'firebrick';

// TIMER VARIABLES
var rAFid;

// FUNCTIONS
var drawBall = function() {
  ctx.beginPath();
  ctx.arc(bX, bY, bRadius, 0, Math.PI * 2);
  ctx.fillStyle = bColor;
  ctx.fill();
  ctx.closePath();
};

var drawPaddle = function() {
  ctx.beginPath();
  ctx.rect(pX, c.height - pHeight, pWidth, pHeight);
  ctx.fillStyle = pColor;
  ctx.fill();
  ctx.closePath();
  console.log('x');
};

var incrementBall = function() {

  // If ball hits left / right walls, change direction and color
  if (bX + dbX > (c.width - bRadius) || bX + dbX < bRadius) {
    dbX = -dbX;
  }

  // If ball hits top wall, change directions
  if (bY + dbY < bRadius) {
    dbY = -dbY;
  }
  // If ball hits bottom wall, change directions
  else if (bY + dbY > (c.height - bRadius)) {
    dbY = -dbY;
  }

  // Increment ball
  bX += dbX;
  bY += dbY;
};


var drawEverything = function() {
  ctx.clearRect(0, 0, c.width, c.height);
  drawBall();
  drawPaddle();

  incrementBall();

  rAFid = requestAnimationFrame(drawEverything);
};

drawEverything();

// BUTTON HANDLERS

$('.start').on('click', function() {
  drawEverything();
});
$('.stop').on('click', function() {
  cancelAnimationFrame(rAFid);
});

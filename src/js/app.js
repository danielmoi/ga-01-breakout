// CREATE c
var c = document.getElementById('myCanvas');
var ctx = c.getContext('2d');

// PLAYER VARIABLES
var score = 0;
var lives = 3;

var textColor = 'gray';

// BALL VARIABLES
var ballX = c.width / 2; // initial ball x
var ballY = c.height - 30; // initial ball y

var dbX = 2;
var dbY = -2;

var ballRadius = 10;
var bColor = 'tomato';

// PADDLE VARIABLES
var pHeight = 10;
var paddleWidth = 70;
var paddleX = (c.width - paddleWidth) / 2; // initial paddle x

var dpX = 7;

var pColor = 'firebrick';

// TARGET VARIABLES
var arrTargets = [];

var targetRowCount = 4;
var targetColumnCount = 5;

var targetWidth = 70;
var targetHeight = 20;
var targetGap = 20;
var targetMarginTop = 30;
var targetMarginLeft = 30;

var targetColor = 'slate';

// TIMER VARIABLES
var rAFid;

// KEYPRESS VARIABLES
var rightPress;
var leftPress;


///////////////

// FUNCTIONS
var drawBall = function() {
  ctx.beginPath();
  ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = bColor;
  ctx.fill();
  ctx.closePath();
};

var drawPaddle = function() {
  ctx.beginPath();
  ctx.rect(paddleX, c.height - pHeight, paddleWidth, pHeight);
  ctx.fillStyle = pColor;
  ctx.fill();
  ctx.closePath();
};

var drawTargets = function() {
  for (var col = 0; col < targetColumnCount; col++) {
    for (var row = 0; row < targetRowCount; row++) {

      // Only RE-draw targets that haven't been hit

      if (arrTargets[col][row].status === 'on') {

        var targetX = (col * (targetWidth + targetGap)) + targetMarginLeft;
        var targetY = (row * (targetHeight + targetGap)) + targetMarginTop;

        arrTargets[col][row].x = targetX;
        arrTargets[col][row].y = targetY;

        ctx.beginPath();
        ctx.rect(targetX, targetY, targetWidth, targetHeight);
        ctx.fillStyle = targetColor;
        ctx.fill();
        ctx.closePath();
      }
    }
  }
};

var incrementBall = function() {

  // If ball hits left / right walls, change horizontal direction and color
  if (ballX + dbX > (c.width - ballRadius) || ballX + dbX < ballRadius) {
    dbX = -dbX;
  }

  // If ball hits top wall, change vertical direction
  if (ballY + dbX < ballRadius) {
    dbY = -dbY;
  }
  // If ball hits bottom wall... (single vertical conditional)
  else if (ballY + dbX > (c.height - ballRadius)) {

    // TODO: Make ball hit at top of paddle

    // If ball hits bat (2 horizontal delimiters), change vertical direction
    if (ballX > paddleX && ballX < (paddleX + paddleWidth)) {
      dbY = -dbY;
    }

    // If ball hits bottom wall
    else {

      // Decrement lives
      lives -= 1;

      // if no lives left...
      if (lives === 0) {
        console.log('LOSE');
        // reset values
        score = 0;
        lives = 3;
        ballX = c.width / 2;
        ballY = c.height - 30;
        dbX = 2;
        dbY = -2;
        paddleX = (c.width - paddleWidth) / 2;
      }
      // If still lives left...
      else {
        // reset values

        ballX = c.width / 2;
        ballY = c.height - 30;
        dbX = 2;
        dbY = -2;
        paddleX = (c.width - paddleWidth) / 2;
      }

    }

  } // end else if

  // Increment ball
  ballX += dbX;
  ballY += dbY;

};

var incrementPaddle = function() {
  // Move paddle right, delimited ballY right wall
  if (rightPress && paddleX < (c.width - paddleWidth)) {
    paddleX += dpX;
  }

  // Move paddle left, delimited ballY left wall
  else if (leftPress && paddleX > 0) {
    paddleX -= dpX;
  }


};

var buildArrTargets = function() {
  for (var col = 0; col < targetColumnCount; col++) {
    arrTargets[col] = [];
    for (var row = 0; row < targetRowCount; row++) {
      arrTargets[col][row] = {
        x: 0,
        y: 0,
        status: 'on'
      };
    }
  }
};

var detectCollision = function() {
  for (var col = 0; col < targetColumnCount; col++) {
    for (var row = 0; row < targetRowCount; row++) {
      var target = arrTargets[col][row];

      // calculations for ball-center being INSIDE the target
      // we HAVE to use `&&` because ANY point that is INSIDE the target will actually satisfy **ALL** four of these conditions!

      if (
        // ball center is moving in from: left of target
        ballX > target.x &&

        // ball center is moving in from: right of target
        ballX < target.x + targetWidth &&

        // ball center is moving in from: top of target
        ballY > target.y &&

        // ball center is moving in from: bottom of target
        ballY < target.y + targetHeight
      )
      // We do these things upon collision
      {
        // Move ball opposite vertical direction
        dbY = -dbY;

        // Set brick to disappear
        target.status = 'off';

        // Increment score
        score += 10;




      }

    }
  }
};

var drawScore = function() {
  ctx.font = '16px Arial';
  ctx.fillStyle = textColor;
  ctx.fillText('Score: ' + score, 8, 20);
};

var drawLives = function() {
  ctx.font = '16px Arial';
  ctx.fillStyle = textColor;
  ctx.fillText('Lives: ' + lives, c.width - 65, 20);
};

// CONTAINER FUNCTION
var drawEverything = function() {
  ctx.clearRect(0, 0, c.width, c.height);
  drawBall();
  drawPaddle();
  drawTargets();


  incrementBall();
  incrementPaddle();
  detectCollision();

  drawScore();
  drawLives();

  rAFid = requestAnimationFrame(drawEverything);
};

// Let's go!
buildArrTargets();
drawEverything();

// KEYBOARD CALLBACKS
// These need to be declared before the keyboard handlers
var onKeyDown = function(event) {
  // Right key down
  if (event.keyCode === 39) {
    rightPress = true;
  }
  // Left key down
  else if (event.keyCode === 37) {
    leftPress = true;
  }
};

var onKeyUp = function(event) {
  // Right key up
  if (event.keyCode === 39) {
    rightPress = false;
  }
  // Left key up
  else if (event.keyCode === 37) {
    leftPress = false;
  }
};

// MOUSEMOVE CALLBACKS
var onMouseMove = function(event) {

  // relativeX is the gap between the mouseX and the left edge of the canvas
  // This can be re-interpreted as the position of the mouse, setting the left edge to be ZERO.
  relativeX = event.clientX - c.offsetLeft;

  if (relativeX > (paddleWidth / 2) && relativeX < c.width - (paddleWidth / 2)) {

    // place paddle's middle at mouseX (half the paddle width)
    paddleX = relativeX - (paddleWidth / 2);
  }




};

// KEYBOARD HANDLERS
$(document).on('keydown', onKeyDown);
$(document).on('keyup', onKeyUp);

// MOUSE HANDLERS
$(document).on('mousemove', onMouseMove);

// BUTTON HANDLERS
$('.start').on('click', function() {
  drawEverything();
});
$('.stop').on('click', function() {
  cancelAnimationFrame(rAFid);
});

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

// Generate target array

var buildArrTargets = function() {
  for (var col = 0; col < targetColumnCount; col++) {
    arrTargets[col] = [];
    for (var row = 0; row < targetRowCount; row++) {
      arrTargets[col][row] = {
        x: 0,
        y: 0
      };
    }
  }
};

///////////////

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
};

var drawTargets = function() {
  for (var col = 0; col < targetColumnCount; col++) {
    for (var row = 0; row < targetRowCount; row++) {

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
  // If ball hits bottom wall... (single vertical conditional)
  else if (bY + dbY > (c.height - bRadius)) {

    // TODO: Make ball hit at top of paddle

    // If ball hits bat (2 horizontal conditionals), change directions
    if (bX > pX && bX < (pX + pWidth)) {
      dbY = -dbY;
    }

    // If ball hits bottom wall
    // Reset values
    else {
      bX = c.width / 2;
      bY = c.height - 30;
      dbX = 2;
      dbY = -2;
      pX = (c.width - pWidth) / 2;
    }

  } // end else if

  // Increment ball
  bX += dbX;
  bY += dbY;

};

var incrementPaddle = function() {
  // Move paddle right, delimited by right wall
  if (rightPress && pX < (c.width - pWidth)) {
    pX += dpX;
  }

  // Move paddle left, delimited by left wall
  else if (leftPress && pX > 0) {
    pX -= dpX;
  }


};

// CONTAINER FUNCTION
var drawEverything = function() {
  ctx.clearRect(0, 0, c.width, c.height);
  drawBall();
  drawPaddle();
  drawTargets();

  incrementBall();
  incrementPaddle();

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


// KEYBOARD HANDLERS
$(document).on('keydown', onKeyDown);
$(document).on('keyup', onKeyUp);



// BUTTON HANDLERS
$('.start').on('click', function() {
  drawEverything();
});
$('.stop').on('click', function() {
  cancelAnimationFrame(rAFid);
});

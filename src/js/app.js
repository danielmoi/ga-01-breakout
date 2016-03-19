///////////////////////////////////////////////////////////////////////////////

// CATBUS 3000

// by Daniel Moi 2016

///////////////////////////////////////////////////////////////////////////////

// TODO: swipe functionality
// TODO: size for mobile too
// _TODO: fix bug that ball goes vertical or horizontal upon hitting last target


// SCOREBOARD

// $(document).ready(function() {
var myFB = new Firebase("https://catbus.firebaseio.com/");
var scoresRef = myFB.child("scores");



// CREATE CANVAS
var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');

// PLAYER VARIABLES
var score = 0;
var lives = 3;
var level = 1;
var gameActive = true;
var gameOver = null;
var firstGame = true;

var textColor = 'rgb(84,91,133)';

// BALL VARIABLES
var ballX = canvas.width / 2; // initial ball x
var ballY = canvas.height - 30; // initial ball y

var dbX = 2;
var dbY = -2;

var ballRadius = 10;
var ballColor = 'tomato';

// PADDLE VARIABLES
var pHeight = 20;
var paddleWidth = 70;
var paddleX = (canvas.width - paddleWidth) / 2; // initial paddle x

var dpX = 7;

var paddleColor = 'rgba(0,0,0,0)';

// TARGET VARIABLES
var arrTargets = [];

var targetRowCount = 4;
var targetColumnCount = 5;

var targetWidth = 70;
var targetHeight = 20;
var targetGap = 20;
var targetMarginTop = 30;
var targetMarginLeft = 30;

var targetColor = 'rgb(84,91,133)';

// TIMER VARIABLES
var rAFid;

// KEYPRESS VARIABLES
var rightPress;
var leftPress;

// CATBUS SETUP
var catbus = $('.catbus')[0];
var sign = 1;
catbus.style.left = '420px';
catbus.style.top = '-20px';
var direction;


///////////////////////////////////////////////////////////////////////////////

// FUNCTIONS - for loop
var getRandomColor = function() {
  var letters = '0123456789ABCDEF'.split('');
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

var drawBall = function() {
  ctx.beginPath();
  ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = ballColor;
  ctx.fill();
  ctx.closePath();
};

var drawPaddle = function() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - pHeight, paddleWidth, pHeight);

  // Why is paddleColor overriden?
  ctx.fillStyle = paddleColor;
  ctx.fill();
  ctx.closePath();
};

var resetTargets = function() {
  for (var col = 0; col < targetColumnCount; col++) {
    for (var row = 0; row < targetRowCount; row++) {
      arrTargets[col][row].status = 'on';
    }
  }

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
  if (ballX + dbX > (canvas.width - ballRadius) || ballX + dbX < ballRadius) {
    dbX = -dbX;
  }

  // If ball hits top wall, change vertical direction
  if (ballY + dbY < ballRadius) {
    dbY = -dbY;
  }
  // If ball hits bottom wall... (single vertical conditional)
  else if (ballY + dbX > (canvas.height - ballRadius)) {

    // TODO: Make ball hit at top of paddle

    // If ball hits bat (2 horizontal delimiters), change vertical direction
    if (ballX > paddleX && ballX < (paddleX + paddleWidth)) {
      dbY = -dbY;

      ballColor = getRandomColor();
    }

    // If ball hits bottom wall
    else {

      // Decrement lives
      lives -= 1;

      // If still lives left...
      if (lives > 0) {
        // reset values
        // console.log('IF');

        // This is necessary to remove ball from bottom wall collision zone
        resetBallPaddleCatbus();

        gameActive = false;
        cancelAnimationFrame(rAFid);
        lifeLostDisplay();
        // drawEverything();
        // gameActive = true;

      }

      // if no lives left...
      else {
        gameOverDisplay();
        showPostScore();
        cancelAnimationFrame(rAFid);
        gameActive = false;
        gameOver = true;
      }


    }

  } // end else if

  // Increment ball
  ballX += dbX;
  ballY += dbY;

};



var detectCollision = function() {
  for (var col = 0; col < targetColumnCount; col++) {
    for (var row = 0; row < targetRowCount; row++) {
      var target = arrTargets[col][row];

      // calculations for ball-center being INSIDE the target
      // we HAVE to use `&&` because ANY point that is INSIDE the target will actually satisfy **ALL** four of these conditions!

      // only detect collision if target exists
      if (target.status === 'on') {
        if (
          // ball center is moving in from: left of target
          (ballX + ballRadius) > target.x &&

          // ball center is moving in from: right of target
          (ballX - ballRadius) < target.x + targetWidth &&

          // ball center is moving in from: top of target
          (ballY + ballRadius) > target.y &&

          // ball center is moving in from: bottom of target
          (ballY - ballRadius) < target.y + targetHeight
        )
        // We do these things upon collision
        {
          // Move ball opposite vertical direction
          dbY = -dbY;

          // Set brick to disappear
          target.status = 'off';

          // Increment score
          score += 10;

          // Change ball color
          ballColor = getRandomColor();

          // Check if all targets have been hit === WIN
          if (score % (10 * targetRowCount * targetColumnCount) === 0) {
            console.log('You win in the console too!');

            resetTargets();
            dbX += 2;
            dbY -= -2;

            // winDisplay();
            // cancelAnimationFrame(rAFid);
            // gameActive = false;
            // gameOver = true;

          }
        }
      } // end if

    }
  }
};

///////////////////////////////////////////////////////////////////////////////

// Functions - Text Display

var displayDiv = $('.display');

var display = function(arr) {
  var p1 = $('<p>');
  var p2 = $('<p>');
  displayDiv.empty();
  p1.text(arguments[0]);
  displayDiv.append(p1);
  p2.text(arguments[1]);
  displayDiv.append(p2);

};

var drawScore = function() {
  ctx.font = '16px Arial';
  ctx.fillStyle = textColor;
  ctx.textAlign = 'left';
  ctx.fillText('Score: ' + score, 10, 20);
};

var drawLevel = function() {
  ctx.font = '16px Arial';
  ctx.fillStyle = textColor;
  ctx.textAlign = 'center';
  ctx.fillText('Level: ' + level, canvas.width/2, 20);
};

var drawLives = function() {
  ctx.font = '16px Arial';
  ctx.fillStyle = textColor;
  ctx.textAlign = 'right';
  ctx.fillText('Lives: ' + lives, canvas.width - 10, 20);
};

var gamePausedDisplay = function() {
  display('Game paused.', 'Press SPACEBAR to resume');
};

var gameResumeDisplay = function() {
  display('Good luck!', 'Press SPACEBAR to pause');
};

var gameOverDisplay = function() {
  display('GAME OVER.', 'Press SPACEBAR to restart.');
};

var lifeLostDisplay = function() {
  display(('Lives remaining: ' + lives), 'Press SPACEBAR to continue' );
};

var welcomeDisplay = function() {
  display('Help Catbus hit the targets!', 'Press SPACEBAR to start');
};

var winDisplay = function() {
  display('Catbus says well done!!', 'Press SPACEBAR to play again');
};

///////////////////////////////////////////////////////////////////////////////

// Functions - Single Call Draws

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

var resetBallPaddleCatbus = function() {
  ballX = canvas.width / 2;
  ballY = canvas.height - 30;
  dbX = 2;
  dbY = -2;
  paddleX = (canvas.width - paddleWidth) / 2;
  moveCatbus();
};

///////////////////////////////////////////////////////////////////////////////

// Functions – Game states

var resetScoreLives = function() {
  score = 0;
  lives = 3;
  level = 1;
};

var pauseGame = function() {
  if (gameActive === true) {
    gameActive = false;
    console.log('pause game');
    cancelAnimationFrame(rAFid);
    gamePausedDisplay();
  }
};
var resumeGame = function() {
  if (gameActive === false) {
    console.log('resume game');
    gameActive = true;
    drawEverything();
    gameResumeDisplay();
  }
};
var restartGame = function() {
  gameOver = false;
  console.log('restart game');
  resetBallPaddleCatbus();
  resetScoreLives();
  buildArrTargets();
  gameActive = true;
  drawEverything();
};

var startGame = function() {
  console.log('start game');
  firstGame = false;
  drawEverything();
};
///////////////////////////////////////////////////////////////////////////////

// Functions - Keyboard / Mouse inputs

var incrementPaddle = function() {

  // Move paddle right, delimited ballY right wall
  if (rightPress && paddleX < (canvas.width - paddleWidth)) {
    paddleX += dpX;
    moveCatbusRight();

  }

  // Move paddle left, delimited ballY left wall
  else if (leftPress && paddleX > 0) {
    paddleX -= dpX;
    moveCatbusLeft();
  }
};

var moveCatbusLeft = function() {
  sign = -1;
  catbus.style.transform = 'scaleX(' + sign + ')';
  catbus.style.left = canvas.offsetLeft + (paddleX - 125) + 'px';
  direction = 'left';
};

var moveCatbusRight = function() {
  sign = 1;
  catbus.style.transform = 'scaleX(' + sign + ')';
  catbus.style.left = canvas.offsetLeft + (paddleX - 125) + 'px';
  direction = 'right';
};

var moveCatbus = function() {
  catbus.style.left = canvas.offsetLeft + (paddleX - 125) + 'px';
};

///////////////////////////////////////////////////////////////////////////////

// Super Function - Loop Draw

var drawEverything = function() {

  if (gameActive) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawPaddle();
    drawTargets();

    incrementBall();
    incrementPaddle();
    detectCollision();

    drawScore();
    drawLives();
    drawLevel();

    rAFid = requestAnimationFrame(drawEverything);
    // There is a NEW rAFid each time this loop runs!!
    // console.log(rAFid);
  }
};

///////////////////////////////////////////////////////////////////////////////

// Callbacks - KEYBOARD
// These need to be declared before the keyboard handlers

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

var onKeyDown = function(event) {
  // Right key down
  if (event.keyCode === 39) {
    console.log('keydown');
    rightPress = true;
  }
  // Left key down
  else if (event.keyCode === 37) {
    leftPress = true;
  }
  // Spacebar
  else if (event.keyCode === 32) {

    if (firstGame) {
      console.log('1');
      startGame();
    } else if (gameOver) {
      console.log('2');
      restartGame();
    }
    // if gameActive is true
    else if (gameActive) {
      console.log('3');
      pauseGame();
    }
    // if gameActive is false
    else if (gameActive === false) {
      console.log('4');
      resumeGame();
    }
  }
};

// Callbacks – Mousemove
var onMouseMove = function(event) {

  // relativeX is the gap between the mouseX and the left edge of the canvas
  // This can be re-interpreted as the position of the mouse, setting the left edge to be ZERO.

  relativeX = event.clientX - canvas.offsetLeft;
  var prevRelativeX = relativeX;

  if (relativeX > (paddleWidth / 2) && relativeX < canvas.width - (paddleWidth / 2)) {

    // place paddle's middle at mouseX (half the paddle width)
    paddleX = relativeX - (paddleWidth / 2);
    moveCatbus();
  }
};

///////////////////////////////////////////////////////////////////////////////

// KEYBOARD HANDLERS

$(document).on('keydown', onKeyDown);
$(document).on('keyup', onKeyUp);

// MOUSE HANDLERS
$(document).on('mousemove', onMouseMove);

// BUTTON HANDLERS

var updateFirebase = function() {
  // debugger;
  console.log("hello");
  var name = $('#input_score').val();
  console.log('Name: ' + name + ', Score: ' + score);
  var newScoreRef = scoresRef.push({
    name: name,
    score: score
  });
  var postID = newScoreRef.key();


};



var scoresDisplay = function (arr) {
  var scoresDiv = $('.score-list');
  scoresDiv.empty();
  arr.forEach(function(element) {
    if (element.name) {
      var p = $('<p>');
      var name = element.name;
      var score = element.score;
      p.text(score + " – " + name);
      scoresDiv.prepend(p);
      console.log("Posting");
    }
  });
};

var postScore = function() {
  updateFirebase();
  showScoreboard();
};

var showPostScore = function() {
  $('.score').text(score);
  $('.postscore-supercontainer').show();
};

var showScoreboard = function() {
  pauseGame();
  $('.postscore-supercontainer').hide();
  $('.scoreboard-supercontainer').show();
  $('.catbus-container').hide();
};

scoresRef.orderByChild("score").on("value", function(snapshot) {
  var arrScores = [];
  snapshot.forEach(function(obj) {
    arrScores.push(obj.val());
  });
  scoresDisplay(arrScores);
  console.log(arrScores);
}, function(errorObject) {
  console.log("The read failed: " + errorObject.code);
});

var exitScoreboard = function() {
  $('.catbus-container').show();
  $('.scoreboard-supercontainer').hide();

};

$('.post-score').on('click', postScore);

$('.exit-scoreboard').on('click', exitScoreboard);

$('.show-scoreboard').on('click', showScoreboard);


// $('.go').on('click', function() {
//   if (firstGame) {
//     startGame();
//   } else if (gameActive === false) {
//     resumeGame();
//   }
// });
//
// $('.pause').on('click', function() {
//   if (gameActive) {
//     pauseGame();
//   }
// });

$('.restart').on('click', function() {
  restartGame();
});

///////////////////////////////////////////////////////////////////////////////

// Let's go!

buildArrTargets();
drawTargets();
drawScore();
drawLives();
drawLevel();
resetBallPaddleCatbus();
welcomeDisplay();


// });

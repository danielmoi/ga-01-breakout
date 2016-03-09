var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');

ctx.beginPath();
ctx.rect(20, 40, 50, 50);
// ctx.rect(x-start, y-start, width, height)

ctx.fillStyle = '#ff0000';
ctx.fill();
ctx.closePath();



ctx.beginPath();
ctx.arc(240, 160, 20, 0, Math.PI * 2, false);
// Arc method
// x-center, y-center, arc-radius, start-radians, end-radians, [direction; optional]
// Pi * radians = 180 degrees
// So, Math.PI * 2 = 360 degrees; a full circle


ctx.fillStyle = 'green';
ctx.fill();
ctx.closePath();


/////////

ctx.beginPath();
ctx.rect(160,10,100,40);
ctx.strokeStyle = 'rgba(0,0,255,0.5)';
ctx.stroke();
ctx.closePath();

/////

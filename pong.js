let $canvas = $("#pongCanvas");

$canvasContainer = $canvas.parent();

let canvas = $canvas[0];
let ctx;

sounds = {
    wall: new Audio('wall.wav'),
    paddle: new Audio('paddle.wav'),
    point: new Audio('point.wav'),
};

let padding;
let bounds;
let paddleWidth;
let paddleLength;
let ballRadius;
let ballStart;
let ballSpeed;
let paddleSpeed;
let ball;
let player1;
let player2;

function resetCanvasWidth() {
    const aspectRatio = 4/3;
    if ($canvasContainer.width() / aspectRatio <= $canvasContainer.height()) {
        canvas.width = $canvasContainer.width();
        canvas.height = $canvasContainer.width() / aspectRatio;
    }
    else {
        canvas.width = $canvasContainer.height() * aspectRatio;
        canvas.height = $canvasContainer.height();
    }
    paddleLength = canvas.height / 4;
    
    padding = 50;
    bounds = {
        top: 0,
        right: canvas.width,
        bottom: canvas.height,
        left: 0
    };
    paddleWidth = ballRadius = 30;
    paddleLength = canvas.height / 6;
    ballStart = {
        x: canvas.width / 2 - ballRadius / 2,
        y: canvas.height / 2 - ballRadius / 2
    };
    ballSpeed = 10
    paddleSpeed = ballSpeed * .65;
    
    ctx = canvas.getContext("2d");
    ctx.fillStyle = "white";
    ctx.font = "60px Atari";
}
resetCanvasWidth();

ball = {
    x: ballStart.x,
    y: ballStart.y,
    r: ballRadius,
    delta: {
        x: ballSpeed/2,
        y: ballSpeed/2
    }
};
player1 = {
    x: bounds.left + padding - paddleWidth,
    y: canvas.height / 2 - paddleLength / 2,
    w: paddleWidth,
    h: paddleLength,
    delta: paddleSpeed
};
player2 = {
    x: bounds.right - padding,
    y: canvas.height / 2 - paddleLength / 2,
    w: paddleWidth,
    h: paddleLength,
    delta: paddleSpeed
};

function resizeGameState() {
    resetCanvasWidth();

    correctBall();
    correctPaddle(player1);
    correctPaddle(player2);

    player1.x = bounds.left + padding - paddleWidth;
    player2.x = bounds.right - padding;
    player1.w = paddleWidth;
    player1.h = paddleLength;
    player2.w = paddleWidth;
    player2.h = paddleLength;
}

$(window).resize(resizeGameState);
resizeGameState();

var keys = {
    up: false,
    down: false
};
let points = {
    player1: 0,
    player2: 0
};
let sound = true;
let animatePoint = true;

$(document).keydown(function (ev) {
    if (ev.key == "ArrowUp") {
        keys.up = true;
    }
    if (ev.key == "ArrowDown") {
        keys.down = true;
    }
    if (ev.key == "f") {
        $(".player").toggle();
        resizeGameState();
    }
    if (ev.key == "s") {
        sound = !sound;
    }
    if (ev.key == "i") {
        $(".options").toggle();
    }
    if (ev.key == "a") {
        animatePoint = !animatePoint;
    }
});

$(document).keyup(function (ev) {
    if (ev.key == "ArrowUp") {
        keys.up = false;
    }
    if (ev.key == "ArrowDown") {
        keys.down = false;
    }
});

function resetBall() {
    ball.x = ballStart.x;
    ball.y = ballStart.y;
    ball.delta.y = (ball.delta.y / Math.abs(ball.delta.y)) * ballSpeed/2;

    if (sound) {
        sounds.point.play();
    }
}

// Ball position logic
function ballIsInsidePaddle(side) {
    if (side == 'left') {
        return ball.y < player1.y + player1.h && ball.y + ball.r > player1.y && ball.x < player1.x + player1.w && ball.x > bounds.left;
    }
    if (side == 'right') {
        return ball.y < player2.y + player2.h && ball.y + ball.r > player2.y && ball.x + ball.r > player2.x && ball.x < bounds.right;
    }
}

function getBallVelocity(paddle, ball) {
    paddleCenter = paddle.y + paddle.h/2;
    ballCenter = ball.y + ball.r/2;
    return ballSpeed * Math.sin((ballCenter - paddleCenter) / (paddle.h/2));
}

function correctBallDelta(side) {
    if (side == 'left') {
        if (Math.abs(player1.x + player1.w - ball.x) > Math.abs(ball.delta.x * 2)) {
            if (ball.y + ball.r / 2 > player1.y + player1.h / 2) {
                ball.delta.y = Math.abs(ball.delta.y);
                ball.y = player1.y + player1.h;
            } else {
                ball.delta.y = -Math.abs(ball.delta.y);
                ball.y = player1.y - ball.r;
            }
        } else {
            ball.delta.x = Math.abs(ball.delta.x);
            ball.delta.y = getBallVelocity(player1, ball);
            ball.x = bounds.left + padding;
            if (sound) sounds.paddle.play();
        }
    }
    if (side == 'right') {
        if (Math.abs(ball.x + ball.r - player2.x) > Math.abs(ball.delta.x * 2)) {
            if (ball.y + ball.r / 2 > player2.y + player2.h / 2) {
                ball.delta.y = Math.abs(ball.delta.y);
                ball.y = player2.y + player2.h;
            } else {
                ball.delta.y = -Math.abs(ball.delta.y);
                ball.y = player2.y - ball.r;
            }
        } else {
            ball.delta.x = -Math.abs(ball.delta.x);
            ball.delta.y = getBallVelocity(player1, ball);
            ball.x = bounds.right - ball.r - padding;
            if (sound) sounds.paddle.play();
        }
    }
}

function checkBallCollisions() {
    if (ball.x < bounds.left + padding) {
        if (ballIsInsidePaddle('left')) {
            correctBallDelta('left');
        } else {
            if (ball.x < 0) {
                points.player2++;
                resetBall();
                if (animatePoint) {
                    $(".cpu").addClass("shake");
                    setTimeout(() => $(".cpu").removeClass("shake"), 2000);
                }
            }
        }
    }
    if (ball.x + ball.r > bounds.right - padding) {
        if (ballIsInsidePaddle('right')) {
            correctBallDelta('right');
        } else {
            if (ball.x + ball.r > canvas.width) {
                points.player1++;
                resetBall();
                if (animatePoint) {
                    $(".human").addClass("shake");
                    setTimeout(() => $(".human").removeClass("shake"), 2000);
                }
            }
        }
    }
}

function checkBallBounds() {
    if (ball.y < bounds.top) {
        ball.delta.y = Math.abs(ball.delta.y);
        ball.y = bounds.top;
        if (sound) sounds.wall.play();
    }
    if (ball.y + ball.r > bounds.bottom) {
        ball.delta.y = -Math.abs(ball.delta.y);
        ball.y = bounds.bottom - ball.r;
        if (sound) sounds.wall.play();
    }
}

function correctBall() {
    checkBallCollisions();
    checkBallBounds();
}

function updateBall() {
    ball.x += ball.delta.x;
    ball.y += ball.delta.y;

    correctBall();
}

// Player and CPU position logic
function correctPaddle(paddle) {
    if (paddle.y < 0) {
        paddle.y = 0;
    }

    if (paddle.y + paddle.h > canvas.height) {
        paddle.y = canvas.height - paddle.h;
    }
}

function updatePlayer() {
    let deltaY = 0;
    if (keys.up) {
        deltaY -= player1.delta;
    }
    if (keys.down) {
        deltaY += player1.delta;
    }

    player1.y += deltaY;

    correctPaddle(player1);
}

function updateCPU() {
    if (ball.x < canvas.width/3) {
        return;
    }

    let ballCenter = ball.y + ball.r / 2;
    let player2Center = player2.y + player2.h / 2;
    let difference = ballCenter - player2Center;
    if (difference > 0) {
        player2.y += Math.min(difference, player2.delta);
    } else {
        player2.y -= Math.min(Math.abs(difference), player2.delta);
    }

    correctPaddle(player2);
}

// Rendering code
function drawElements() {
    ctx.fillRect(player1.x, player1.y, player1.w, player1.h);
    ctx.fillRect(player2.x, player2.y, player2.w, player2.h);
    ctx.fillRect(ball.x, ball.y, ball.r, ball.r);
}

function drawDashedLine() {
    const dashWidth = ball.r / 2;
    const dashedLineX = canvas.width / 2 - dashWidth / 2;
    const numDashes = 10;
    const spaceBetween = (canvas.height + dashWidth) / numDashes;
    for (let y = dashWidth / 2; y < canvas.height; y += spaceBetween) {
        ctx.fillRect(dashedLineX, y, dashWidth, dashWidth);
    }
}

function drawPoints() {
    ctx.fillText(points.player1, canvas.width / 4, 100, 100);
    ctx.fillText(points.player2, canvas.width * 3 / 4, 100, 100);

    if (points.player1 - points.player2 < 0) {
        $("#cpuface")[0].src = "cpuhappy.jpg";
    }
    else if (points.player1 - points.player2 > 0) {
        $("#cpuface")[0].src = "cpumad.jpg";
    }
    else {
        $("#cpuface")[0].src = "cpu.jpg";
    }
}

function update() {
    updatePlayer();
    updateCPU();
    updateBall();
}

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawElements();
    drawDashedLine();
    drawPoints();
}

function loop() {
    render();

    window.requestAnimationFrame(loop);
}

resetBall();
loop();
setInterval(update, 10);
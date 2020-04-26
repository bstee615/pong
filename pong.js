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
    ballSpeed = canvas.width / 60;
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

var isMobile = false; //initiate as false
// device detection
if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
    || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) { 
    isMobile = true;
}

function registerEventHandlers() {
    if (isMobile) {
        $('.phone-controls').show();
        // $(document).off('keydown.ponk');
        // $(document).off('keyup.ponk');
        
        $('#phone-up').on('touchstart.ponk mousedown.ponk', function (ev) {
            keys.up = true;
        });
        $('#phone-up').on('touchend.ponk mouseup.ponk', function (ev) {
            keys.up = false;
        });
        $('#phone-down').on('touchstart.ponk mousedown.ponk', function (ev) {
            keys.down = true;
        });
        $('#phone-down').on('touchend.ponk mouseup.ponk', function (ev) {
            keys.down = false;
        });
    }
    else {
        $('.phone-controls').hide();
        // $('#phone-up').off('touchend.ponk mouseup.ponk touchend.ponk mouseup.ponk');
        // $('#phone-down').off('touchstart.ponk mousedown.ponk touchend.ponk mouseup.ponk');

        $(document).on('keydown.ponk', function (ev) {
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
        
        $(document).on('keyup.ponk', function (ev) {
            if (ev.key == "ArrowUp") {
                keys.up = false;
            }
            if (ev.key == "ArrowDown") {
                keys.down = false;
            }
        });
    }
}
registerEventHandlers();

function randomG(v){ 
    let r = 0;
    for(let i = v; i > 0; i --){
        r += Math.random();
    }
    return r / v;
}

function resetBall() {
    ball.x = ballStart.x;
    ball.y = ballStart.y;
    // const signRand = Math.random() - .5;
    // const sign = signRand / Math.abs(signRand);
    // const magnitude = (randomG(5) - .5) * 10;
    const magnitude = 0;
    ball.delta.y = magnitude;

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
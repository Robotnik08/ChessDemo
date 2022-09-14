var socket = io();

let board = [];
let doneLoading = false;
let gameStart = false;
let yourTurn = false;
let isWhite = false;
const can = document.getElementById('main');
const ctx = document.getElementById('main').getContext("2d");

const whiteSquare = "rgba(255, 255, 255, 1)";
const blackSquare = "rgba(200, 200, 200, 1)";
const unit = 100;
let selectedTile = {
    x: 0,
    y: 0
};
let MousePos = {
    x: 0,
    y: 0
};
function getMousePos(evt) {
    var rect = can.getBoundingClientRect();
    var scaleX = can.width / rect.width;
    var scaleY = can.height / rect.height;
    MousePos.x = (evt.clientX - rect.left) * scaleX;
    MousePos.y = (evt.clientY - rect.top) * scaleY;
}
socket.on('nextturn', (data) => {
    yourTurn = getTurn(data.turn);
    board = data.board;
});
function getTurn (bool) {
    if ((isWhite && bool) || (!isWhite && !bool)) {
        return true;
    }
    return false;
}
socket.on('RecieveBoard', (data) => {
    board = data.board;
    isWhite = data.color;
    yourTurn = data.yourTurn;
    doneLoading = true;
    return;
});
socket.on('playeramount', (data) => {
    if (data > 1) {
        gameStart = true;
    }
    return;
});
const bpa = new Image();
bpa.src = './assets/pawnblack.png';
const bkn = new Image();
bkn.src = './assets/knightblack.png';
const bro = new Image();
bro.src = './assets/rookblack.png';
const bbi = new Image();
bbi.src = './assets/bishopblack.png';
const bqu = new Image();
bqu.src = './assets/queenblack.png';
const bki = new Image();
bki.src = './assets/kingblack.png';
const wpa = new Image();
wpa.src = './assets/pawnwhite.png';
const wkn = new Image();
wkn.src = './assets/knightwhite.png';
const wro = new Image();
wro.src = './assets/rookwhite.png';
const wbi = new Image();
wbi.src = './assets/bishopwhite.png';
const wqu = new Image();
wqu.src = './assets/queenwhite.png';
const wki = new Image();
wki.src = './assets/kingwhite.png';
const sel = new Image();
sel.src = './assets/selectionbox.png';
const pieces = [bki, bki, wki, bqu, wqu, bbi, wbi, bkn, wkn, bro, wro, bpa, wpa];
setInterval(function() {
    if (doneLoading) {
        draw();
    }
}, 1000/60);
function draw () {
    if (gameStart) {
        for (let x = 0; x < 8; x++) {
            for (let y = 0; y < 8; y++) {
                if (x % 2 == 0) {
                    if (y % 2 == 0) {
                        ctx.fillStyle = whiteSquare;
                    } else {
                        ctx.fillStyle = blackSquare;
                    }
                } else {
                    if (y % 2 == 0) {
                        ctx.fillStyle = blackSquare;
                    } else {
                        ctx.fillStyle = whiteSquare;
                    }
                }
                ctx.fillRect(x*unit,y*unit,unit*1.01,unit*1.01)
                if (board[x][y] != 0) {
                    ctx.drawImage(pieces[board[x][y]],x*unit,y*unit,unit,unit);
                }
            }
        }
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fillRect(Math.round((MousePos.x - unit/2)/unit)*unit,Math.round((MousePos.y-unit/2)/unit)*unit,unit,unit);
        ctx.drawImage(sel, selectedTile.x*unit,selectedTile.y*unit,unit,unit);
        if (yourTurn) {
            document.getElementById('chess').innerHTML = "It's your turn!";
            return;
        }
        document.getElementById('chess').innerHTML = "It's the opponents turn!";
        return;
    }
    document.getElementById('chess').innerHTML = 'waiting for opponent!';
}
function changeSel () {
    if (selectedTile.x < 8 && selectedTile.y < 8 && yourTurn) {
        if (board[selectedTile.x][selectedTile.y] > 0 && allow(Math.round((MousePos.x - unit/2)/unit),Math.round((MousePos.y - unit/2)/unit), selectedTile.x, selectedTile.y)) {
            sendChange(Math.round((MousePos.x - unit/2)/unit),Math.round((MousePos.y - unit/2)/unit),selectedTile.x,selectedTile.y, board[selectedTile.x][selectedTile.y], 0);
            selectedTile.x = 8;
            selectedTile.y = 8;
            return;
        }
        selectedTile.x = Math.round((MousePos.x - unit/2)/unit);
        selectedTile.y = Math.round((MousePos.y - unit/2)/unit);
    }
    selectedTile.x = Math.round((MousePos.x - unit/2)/unit);
    selectedTile.y = Math.round((MousePos.y - unit/2)/unit);
}
function sendChange (x,y,x1,y1,change,change1) {
    var packet = {
        x: x,
        y: y,
        x1: x1,
        y1: y1,
        change: change,
        change1: change1
    };
    socket.emit('change', packet);
}
function allow(x,y,x1,y1) {
    if (isWhite) {
        if ((board[x][y] == 0 || board[x][y] == 1 || board[x][y] == 3 || board[x][y] == 5 || board[x][y] == 7 || board[x][y] == 9 || board[x][y] == 11) && board[x1][y1] > 0 && (board[x1][y1] == 2 || board[x1][y1] == 4 || board[x1][y1] == 6 || board[x1][y1] == 8 || board[x1][y1] == 10 || board[x1][y1] == 12)) {
            return true;
        }
        return false;
    }
    if ((board[x][y] == 0 || board[x][y] == 2 || board[x][y] == 4 || board[x][y] == 6 || board[x][y] == 8 || board[x][y] == 10 || board[x][y] == 12) && board[x1][y1] > 0 && !(board[x1][y1] == 2 || board[x1][y1] == 4 || board[x1][y1] == 6 || board[x1][y1] == 8 || board[x1][y1] == 10 || board[x1][y1] == 12)) {
        return true;
    }
    return false;
}
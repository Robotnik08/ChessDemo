const exp = require('constants');
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const port = 3000;

app.use(express.static('public'));
server.listen(port, () => {
console.log(`listening on *:${port}`);
});


//serverside
let board = [];
let players = 0;
let turn = true;
CreateBoard();
function CreateBoard () {
    board[0] = [9,11,0,0,0,0,12,10];
    board[1] = [7,11,0,0,0,0,12,8];
    board[2] = [5,11,0,0,0,0,12,6];
    board[3] = [1,11,0,0,0,0,12,2];
    board[4] = [3,11,0,0,0,0,12,4];
    board[5] = [5,11,0,0,0,0,12,6];
    board[6] = [7,11,0,0,0,0,12,8];
    board[7] = [9,11,0,0,0,0,12,10];
}
setInterval(function() {
    io.emit('playeramount', players);
}, 100)
io.on('connection', (socket) => {
    players++;
    if (players < 3)
    {
        var packet = {
            board: board,
            color: ConvertBool(players - 1),
            yourTurn: ConvertBool(players - 1)
        };
        socket.emit('RecieveBoard', packet);
        console.log('connection');
    }
    socket.on('change', (data) => {
        board[data.x][data.y] = data.change;
        board[data.x1][data.y1] = data.change1;
        if (turn) {
            turn = false;
        } else {
            turn = true;
        }
        var packet = {
            turn: turn,
            board: board
        };
        io.emit('nextturn', packet);
    });
});
function ConvertBool (value) {
    if (value == 0) {
        return false;
    }
    return true;
}
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/../public'));
app.use(express.static(__dirname + '/../bower_components'));
app.use(express.static(__dirname + '/../node_modules'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/../public/index.html');
});

io.on('connection', function(socket){
    sendMessageToClient = function (data) {
        io.emit('message', JSON.stringify(data));
    };
    socket.on('message', function(msg){
        var msg = JSON.parse(msg);
        if (msg.event) {
            eventEmitter.emit(msg.event, msg.data);
        }
    });
});

http.listen(8000, function(){
    console.log('listening on *:8000');
});

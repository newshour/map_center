var portNumber = 8000,
    app = require("http").createServer(),
    io = require("socket.io").listen(app),
    fs = require("fs"),
    currentMapState;

app.listen(portNumber);

io.sockets.on("connection", function (socket) {

    // If a client connects after the map's state has been changed at least
    // once, immediately send that state to the client
    if (currentMapState) {
        socket.emit("changeVotes", currentMapState);
    }

    socket.on("changeVotes", function (data) {
        currentMapState = data;
        io.sockets.emit("changeVotes", data);
    });
});

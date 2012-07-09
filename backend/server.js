var portNumber = 8000,
    app = require("http").createServer(),
    io = require("socket.io").listen(app),
    fs = require("fs");

app.listen(portNumber);

io.sockets.on("connection", function (socket) {
    socket.on("changeVotes", function (data) {
        io.sockets.emit("changeVotes", data);
        console.log(data);
    });
});

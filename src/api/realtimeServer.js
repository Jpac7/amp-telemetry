const sio = require("socket.io");
let io;

exports.getInstance = function() {
  return io;
};

exports.start = function(server) {
  io = sio(server);

  io.on("connection", client => {
    console.log("Client connected on socket.io...");

    client.on("disconnect", () => {
      console.log("Client disconnected from socket.io...");
    });
  });
  return io;
};

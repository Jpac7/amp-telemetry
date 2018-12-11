const io = require("../realtimeServer").getInstance();

module.exports = function(req, res, next) {
  const { startedOn, stream, player } = req.body;

  if (startedOn && stream && player) {
    io.sockets.emit("new-telemetry", req.body);
  }
  next();
};

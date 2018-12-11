const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const server = require("http").createServer(app);
const io = require("./realtimeServer").start(server);
const CORSMiddleware = require("./middlewares/CORSPolicies");
const config = require("./config");

app.use(CORSMiddleware);

app.use(bodyParser.json({ type: "*/*" }));

app.use(express.static(`${__dirname}/node_modules`));

app.use(require("./routes"));

mongoose.connection.on("error", console.error.bind(console, "MongoDB connection error:"));

mongoose.connect(
  config.DB_URL,
  { useNewUrlParser: true, useCreateIndex: true },
  err => {
    if (!err) {
      const port = process.env.port || config.DEFAULT_PORT;
      server.listen(port, () => console.log(`API running on port ${port}.`));
    }
  }
);

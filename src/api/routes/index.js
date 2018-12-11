const indexRouter = require("express").Router();

indexRouter.use("/telemetry-management", require("./telemetryRoute"));

indexRouter.get("/", function(req, res) {
  res.status(200).json({ message: "Hello world!" });
});

indexRouter.get("*", function(req, res) {
  res.redirect("/");
});

module.exports = indexRouter;

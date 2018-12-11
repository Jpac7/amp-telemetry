"use strict";

const router = require("express").Router();
const telemetryController = require("../controllers/telemetryController");
const telemetryIO = require("../middlewares/telemetryIO");

router.get("/video-streaming", telemetryController.allTelemetries);

router.post("/video-streaming", telemetryIO, telemetryController.upsertTelemetry);

router.get("/video-streaming/:startedOn", telemetryController.fetchTelemetry);

module.exports = router;

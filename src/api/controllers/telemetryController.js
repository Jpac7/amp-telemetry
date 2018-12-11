const telemetryModel = require("../models/telemetryModel");

exports.upsertTelemetry = (req, res) => {
  const { startedOn: reqStarted, stream: reqStream, player: reqPlayer } = req.body;

  if (!reqStarted || !reqStream || !reqPlayer) {
    return res.status(400).json({ status: false });
  }

  telemetryModel.findOne({ startedOn: reqStarted }, (err, doc) => {
    if (err) {
      return res.status(500).json({ status: false });
    }

    if (!doc) {
      // Creating document
      telemetryModel.create(req.body, (err, created) => {
        if (err || !created) {
          return res.status(500).json({ status: false });
        }
        res.status(200).json({ status: true });
      });
    } else {
      // Updating existing document
      for (let prop of Object.keys(doc.stream.history)) {
        if (reqStream.history && reqStream.history.hasOwnProperty(prop)) {
          doc.stream.history[prop].push(...reqStream.history[prop]);
        }
      }

      for (let prop of Object.keys(doc.player.events)) {
        if (reqPlayer.events && reqPlayer.events.length) {
          doc.player.events[prop] = reqPlayer.events[prop];
        }
      }

      if (reqPlayer.statistics) {
        doc.player.statistics.push(reqPlayer.statistics);
      }

      if (reqPlayer.errors) {
        doc.player.errors.push(...reqPlayer.errors);
      }

      doc.save((err, saved) => {
        if (err || !saved) {
          return res.status(500).json({ status: false });
        }
        res.status(200).json({ status: true });
      });
    }
  });
};

exports.allTelemetries = function(req, res) {
  telemetryModel
    .find({})
    .sort({ startedOn: 1 })
    .select({ _id: 0, __v: 0 })
    .exec((err, docs) => {
      if (err) {
        return res.status(500).json({ status: false });
      }
      res.status(200).json({ status: true, data: docs });
    });
};

exports.fetchTelemetry = function(req, res) {
  const { startedOn } = req.params;
  console.log("STARTED:", startedOn, new Date(startedOn));
  telemetryModel
    .findOne({ startedOn })
    .select({ _id: 0, __v: 0 })
    .exec((err, doc) => {
      console.log("ERR:", err, "DOC:", doc);
      if (err) {
        return res.status(500).json({ status: false });
      }
      res.status(200).json({ status: true, data: doc });
    });
};

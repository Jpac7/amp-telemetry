const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  startedOn: {
    type: Date,
    default: Date.now,
    unique: true
  },
  stream: {
    info: {
      manifestUrl: String,
      protocol: String,
      videos: [{ bitrate: Number, height: Number, width: Number }],
      audios: [{ bitrate: Number }],
      subtitles: [String]
    },
    history: {
      video: [{ bitrate: Number, bytes: Number, fragments: Number, failed: Number }],
      audio: [{ bitrate: Number, bytes: Number, fragments: Number, failed: Number }],
      bitrates: [{ bitrate: Number, timestamp: Date }],
      subtitles: [{ language: String, timestamp: Date }]
    }
  },
  player: {
    statistics: [
      {
        bufferingTime: Number,
        avgBuffer: Number
      }
    ],
    events: {
      buffering: [Date],
      ended: [Date],
      fullscreenChange: [Date],
      pause: [Date],
      play: [Date],
      skip: [Date],
      volumeChange: [Date]
    },
    errors: [{ id: Number, timestamp: Date }]
  }
});

module.exports = mongoose.model("Streaming", schema);

(function() {
  var API_URL = "http://localhost:3007/telemetry-management/video-streaming";

  amp.plugin("telemetry", function(options) {
    var player = this;
    var startedOn;
    var intervalId;
    var currentSubtitle;

    var telemetryPeriod = (options.period || 30) * 1000;

    /* ------------------------------------------
     Data Structures w/ respective data handlers
    --------------------------------------------- */
    var streamInfo = {};

    var streamHistory = {
      video: [],
      audio: [],
      bitrates: [],
      subtitles: [],
      handleDownloadCompleted: function(type, bitrate, bytes) {
        var el = this._getBitrate(type, bitrate);
        el.bytes += bytes;
        el.fragments++;
      },
      handleDownloadFailed: function(type, bitrate) {
        var el = this._getBitrate(type, bitrate);
        el.failed++;
      },
      handleBitrateChanged: function() {
        var timestamp = Date.now();
        var bitrate = player.currentDownloadBitrate();
        this.bitrates.push({ bitrate, timestamp });
      },
      handleSubtitleChanged: function() {
        var now = Date.now();
        var selected = player.getCurrentTextTrack();

        // Skipping duplicate events
        if (!selected || selected.language === currentSubtitle) {
          return;
        }

        this.subtitles.push({ language: selected.language, timestamp: now });
        currentSubtitle = selected.language;
      },
      restart: function() {
        this.video = [];
        this.audio = [];
        this.bitrates = [];
        this.subtitles = [];
      },
      _getBitrate: function(type, bitrate) {
        var index = this[type]
          .map(function(el) {
            return el.bitrate;
          })
          .indexOf(bitrate);

        if (index === -1) {
          return this._insertBitrate(type, bitrate);
        }
        return this[type][index];
      },
      _insertBitrate: function(type, bitrate) {
        var newBitrate = {
          bytes: 0,
          fragments: 0,
          failed: 0,
          bitrate
        };
        this[type].push(newBitrate);
        return newBitrate;
      }
    };

    var playerStats = {
      bufferingState: false,
      startTime: 0,
      totalTime: 0,
      bufferSum: 0,
      bufferCount: 0,
      handleWaiting: function() {
        this.startTime = Date.now();
        this.bufferingState = true;
      },
      handlePlaying: function() {
        if (this.bufferingState) {
          this.totalTime += Date.now() - this.startTime;
          this.bufferingState = false;
        }
      },
      getBufferingDuration: function() {
        if (this.bufferingState) {
          return Date.now() - this.startTime;
        }
        return this.totalTime;
      },
      addBufferLevel: function(buffer) {
        this.bufferSum += buffer;
        this.bufferCount++;
      },
      calculateAvgBuffer: function() {
        return (this.bufferSum * 1000) / this.bufferCount || 0;
      },
      restart: function() {
        if (this.bufferingState) {
          this.startTime = Date.now();
        } else {
          this.startTime = 0;
        }
        this.totalTime = 0;
        this.bufferSum = 0;
        this.bufferCount = 0;
      }
    };

    var playerEvents = {
      pause: [],
      skip: [],
      play: [],
      waiting: [],
      fullscreenchange: [],
      volumechange: [],
      ended: [],
      handlePlayerEvent: function(type) {
        this[type].push(Date.now());
      }
    };

    var playerErrors = {
      errors: [],
      handleError: function() {
        var now = Date.now();
        this.errors.push({
          id: player.error().code.toString(16),
          timestamp: now
        });
      },
      restart: function() {
        this.errors = [];
      }
    };

    /* ------------------------------------------
     Functions
    --------------------------------------------- */
    // Creates a telemetry object reporting the current period
    var createTelemetryObj = function() {
      return {
        startedOn,
        stream: {
          info: streamInfo,
          history: {
            video: streamHistory.video,
            audio: streamHistory.audio,
            bitrates: streamHistory.bitrates,
            subtitles: streamHistory.subtitles
          }
        },
        player: {
          statistics: {
            bufferingTime: playerStats.getBufferingDuration(),
            avgBuffer: playerStats.calculateAvgBuffer()
          },
          events: {
            pause: playerEvents.pause,
            skip: playerEvents.skip,
            play: playerEvents.play,
            buffering: playerEvents.waiting,
            fullscreenChange: playerEvents.fullscreenchange,
            volumeChange: playerEvents.volumechange,
            ended: playerEvents.ended
          },
          errors: playerErrors.errors
        }
      };
    };

    var setupListeners = function() {
      // send data when page is closed by the user, on every browser.
      window.addEventListener("onbeforeunload", exit, false);

      player.addEventListener(amp.eventName.loadedmetadata, handleMetadata);
      player.addEventListener(amp.eventName.disposing, exit);
      player.addEventListener(amp.eventName.error, function() {
        playerErrors.handleError();
      });
      player.addEventListener(amp.eventName.downloadbitratechanged, function() {
        streamHistory.handleBitrateChanged();
      });
      player.addEventListener(amp.eventName.waiting, function(e) {
        playerStats.handleWaiting();
        playerEvents.handlePlayerEvent(e.type);
      });
      player.addEventListener(amp.eventName.playing, function() {
        playerStats.handlePlaying();
      });
      player.addEventListener(amp.eventName.pause, function(e) {
        playerEvents.handlePlayerEvent(e.type);
      });
      player.addEventListener(amp.eventName.skip, function(e) {
        playerEvents.handlePlayerEvent(e.type);
      });
      player.addEventListener(amp.eventName.play, function(e) {
        playerEvents.handlePlayerEvent(e.type);
      });
      player.addEventListener(amp.eventName.fullscreenchange, function(e) {
        playerEvents.handlePlayerEvent(e.type);
      });
      player.addEventListener(amp.eventName.volumechange, function(e) {
        playerEvents.handlePlayerEvent(e.type);
      });
      player.addEventListener(amp.eventName.ended, function(e) {
        playerEvents.handlePlayerEvent(e.type);
        exit();
      });
    };

    var handleMetadata = function() {
      var videoBuffer = this.videoBufferData();
      var audioBuffer = this.audioBufferData();

      if (videoBuffer) {
        videoBuffer.addEventListener(amp.bufferDataEventName.downloadcompleted, function() {
          var downloaded = videoBuffer.downloadCompleted;
          streamHistory.handleDownloadCompleted("video", downloaded.mediaDownload.bitrate, downloaded.totalBytes);

          playerStats.addBufferLevel(videoBuffer.bufferLevel);
        });

        videoBuffer.addEventListener(amp.bufferDataEventName.downloadfailed, function() {
          var failed = videoBuffer.downloadFailed;
          streamHistory.handleDownloadFailed("video", failed.mediaDownload.bitrate);
        });
      }

      if (audioBuffer) {
        audioBuffer.addEventListener(amp.bufferDataEventName.downloadcompleted, function() {
          var downloaded = audioBuffer.downloadCompleted;
          streamHistory.handleDownloadCompleted("audio", downloaded.mediaDownload.bitrate, downloaded.totalBytes);
        });

        audioBuffer.addEventListener(amp.bufferDataEventName.downloadfailed, function() {
          var failed = audioBuffer.downloadFailed;
          streamHistory.handleDownloadFailed("audio", failed.mediaDownload.bitrate);
        });
      }

      this.textTracks().addEventListener("change", function() {
        streamHistory.handleSubtitleChanged();
      });

      // Creating and assigning the StreamInfo object.
      //It only runs one time during the plugin lifecycle.
      streamInfo = {
        manifestUrl: this.currentSrc(),
        protocol: this.currentType(),
        videos: this.currentVideoStreamList().streams[this.currentVideoStreamList().selectedIndex].tracks.map(function(
          el
        ) {
          return { bitrate: el.bitrate, height: el.height, width: el.width };
        }),
        audios: this.currentAudioStreamList().streams.map(function(el) {
          return { bitrate: el.bitrate };
        }),
        subtitles: Array.prototype.slice.call(this.textTracks()).map(function(sub) {
          return sub.language;
        }),
        isLive: this.isLive()
      };
    };

    var init = function() {
      console.log("plugin telemetry initialized with player ", player);

      // Getting a timestamp useful to identify this video streaming instance
      startedOn = Date.now();

      setupListeners();

      intervalId = setInterval(function() {
        // create data object
        var data = createTelemetryObj();

        // upload to server. When it fails, retries more 20 times.
        uploadData(data);

        // Cleanup data
        streamHistory.restart();
        playerStats.restart();
        playerErrors.restart();
      }, telemetryPeriod);
    };

    var exit = function() {
      clearInterval(intervalId);
      uploadData(createTelemetryObj());
    };

    var uploadData = function(data, retries) {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200 && JSON.parse(xhr.responseText).status) {
          console.log("upload success:", data);
        } else {
          retries = retries ? --retries : 20;
          if (retries > 0) {
            setTimeout(100, function() {
              uploadData(data, retries);
            });
          }
        }
      };
      xhr.open("POST", API_URL);
      xhr.setRequestHeader("Content-type", "application/json");
      xhr.send(JSON.stringify(data));
    };

    // initialize the plugin
    init();
  });
}.call(this));

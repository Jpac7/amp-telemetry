import React, { Component } from "react";

const StreamingInfo = ({ info }) => {
  return (
    <div>
      <p>
        <strong>Manifest URL:</strong> {info.manifestUrl}
      </p>
      <p>
        <strong>Protocol:</strong> {info.protocol}
      </p>
      <p>
        <strong>Available Videos:</strong>
        {info.videos.map(
          (el, index) => ` ${el.bitrate} bps (${el.width}x${el.height})${index !== info.videos.length - 1 ? "," : ""}`
        )}
      </p>
      <p>
        <strong>Available Audios:</strong>
        {info.audios.map((el, index) => ` ${el.bitrate} bps ${index !== info.audios.length - 1 ? "," : ""}`)}
      </p>
      <p>
        <strong>Subtitles:</strong>{" "}
        {info.subtitles.map((el, index) => ` ${el}${index !== info.subtitles.length - 1 ? "," : ""}`)}
      </p>
      <p>
        <strong>Live or demand:</strong> {info.isLive ? "Live" : "on Demand"}
      </p>
    </div>
  );
};

export default StreamingInfo;

import React, { Component } from "react";
import StreamingInfo from "./StreamingInfo";
import DownloadTable from "./DownloadTable";
import BitratesSwitch from "./BitratesSwitchTable";
import SubtitlesSwitch from "./SubtitlesSwitchTable";
import BufferingTable from "./BufferingTable";
import ErrorsTable from "./ErrorsTable";
import EventsTable from "./EventsTable";

const StreamingSelected = ({ selected }) => {
  return (
    <div>
      {selected ? (
        <React.Fragment>
          <h4 className="mb-3 bg-dark text-light p-2">Streaming information</h4>
          <StreamingInfo info={selected.stream.info} />
          <hr />
          <h4 className="mb-3 mt-3 bg-dark text-light p-2">Last period telemetry</h4>
          <h5>Video Download</h5>
          <DownloadTable history={selected.stream.history.video} />
          <h5>Audio Download</h5>
          <DownloadTable history={selected.stream.history.audio} />
          <h5>Bitrates switch</h5>
          <BitratesSwitch history={selected.stream.history.bitrates} />
          <h5>Subtitles switch</h5>
          <SubtitlesSwitch history={selected.stream.history.subtitles} />
          <h5>Player statistics</h5>
          <BufferingTable statistics={selected.player.statistics} />
          <h5>Errors</h5>
          <ErrorsTable errors={selected.player.errors} />
          <hr />
          <h4 className="mb-3 mt-3 bg-dark text-light p-2">Events</h4>
          <EventsTable events={selected.player.events} />
        </React.Fragment>
      ) : (
        <div className="text-center mt-5 pt-5">Please, wait a video streaming to start...</div>
      )}
    </div>
  );
};

export default StreamingSelected;

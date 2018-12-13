import React, { Component } from "react";
import { formatTimestamp } from "../utils/dateUtils";

class SubtitlesSwitch extends Component {
  render() {
    return (
      <div className="table-responsive-md">
        <table className="table table-sm table-bordered text-center">
          <thead className="thead-light">
            <tr>
              <th scope="col">Language</th>
              <th scope="col">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(this.props.history).length ? (
              Object.entries(this.props.history).map(([key, { language, timestamp }]) => (
                <tr key={`${language}${key}`}>
                  <th scope="row">{language || "-"}</th>
                  <td>{formatTimestamp(new Date(timestamp)) || "-"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <th scope="row">-</th>
                <td>-</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }
}

export default SubtitlesSwitch;

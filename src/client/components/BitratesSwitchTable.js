import React, { Component } from "react";

class BitratesSwitch extends Component {
  render() {
    return (
      <div className="table-responsive-md">
        <table className="table table-sm table-bordered text-center">
          <thead className="thead-light">
            <tr>
              <th scope="col">Bitrate</th>
              <th scope="col">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(this.props.history).length ? (
              Object.entries(this.props.history).map(([key, { bitrate, timestamp }]) => (
                <tr key={`${bitrate}${key}`}>
                  <th scope="row">{bitrate || "-"}</th>
                  <td>{timestamp || "-"}</td>
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

export default BitratesSwitch;

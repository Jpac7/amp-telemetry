import React, { Component } from "react";

class DownloadTable extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="table-responsive-md">
        <table className="table table-sm table-bordered text-center">
          <thead className="thead-light">
            <tr>
              <th scope="col">Bitrate</th>
              <th scope="col">Bytes</th>
              <th scope="col">Fragments</th>
              <th scope="col">Failed</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(this.props.history).length ? (
              Object.entries(this.props.history).map(([key, { bitrate, bytes, fragments, failed }]) => {
                return (
                  <tr key={bitrate}>
                    <th scope="row">{bitrate || "-"}</th>
                    <td>{bytes || "-"}</td>
                    <td>{fragments || "-"}</td>
                    <td>{failed || "-"}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <th scope="row">-</th>
                <td>-</td>
                <td>-</td>
                <td>-</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }
}

export default DownloadTable;

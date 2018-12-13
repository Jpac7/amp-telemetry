import React, { Component } from "react";
import { formatTimestamp } from "../utils/dateUtils";

class ErrorsTable extends Component {
  render() {
    return (
      <div className="table-responsive-md">
        <table className="table table-sm table-bordered text-center">
          <thead className="thead-light">
            <tr>
              <th scope="col">Code</th>
              <th scope="col">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(this.props.errors).length ? (
              Object.entries(this.props.errors).map(([key, { id, timestamp }]) => {
                return (
                  <tr key={`${id}${timestamp}`}>
                    <th scope="row">{id || "-"}</th>
                    <td>{formatTimestamp(new Date(timestamp)) || "-"}</td>
                  </tr>
                );
              })
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

export default ErrorsTable;

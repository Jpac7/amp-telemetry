import React, { Component } from "react";
import { formatTimestamp } from "../utils/dateUtils";

class EventsTable extends Component {
  render() {
    return (
      <div className="table-responsive-md">
        <table className="table table-sm table-bordered text-center">
          <thead className="thead-light">
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(this.props.events).map(([event, timestamps]) => {
              return (
                <tr key={event}>
                  <th scope="row">{event || "-"}</th>
                  <td>
                    {timestamps.length
                      ? timestamps.map(
                          (ts, index) =>
                            `${formatTimestamp(new Date(ts))}${index !== timestamps.length - 1 ? ", " : ""}`
                        )
                      : "-"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}

export default EventsTable;

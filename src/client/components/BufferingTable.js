import React, { Component } from "react";

const BufferingTable = ({ statistics }) => {
  return (
    <div className="table-responsive-md">
      <table className="table table-sm table-bordered text-center">
        <thead className="thead-light">
          <tr>
            <th scope="col">In buffering state (ms)</th>
            <th scope="col">Avg buffer (ms)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">{statistics.bufferingTime || 0}</th>
            <th scope="row">{statistics.avgBuffer || 0}</th>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default BufferingTable;

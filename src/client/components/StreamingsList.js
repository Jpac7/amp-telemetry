import React, { Component } from "react";
import StartedOnListItem from "./StartedOnListItem";

class StreamingsList extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="list-group border-right border-dark" id="list-tab" role="tablist">
        {this.props.startedOnList.map((el, index) => (
          <StartedOnListItem key={el} index={index} startedOn={el} handleSelection={this.props.handleSelection} />
        ))}
      </div>
    );
  }
}

export default StreamingsList;

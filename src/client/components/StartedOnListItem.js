import React, { Component } from "react";
import { formatTimestamp } from "../utils/dateUtils";

class StartedOnListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabDate: formatTimestamp(new Date(props.startedOn))
    };
  }

  render() {
    return (
      <a
        className="list-group-item list-group-item-action"
        id={`list-${this.props.startedOn}-list`}
        data-toggle="list"
        href={`#list-${this.props.startedOn}`}
        role="tab"
        aria-controls="home"
        onClick={() => this.props.handleSelection(this.props.startedOn)}
      >
        {`[#${this.props.index}] - ${this.state.tabDate}`}
      </a>
    );
  }
}

export default StartedOnListItem;

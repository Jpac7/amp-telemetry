import React, { Component } from "react";

class StartedOnListItem extends Component {
  constructor(props) {
    super(props);
    const startedOnFormatted = new Date(props.startedOn);
    this.state = {
      tabDate: `${startedOnFormatted.getHours()}:${startedOnFormatted.getMinutes()}:${startedOnFormatted.getSeconds()}`
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

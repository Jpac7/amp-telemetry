import React from "react";
import ReactDOM from "react-dom";
import Navbar from "./components/Navbar";
import StreamingsList from "./components/StreamingsList";
import StreamingSelected from "./components/StreamingSelected";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { selectedStreaming: null, streamings: {} };
  }

  componentDidMount() {
    var socket = io.connect("http://localhost:3007");
    socket.on("new-telemetry", data => {
      const newState = { ...this.state };
      newState.streamings[data.startedOn] = data;
      if (!newState.selectedStreaming) {
        newState.selectedStreaming = data.startedOn;
      }
      this.setState(newState);
    });
  }

  render() {
    return (
      <div className="container">
        <header>
          <Navbar />
        </header>
        <main>
          <div className="row">
            <div className="col-3">
              <h3>Streamings</h3>
              <hr />
              <p>Select one:</p>
              <StreamingsList
                startedOnList={this.getStartedOnList()}
                handleSelection={this.handleStreamingSelection.bind(this)}
              />
            </div>
            <div className="col-9">
              <StreamingSelected selected={this.getSelectedStreaming()} />
            </div>
          </div>
        </main>
      </div>
    );
  }

  getStartedOnList() {
    return Object.entries(this.state.streamings).map(el => el[1].startedOn);
  }

  getSelectedStreaming() {
    return this.state.selectedStreaming ? this.state.streamings[this.state.selectedStreaming] : null;
  }

  handleStreamingSelection(startedOn) {
    this.setState({ selectedStreaming: startedOn });
  }
}

ReactDOM.render(<App />, document.getElementById("react-root"));

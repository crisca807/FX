// WebSocketComponent.js
import React, { Component } from 'react';

class WebSocketComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: props.message || '',
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.message !== this.props.message) {
      this.setState({ message: this.props.message });
    }
  }

  render() {
    return (
      <div className="websocket-message">
        {this.state.message}
      </div>
    );
  }
}

export default WebSocketComponent;

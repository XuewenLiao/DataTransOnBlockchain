import React, { Component } from "react";
import AxiosTest from './AxiosTest'

class News extends Component {
  constructor(props) {
    super(props);
    this.state = { };
  }

  render() {
    return (
        <div>
          <AxiosTest />
          <br/>
            News
        </div>
    );
  }
}

export default News;

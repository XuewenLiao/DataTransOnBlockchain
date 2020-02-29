import React, { Component } from "react";
// import AxiosTest from './AxiosTest'
import { List } from 'antd';
const {cacheTansLog} = require("../models/CacheData")

class News extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        {/* <AxiosTest /> */}

        <h3 style={{ margin: '16px 0' }}>Tansfer Log</h3>
        <List
          style={{marginTop:'10px',display:'inline-block',width:'800px',whiteSpace:'pre-wrap'}}
          size="large"
          header={<div>Tansfer Log</div>}
          bordered
          dataSource={cacheTansLog}
          renderItem={item => <List.Item>{item}</List.Item>}
        />
      </div>
    );
  }
}

export default News;

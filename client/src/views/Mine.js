import React, { Component } from "react";
// import AxiosTest from './AxiosTest'
import { Table } from 'antd';
const { cacheTansLog } = require("../models/CacheData")

const columns = [
  {
    title: 'Log detail',
    dataIndex: 'log',
    width: 350,
  }
]

var data = []

class Mine extends Component {
  constructor(props) {
    super(props);
    this.start();
  }

  start = () => {
    for (let i = 0; i < 100; i++) {
      data.push({
        key: i,
        log: cacheTansLog[i],
      });
    }
  }

  render() {
    return (
      <div>

        <h3 style={{ margin: '16px 0' }}>Transaction Log</h3>

        <Table
          columns={columns}
          dataSource={data}
          pagination={{ pageSize: 50 }}
          scroll={{ y: 240 }}
        />

        {/* <AxiosTest /> */}


      </div>
    );
  }
}

export default Mine;

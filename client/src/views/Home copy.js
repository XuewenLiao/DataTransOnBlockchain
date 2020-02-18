import React, { Component } from "react";
import { Table, Button } from 'antd';
import { findData } from '../methodTool'


const columns = [
  {
    title: 'Username',
    dataIndex: 'username',
    width: 100,
  },
  {
    title: 'Password',
    dataIndex: 'password',
    width: 80,
  },
  {
    title: 'Location',
    dataIndex: 'location',
    width: 200,
  },
];

const data = [];

class Home extends React.Component {
  state = {
    selectedRowKeys: [], // Check here to configure the default column
    loading: false,
    data: []
  };

  componentDidMount() {
    this.start();
  }

  start = () => {
    //后台拿数据
    this.setState({ loading: true });
    // ajax request after empty completing
    findData().then(res => {

        this.setState({
          data: [...res, data.map(val => {
            // val.key = val.id;
            return val;
          })],
        
        selectedRowKeys: [],
        loading: false,
      });
    })
  };

  onSelectChange = selectedRowKeys => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  };


  render() {
    const { loading, selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const hasSelected = selectedRowKeys.length > 0;
    return (
      <div>
        <div style={{ marginBottom: 16 }}>
          <Button type="primary" onClick={this.start} disabled={!hasSelected} loading={loading}>
            Reload
          </Button>
          <span style={{ marginLeft: 8 }}>
            {hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}
          </span>
        </div>
        <Table rowSelection={rowSelection} columns={columns} dataSource={this.state.data} />
      </div>
    );
  }

}

export default Home;

// class Home extends Component {
//   constructor(props) {
//     super(props);
//     this.state = { };
//   }

//   render() {
//     return (
//         <div>

//           home:set table

//         </div>
//     );
//   }
// }

// export default Home;

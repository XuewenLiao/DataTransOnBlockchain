import React, { Component } from "react";
import { Table, Button, Form, Input, Icon } from 'antd';
import { getOrigData, calcuQod, calcuRewards } from '../methodTool'

const FormItem = Form.Item
const columns = [
  {
    title: 'User Address',
    dataIndex: 'uaddress',
    width: 100,
  },
  {
    title: 'Data Date',
    dataIndex: 'datadate',
    width: 80,
  },
  {
    title: 'Collection Place',
    dataIndex: 'dataplace',
    width: 80,
  },
  {
    title: 'Data Hash',
    dataIndex: 'ipfsdatahash',
    width: 100,
  },
  {
    title: 'Sell status',
    dataIndex: 'hassell',
    width: 100,
  },
];

const data = [];

class Home extends React.Component {
  state = {
    selectedRowKeys: [], // Check here to configure the default column
    loading: false,
    rewardValue: '',
    data: []
  };

  componentDidMount() {
    this.start();
  }

  start = () => {
    //后台拿数据
    this.setState({ loading: true });
    // ajax request after empty completing
    getOrigData().then(res => {

      //设置卖出状态
      for (var i in res) {
        if (res[i].hassell == false) {
          res[i].hassell = 'Unsold'
        } else {
          res[i].hassell = 'Sold out'
        }
      }

      this.setState({
        data: [...res, data.map(val => {
          return val
        })],

        selectedRowKeys: [],
        loading: false,
      });

    })
  };

  uploadToServer = () => {
    var dataIdArray = []
    var selectedRows = this.state.selectedRowKeys
    for (var i in selectedRows) {
      var data = this.state.data
      dataIdArray.push(data[selectedRows[i]]._id)
    }
    console.log("datasArray==", dataIdArray)

    calcuQod(dataIdArray).then(res => {
      console.log("res==", res)

      console.log("qodData==", res);
      console.log("type==", typeof (res));
      alert(JSON.stringify(res))
    })

  }

  calcuReward = () => {
    calcuRewards(this.state.rewardValue).then(res => {
      console.log("reward==", res);
      console.log("type==", typeof (res));
      alert(JSON.stringify(res))
    })
  }

  onValueChange = (event) => {
    this.setState({rewardValue : event.target.value})
    console.log("eventrewardValue==",event.target.value)
  }

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
          <Button type="primary" onClick={this.uploadToServer} disabled={!hasSelected} loading={loading}>
          CalcuQod
          </Button>

          <span style={{ marginLeft: 8 }}>
            {hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}
          </span>
          <span style={{ float: "right" }}>
            <Button type="primary" onClick={this.calcuReward} disabled={!hasSelected} loading={loading}>
              CalcuReward
          </Button>
          </span>
          <span style={{ float: "right" }}>
            <FormItem>
              <Input size="default size" prefix={<Icon type="pay-circle" style={{fontSize: 15,textAlign:"center"}} />} placeholder="Enter incentive amount" value={this.state.rewardValue} onChange={this.onValueChange}/>
            </FormItem>
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

import React, { Component } from "react";
import { Table, Button, Form, Input, Icon } from 'antd';
import { getOrigData, calcuQod, calcuRewards } from '../methodTool'
import QodRewardContract from "../contracts/QodReward.json";
import getWeb3 from "../getWeb3";

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
    data: [],
    web3: null, accounts: null, contract: null
  };

  componentDidMount = async () => {
    this.connectBlockChain();
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

  calcuAndSaveQod = () => {
    var dataIdArray = []
    var selectedRows = this.state.selectedRowKeys
    for (var i in selectedRows) {
      var data = this.state.data
      dataIdArray.push(data[selectedRows[i]]._id)
    }
    console.log("datasArray==", dataIdArray)

    //计算qod
    calcuQod(dataIdArray).then(res => {
      console.log("res==", res)
      console.log("qodData==", res);
      console.log("type==", typeof (res));
      //存储到区块链
      this.saveQodToBlockChain(res);
    })

  }

  saveQodToBlockChain = async (qodData) => {
    const { accounts, contract } = this.state;

    //上传至区块链
    var saveQodLog = []
    for (var i in qodData) {
      var address = qodData[i].uaddress
      console.log("address==", address)
      var qod = JSON.stringify(qodData[i].qod)
      console.log("qod==", qod)
      console.log("qodType==", typeof (qod))

      await contract.methods.calcuQod(address, qod).send({ from: this.state.accounts[0], gas: 3000000, gasPrice: '10' }) //from: '0x15f13625bf2aE99CebF1BE776e18835bF93Ea623'
        .on('transactionHash', function (hash) {
          console.log("SaveQodTransHash==", hash)

          let logInfo = {}
          logInfo.address = address
          logInfo.SaveQodTransHash = hash
          saveQodLog.push(logInfo)

        })
        .on('receipt', function (receipt) {
          console.log("receipt==", receipt)
        })

    }
    alert(JSON.stringify(saveQodLog))
  }



  connectBlockChain = async () => {
    // state = { isSaveIpfsSuccess: false, web3: null, accounts: null, contract: null };
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
      console.log("accounts==", accounts)

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      console.log("networkId==", networkId)
      const deployedNetwork = QodRewardContract.networks[networkId];
      const instance = new web3.eth.Contract(
        QodRewardContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      // this.setState({ web3, accounts, contract: instance }, this.SaveIpfsHashInBlockChain);
      this.setState({ web3, accounts, contract: instance });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  }

  SaveIpfsHashInBlockChain = async () => {
    const { accounts, contract } = this.state;

    //处理数据
    // var testSelectData = [{ "address": "0x276ea10526355d106a1abb3853b41aa9adc9af54", "ipfsArray": ["a11", "a12", "a13"] }]

    var selectedRows = this.state.selectedRowKeys
    var data = this.state.data
    var selectedData = []
    for (var i in selectedRows) {
      let eachData = {}
      eachData.address = data[selectedRows[i]].uaddress
      eachData.ipfsdatahash = data[selectedRows[i]].ipfsdatahash
      selectedData.push(eachData)
    }
    console.log("selectedData==", selectedData)

    var dataArray = []
    var tempwData = JSON.parse(JSON.stringify(selectedData)) //深拷贝
    for (var i in selectedData) {
      var aToi = {}
      if (tempwData[i].address == null) {
        continue
      }
      aToi.address = selectedData[i].address
      var ipfses = []
      for (var j in selectedData) {
        if (selectedData[j].address == selectedData[i].address) {
          ipfses.push(selectedData[j].ipfsdatahash)

          tempwData[j].address = null
        } else {
          continue
        }
      }
      aToi.ipfsArray = ipfses
      dataArray.push(aToi)
    }
    console.log("dataArray==", dataArray)


    //上传至区块链
    var saveIpfsLog = []
    for (var i in dataArray) {
      var address = dataArray[i].address
      console.log("address==", typeof (address))
      var ipfsArray = dataArray[i].ipfsArray
      //对象转数组
      var ipfsArr = Array.from(ipfsArray)

      console.log("ipfsArrayType==", typeof (ipfsArr))

      await contract.methods.registerAsProvider(ipfsArr, address).send({ from: this.state.accounts[0], gas: 3000000, gasPrice: '10' }) //from: '0x15f13625bf2aE99CebF1BE776e18835bF93Ea623'
        .on('transactionHash', function (hash) {
          console.log("transactionHash==", hash)

          let logInfo = {}
          logInfo.address = address
          logInfo.SaveIpfsTransHash = hash
          saveIpfsLog.push(logInfo)

        })
        .on('receipt', function (receipt) {
          console.log("receipt==", receipt)
        })

    }
    alert(JSON.stringify(saveIpfsLog))

  }


  calcuRewardC = async () => {
    const { accounts, contract } = this.state;
    //奖金额公布到区块链
    var publishRewardsLog = {}
    console.log("rewardValue==", this.state.rewardValue)
    console.log("typerewardValue==", typeof (this.state.rewardValue))
    await contract.methods.publishTotalMoney(Number(this.state.rewardValue)).send({ from: this.state.accounts[0], gas: 3000000, gasPrice: '10' }) //from: '0x15f13625bf2aE99CebF1BE776e18835bF93Ea623'
      .on('transactionHash', function (hash) {
        console.log("publishRewardHash==", hash)

        publishRewardsLog.address = accounts[0]
        publishRewardsLog.publishRewardHash = hash

      })
      .on('receipt', function (receipt) {
        console.log("receipt==", receipt)
      })

    alert(JSON.stringify(publishRewardsLog))


    //计算每人的激励金额
    // var calcuRewardByConsumerLog = []
    calcuRewards(this.state.rewardValue).then(res => {
      console.log("reward==", res);
      console.log("type==", typeof (res));
      alert(JSON.stringify(res))
      this.saveRewardByC(res)

    })


  }

  saveRewardByC = async (res) => {
    const { accounts, contract } = this.state;
    //暂存到区块链
    var calcuRewardByConsumerLog = []
    console.log("rewardValue==", this.state.rewardValue)
    console.log("typerewardValue==", typeof (this.state.rewardValue))
    for (var i in res) {
      var address = res[i].uaddress
      var reward = res[i].reward
      await contract.methods.calcuRewardByConsumer(address, reward).send({ from: this.state.accounts[0], gas: 3000000, gasPrice: '10' }) //from: '0x15f13625bf2aE99CebF1BE776e18835bF93Ea623'
        .on('transactionHash', function (hash) {
          console.log("calcuRewardByConsumerHash==", hash)
          let log = {}
          log.address = address
          log.calcuRewardByConsumerHash = hash
          calcuRewardByConsumerLog.push(log)
          // console.log("calcuRewardByConsumerLog==",JSON.stringify(calcuRewardByConsumerLog))
          // alert(JSON.stringify(calcuRewardByConsumerLog))
        })
        .on('receipt', function (receipt) {
          console.log("receipt==", receipt)
        })

    }

    console.log("calcuRewardByConsumerLog==", JSON.stringify(calcuRewardByConsumerLog))
    alert(JSON.stringify(calcuRewardByConsumerLog))
  }

  calcuRewardP = () => {

    //计算每人的激励金额
    calcuRewards(this.state.rewardValue).then(res => {
      console.log("reward==", res);
      console.log("type==", typeof (res));
      alert(JSON.stringify(res))
      this.saveRewardByP(res)

    })

  }

  saveRewardByP = async (res) => {
    const { contract } = this.state;

    var calcuRewardByProviderLog = []
    //暂存到区块链
    console.log("rewardValue==", this.state.rewardValue)
    console.log("typerewardValue==", typeof (this.state.rewardValue))
    for (var i in res) {
      var address = res[i].uaddress
      var reward = res[i].reward
      await contract.methods.calcuRewardByProvider(address, reward).send({ from: this.state.accounts[0], gas: 3000000, gasPrice: '10' }) //from: '0x15f13625bf2aE99CebF1BE776e18835bF93Ea623'
        .on('transactionHash', function (hash) {
          console.log("calcuRewardByProviderHash==", hash)
          let log = {}
          log.address = address
          log.calcuRewardByProviderHash = hash
          calcuRewardByProviderLog.push(log)

        })
        .on('receipt', function (receipt) {
          console.log("receipt==", receipt)
        })
    }
    alert(JSON.stringify(calcuRewardByProviderLog))
  }

  providerVerifiedReward = async () => {
    const { accounts, contract } = this.state;
    //奖金额公布到区块链
    var providerVerifiedRewardLog = {}
    console.log("rewardValue==", this.state.rewardValue)
    console.log("typerewardValue==", typeof (this.state.rewardValue))
    await contract.methods.providerVerifiedReward().send({ from: this.state.accounts[0], gas: 3000000, gasPrice: '10' }) //from: '0x15f13625bf2aE99CebF1BE776e18835bF93Ea623'
      .on('transactionHash', function (hash) {
        console.log("providerVerifiedRewardHash==", hash)

        providerVerifiedRewardLog.address = accounts[0]
        providerVerifiedRewardLog.publishRewardHash = hash

      })
      .on('receipt', function (receipt) {
        console.log("receipt==", receipt)
      })

    alert(JSON.stringify(providerVerifiedRewardLog))
  }

  tansfer = async () => {
    const { accounts, contract } = this.state;
    var transferLog = {}
 
    await contract.methods.transferMoney().send({ from: this.state.accounts[0], gas: 3000000, gasPrice: '80' ,value:20}) //from: '0x15f13625bf2aE99CebF1BE776e18835bF93Ea623'
      .on('transactionHash', function (hash) {
        console.log("providerVerifiedRewardHash==", hash)

        transferLog.address = accounts[0]
        transferLog.publishRewardHash = hash

      })
      .on('receipt', function (receipt) {
        console.log("receipt==", receipt)
      })

    alert(JSON.stringify(transferLog))
  }

  isAccept = async () => {
    const { accounts, contract } = this.state;
    var isAcceptLog = {}
 
    await contract.methods.isAcceptReward().send({ from: this.state.accounts[0], gas: 3000000, gasPrice: '10' }) //from: '0x15f13625bf2aE99CebF1BE776e18835bF93Ea623'
      .on('transactionHash', function (hash) {
        console.log("providerVerifiedRewardHash==", hash)

        isAcceptLog.address = accounts[0]
        isAcceptLog.publishRewardHash = hash

      })
      .on('receipt', function (receipt) {
        console.log("receipt==", receipt)
      })

    alert(JSON.stringify(isAcceptLog))
  }

  onValueChange = (event) => {
    this.setState({ rewardValue: event.target.value })
    console.log("eventrewardValue==", event.target.value)
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

          <Button type="primary" onClick={this.SaveIpfsHashInBlockChain} disabled={!hasSelected} loading={loading}>
            SaveIpfsHashInBlockChain
          </Button>
          <span style={{ marginLeft: 8 }}>
            {hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}
          </span>

          <span style={{ float: "right" }}>
            <Button type="primary" onClick={this.calcuRewardC} disabled={!hasSelected} loading={loading}>
              CalcuRewardByConsumer
          </Button>
          </span>
          <span style={{ float: "right" }}>
            <FormItem>
              <Input size="default size" prefix={<Icon type="pay-circle" style={{ fontSize: 15, textAlign: "center" }} />} placeholder="Enter incentive amount" value={this.state.rewardValue} onChange={this.onValueChange} />
            </FormItem>
          </span>

        </div>

        <div style={{marginBottom: 16 }}>
          < Button type="primary" onClick={this.calcuAndSaveQod} disabled={!hasSelected} loading={loading}>
            CalcuQod
          </Button>
          <span style={{ marginLeft: 8 }}>
            <Button type="primary" onClick={this.calcuRewardP} disabled={!hasSelected} loading={loading}>
              CalcuRewardByProvider
          </Button>
          </span>
          <span style={{ marginLeft: 8 }}>
            <Button type="primary" onClick={this.providerVerifiedReward} disabled={!hasSelected} loading={loading}>
              providerVerified
          </Button>
          </span>

          <span style={{ marginLeft: 8 }}>
            <Button type="primary" onClick={this.isAccept} disabled={!hasSelected} loading={loading}>
            JugeAccept
          </Button>
          </span>
          <span style={{ marginLeft: 8 }}>
            <Button type="primary" onClick={this.tansfer} disabled={!hasSelected} loading={loading}>
              Transfer
          </Button>
          </span>
         
        </div>        

        <Table rowSelection={rowSelection} columns={columns} dataSource={this.state.data} />
      </div >
    );
  }

}

export default Home;

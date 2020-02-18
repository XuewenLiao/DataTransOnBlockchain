import Button from 'antd/lib/button';
import { getOrigData,sendData } from '../methodTool'
const React = require('react')

const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient('/ip4/127.0.0.1/tcp/5001')

let origData;
class UploadManage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isSuccess: null,
      origData: null,

    }
  }
  componentDidMount() {
    this.start();

  }


  start = () => {
    getOrigData().then(res => {
      console.log("res==", res)
      // origData = res
      this.setState({
        origData: res
      });
      console.log("origData==", this.state.origData);
      console.log("type==", typeof (this.state.origData));
    })

  };



  uploadIpfs = async (origData) => {
    console.log(" uploadorigData==", origData);
    console.log(" uploadtype==", typeof (origData));

    for (var i in origData) {

      const source = JSON.stringify(origData[i]['datacontent']);
      console.log("eachData.datacontent==", source);
      console.log("sourceType", typeof (source));

      //上传IPFS获取hash
      for await (const file of ipfs.add(source)) {
        console.log("file", file)
        const hash = file.path
        console.log("file_hash: ", hash)

        //将Hash存到origData的ipfsdatahash字段
        origData[i].ipfsdatahash = hash
        console.log("origData[i]==", origData[i])
      }
    }

    this.setState({ isSuccess: "上传成功" })
    console.log("newData==", origData)

    //发送数据给后台
      sendData(origData).then(res => {
        console.log("sendRes==", res.result)
      })
  }


  render() {
    return <div style={{ textAlign: 'center' }}>
      <Button type="primary" onClick={() => this.uploadIpfs(this.state.origData)}>上传至IPFS</Button>
      <p>上传状态： <strong>{JSON.stringify(this.state.isSuccess)}</strong></p>
    </div>
  }
}
export default UploadManage


// import React, { Component } from "react";

// class Product extends Component {
//   constructor(props) {
//     super(props);
//     this.state = { };
//   }

//   render() {
//     return (
//         <div>
//           Product
//         </div>
//     );
//   }
// }

// export default Product;

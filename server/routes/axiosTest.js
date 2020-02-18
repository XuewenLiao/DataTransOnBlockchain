const { TestUser } = require('../model/models')
var express = require('express');
var router = express.Router();

const ipfsClient = require('ipfs-http-client');
const ipfs = ipfsClient('/ip4/127.0.0.1/tcp/5001');
// const input = 'hello world';
const addAndPublish = async () => {

  
  const datas = { path: 'testfile2', content: 'hello world', mode: 493,mtime: new Date() };
  // const id = await ipfs.id()
  // const filesAdd = await ipfs.add(datas);
  // console.log("file", filesAdd[0]);
  console.log("datas--",datas);
  for await (const file of ipfs.add(datas)) {
    console.log("TCL: App -> forawait -> file", file)
    return file;
    // console.log("path", file.hash)
  }
}

const addFile = async ({path,content}) => {
  
  const files = { path: path, content: content };
  // const filesAdded = await ipfs.add(file);
  // return filesAdded[0];
  // console.log("file", filesAdd[0]);
  for await (const file of ipfs.add(files)) {
    console.log("TCL: App -> forawait -> file", file)
    return file;
    // console.log("path", file.hash)
  }
}

router.get('/addipfs', async (req, res) => {
  // const testusers = await TestUser.findOne();
  const fileHash = await addAndPublish();
  res.send(fileHash)

});

router.post('/postaddipfs', async (req, res) => {
  // const testusers = await TestUser.findOne();
  const data = req.body;
  console.log(data);
  const fileHash = await addFile(data);
  return res.send(fileHash);

});

router.get('/getdata', function (req, res, next) {
  addAndPublish()
  res.send('axios getData Success');
});

router.post('/postdata', function (req, res, next) {
  res.send(req.body);
});

/*async await 异步调用*/
router.get('/findindb', async (req, res) => {
  const testusers = await TestUser.find()
  res.send(testusers);
});

router.post('/inserttodb', async (req, res) => {
  const testuser = await TestUser.create({
    username: req.body.data.username,
    password: req.body.data.password,
    location: req.body.data.location
  })
  // res.send(testuser);
  res.send(testuser);
});



module.exports = router;

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/blockchaindata',{
    useCreateIndex: true,
    useNewUrlParser: true
})

const UserCollectionDataSchem = new mongoose.Schema({
    uaddress: {type: String},
    datadate: {type: String},
    dataplace: {type: String},
    datacontent:{
        placedata:{type: Number},
        collectdata: {type: Number}
    },
    ipfsdatahash: {type: String},
    hassell: {type: Boolean}
})
const UserCollectData = mongoose.model('UserCollectData',UserCollectionDataSchem)



const TestUserSchema = new mongoose.Schema({
    username: {type: String},
    password: {type: String},
    location: {type: String,unique: true}
})
const TestUser = mongoose.model('TestUser',TestUserSchema)

module.exports = { TestUser,UserCollectData }
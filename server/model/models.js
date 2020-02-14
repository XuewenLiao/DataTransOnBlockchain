const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/blockchaindata',{
    useCreateIndex: true,
    useNewUrlParser: true
})

const TestUserSchema = new mongoose.Schema({
    username: {type: String},
    password: {type: String},
    location: {type: String,unique: true}
})
const TestUser = mongoose.model('TestUser',TestUserSchema)

module.exports = { TestUser }
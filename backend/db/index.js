const mongoose = require('mongoose');
const connStr = process.env.MONGO_CONNECTION;

console.log('Connecting to MongoDB...', connStr);

mongoose.set('strictQuery', false);
mongoose.connect(connStr, {
    dbName: 'givemepic',
});

const Schema = mongoose.Schema;
const testSchema = new Schema({
    title: String,
    description: String
});

const TestModel = mongoose.model('Test', testSchema);

module.exports = {
    mongoose,
    TestModel
};
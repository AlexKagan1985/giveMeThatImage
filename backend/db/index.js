import _mongoose from 'mongoose';
const connStr = process.env.MONGO_CONNECTION;

console.log('Connecting to MongoDB...', connStr);

_mongoose.set('strictQuery', false);
_mongoose.connect(connStr, {
  dbName: 'givemepic',
});

const Schema = _mongoose.Schema;
const testSchema = new Schema({
  title: String,
  description: String
});

export const TestModel = _mongoose.model('Test', testSchema);
export const mongoose = _mongoose;

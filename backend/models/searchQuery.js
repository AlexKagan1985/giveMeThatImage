import { mongoose } from '../db/index.js';

const querySchema = new mongoose.Schema({
  user_id: mongoose.Types.ObjectId,
  query_string: String,
  creation_date: Date,
})

export const QueryModel = mongoose.model('Queries', querySchema);

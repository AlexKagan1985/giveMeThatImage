import { mongoose } from '../db/index.js';

const querySchema = new mongoose.Schema({
  user_id: mongoose.Types.ObjectId,
  query_string: String,
  creation_date: Date,
})

const resultSchema = {
  img_url: String,
  title: String,
  author_id: String,
  author_name: String,
  preview_url: String,
  id: String,
  mature_content: Boolean,
  api_data: Object,
}

const paginatedResultSchema = {
  maxPages: Number,
  page: Number,
  provider: String,
  data: [resultSchema],
}

const resultPagesSchema = new mongoose.Schema({
  query_id: mongoose.Types.ObjectId,
  pages: [paginatedResultSchema],
})

export const QueryModel = mongoose.model('Queries', querySchema);
export const ResultModel = mongoose.model('SearchResults', resultPagesSchema);

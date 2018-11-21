const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const searchSchema = new Schema({
  searchQuery: { type: String, required: true },
  provider:{ type: String, required: true},
  options:{
    user:{ type: String, required: true},
    password:{ type: String, required: true}
  },
  callbackUrl:{ type:String, required: true},
  status:{type: String, required: true}
});

const Search = mongoose.model('Search', searchSchema);

module.exports = Search;
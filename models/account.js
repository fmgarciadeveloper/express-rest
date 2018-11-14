const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Account = new Schema({
  username: { type: String },
  date_created: { type: Date, default: Date.now },
  visits: { type: Number, default: 0 },
  active: { type: Boolean, default: false }
});

const AccountModel = mongoose.model('Account', Account);

module.exports = AccountModel;
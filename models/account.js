const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const accountSchema = new Schema({
  username: { type: String },
  date_created: { type: Date, default: Date.now },
  visits: { type: Number, default: 0 },
  active: { type: Boolean, default: false }
});

const Account = mongoose.model('Account', accountSchema);

module.exports = Account;
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const productSchema = new Schema({
  searchTerm: { type: String, required: true },
  product_name:{ type: String, required: true },
  sku:{ type: String },
  price:{ type:Number},
  price_with_discount:{type: Number},
  category:{ type: ObjectId, ref : "Category" },
  description:{type: String},
  imagesUrl:{type: String}
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
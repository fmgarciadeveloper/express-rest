const Product = require('../models/product');

module.exports.list = function(req, res, next) {
  Product.find({}, function(err, products){
    res.json({ data: products }); 
  });
};
const Category = require('../models/category');
const Product = require('../models/product');
const ObjectId = require('mongoose').Types.ObjectId;

module.exports.list = function(req, res, next) { 
  Category.find({}, function(err, categories){
    res.json({ data: categories }); 
  });
};

module.exports.findById = function(req, res, next) {

  const id = req.params.productCategoryId;
  console.log(id);

  Product.
    find({category : new ObjectId(id)}).
    populate('category').
    exec(function (err, product) {

      if (err) {
        res.json({message:'Category no exists!!!'})
      }

      if(!product){
        res.json({message:'Category no exists!!!'})
      }else{
        console.log(product);
        res.json({data:product})
      }      
    });
};
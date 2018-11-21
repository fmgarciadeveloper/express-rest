const Search = require('../models/search');
const Product = require('../models/product');
const amqpConn = require('../rabbitmq');

module.exports.list = function(req, res, next) {
  Search.find({}, function(err, seachs){
    res.json({ data: seachs }); 
  });
};

module.exports.findById = function(req, res, next) {
  
  const id = req.params.searchOrderId;

  Search.findById({_id: id}, function(err, search){  
    
    const result = {
      search,
    }
    
    if(search){
      let search_term = search.searchQuery;
      Product.find({ searchTerm: search_term }, function(err, products){
        result.products = products;
        res.json({ data: result }); 
      });     

    }else{
      res.json({message:'Search-Order no exists!!!'})
    }
    
  });
};

module.exports.create = function(req, res, next) {
  
  const search = new Search({
    searchQuery: req.body.searchQuery,
    provider: req.body.provider,
    options:{
      user:req.body.options.user,
      password: req.body.options.password
    },
    callbackUrl: req.body.callbackUrl,
    status:req.body.status
  });  

  search.save().then(
    (data) => { 
      const message = {
        id: data._id,
        searchQuery: data.searchQuery,
        provider: data.provider,
      }

      amqpConn.publishSearch(message);
      res.json({ data: data });   
    },
    err => { 
      res.json({ message: err });
    }
 );   

};
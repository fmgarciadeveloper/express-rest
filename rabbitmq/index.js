const amqp = require('amqplib/callback_api');
const Search = require('../models/search');
const Product = require('../models/product');
const Category = require('../models/category');
let amqpConn = null;
let channel = null;
let message = 'por iniciar';
const conectionURL = process.env.CLOUDAMQP_URL;

module.exports = {
  init: function() {
    /** conection to RabbitMQ */
    amqp.connect(conectionURL, function(err, conn) {
    
      amqpConn = conn;  
    
      amqpConn.createChannel(function(err, ch) {
        channel = ch;
        let queueResult = 'result';
        let queueStatus = 'status';

        channel.assertQueue(queueResult, {durable: false});
        channel.consume(queueResult, function(msg) {
          let message = msg.content.toString();
          let data = JSON.parse(message);
          
          const searchCategory = data[0].category;

          Category.findOne({name: searchCategory})
            .exec()
            .then((category) => {

              if(!category){     
              
                const newCatergory = new Category({
                  name: searchCategory
                });
                
                newCatergory.save(function (err, newData) {
                  if (err) return console.log(err);
                  
                  for(var i in data) {
          
                    const product = new Product({
                      searchTerm: data[i].searchTerm,
                      product_name: data[i].product_name,
                      sku: data[i].sku,
                      price: data[i].price,
                      price_with_discount: data[i].price_with_discount,
                      category: newData._id,
                      description: data[i].description,
                      imagesUrl: data[i].imagesUrl
                    }); 
                    
                    product.save(function (err, newProduct) {
                      if (err) return console.log(err);                  
                    });
                  }
                });                
  
              }else{
                for(var i in data) {
          
                  const product = new Product({
                    searchTerm: data[i].searchTerm,
                    product_name: data[i].product_name,
                    sku: data[i].sku,
                    price: data[i].price,
                    price_with_discount: data[i].price_with_discount,
                    category: category._id,
                    description: data[i].description,
                    imagesUrl: data[i].imagesUrl
                  }); 
                  
                  product.save(function (err, newProduct) {
                    if (err) return console.log(err);                  
                  });
                }
              }

              
            })
            .catch((err) => {
              console.log('error >> ');
              console.log(err)
            });
                    
          
        }, {noAck: true});

        channel.assertQueue(queueStatus, {durable: false});
        channel.consume(queueStatus, function(msg) {
          let message = msg.content.toString();
          let data = JSON.parse(message);
          
          Search.findById({_id: data.id}, function (err, search) {
            if (err) return console.log(err);
          
            search.set({ status: data.status});
            search.save(function (err, updatedTank) {
              if (err) return console.log(err);
            });
          });
          
        }, {noAck: true});
      });    
    });
  },
  closeChannel: function() {
    channel.close();
  },
  closeConn: function() {
    amqpConn.close();
  },
  publishSearch: function(message) {

    var q = 'messages';
  
    channel.assertQueue(q, {durable: false});
    // Note: on Node 6 Buffer.from(msg) should be used
    channel.sendToQueue(q, Buffer.from(JSON.stringify(message)));
    
  }
};
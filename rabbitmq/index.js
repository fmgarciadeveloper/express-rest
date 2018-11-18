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
          message = msg.content.toString();
          data = JSON.parse(message);
          console.log('result');
          console.log(message);
          const product = new Product({
            searchTerm: data.searchTerm,
            product_name: data.product_name,
            sku: data.sku,
            price: data.price,
            price_with_discount: data.price_with_discount,
            category: data.category,
            description: data.description,
            imagesUrl: data.imagesUrl
          });

          Category.findOne({name: data.category}, function(err, category){
            if(!category){
              console.log("not found");
              const newCatergory = new Category({
                name: data.category
              });
              console.log(newCatergory);
              newCatergory.save(data).then(
                (data) => {
                  console.log(data); 
                  product.category = data._id;
                  product.save(product);
                },
                (err) => {
                  console.log(err);
                }
              ); 
            }else{
              console.log("found");
              product.category = category._id;
              product.save(product);
            }
          });

        }, {noAck: true});

        channel.assertQueue(queueStatus, {durable: false});
        channel.consume(queueStatus, function(msg) {
          message = msg.content.toString();
          data = JSON.parse(message);
          
          Search.findById({_id: data.id}, function (err, search) {
            if (err) return console.log(err);
          
            search.set({ status: data.status});
            search.save(function (err, updatedTank) {
              if (err) return console.log(err);
              console.log(updatedTank);
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
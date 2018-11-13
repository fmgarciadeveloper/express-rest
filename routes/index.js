var express = require('express');
var router = express.Router();

/* 
  receive an object with the terms for a search 
*/
router.post('/product/search', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/*  
  receive a searchOrderId as a query string, and must return a JSON with the
  status of the searchOrder and the results associated to the search order itself. 
*/
router.get('/product/search-order/:searchOrderId', function(req, res, next) {
  res.json({ message: 'hooray! welcome to our api!'+req.params.id });   
});

/* 
  return a list of the search orders that exists in the database.
*/
router.get('/product/search-order', function(req, res, next) {
  res.json({ message: 'return a list of the search orders that exists in the database.' });   
});

/* 
  receive a categoryId as a query string, and must return an array with all the
  products associated to the given category. If the category doesn't exists, it must return an error.
*/
router.get('/product/category/:productCategoryId', function(req, res, next) {
  res.json({ message: 'receive a categoryId as a query string : '+req.params.productCategoryId });   
});

/* 
  return a list of categorie that exists in the database.
*/
router.get('/product/category', function(req, res, next) {
  res.json({ message: 'return a list of categorie that exists in the database.' });   
});

module.exports = router;

var express = require('express');
var router = express.Router();
const Category = require('../controllers/categories');
const Search = require('../controllers/searchs');

/* 
  get home
*/
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* 
  receive an object with the terms for a search 
*/
router.post('/api/product/search', Search.create);

/*  
  receive a searchOrderId as a query string, and must return a JSON with the
  status of the searchOrder and the results associated to the search order itself. 
*/
router.get('/api/product/search-order/:searchOrderId', Search.findById);

/* 
  return a list of the search orders that exists in the database.
*/
router.get('/api/product/search-order', Search.list);

/* 
  receive a categoryId as a query string, and must return an array with all the
  products associated to the given category. If the category doesn't exists, it must return an error.
*/
router.get('/api/product/category/:productCategoryId', Category.findById);

/* 
  return a list of categorie that exists in the database.
*/
router.get('/api/product/category', Category.list);

module.exports = router;

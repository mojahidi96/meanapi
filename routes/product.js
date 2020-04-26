const express = require('express');
const router = express.Router();
const productModel = require('../models/product-model');

router.get('/', function (req, res, next) {
    productModel.getProducts(function (err, products) {
        console.log('test product    ', products)
        res.json(products);
    })

});

module.exports = router;
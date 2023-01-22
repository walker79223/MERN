const express = require('express');
const router = express.Router();
const { getProduct, getProductById, createProduct, getAllProducts, updateProduct, deleteProduct, photo } = require('../controllers/product');
const { isAdmin, isAuthenticated, isSignIn } = require('../controllers/auth');
const { getUserById } = require('../controllers/user');

router.param('productId', getProductById);
router.param('userId', getUserById);


router.get('/products', getAllProducts);

router.get('/product/:productId', getProduct);
router.get('/product/photo/:productId', photo, getProduct);
router.post('/create/product/:userId', isSignIn, isAuthenticated, isAdmin, createProduct);
router.put('/update/product/:productId/:userId', isSignIn, isAuthenticated, isAdmin, getProductById, updateProduct);
router.delete('/delete/product/:productId/:userId', isSignIn, isAuthenticated, isAdmin, getProductById, deleteProduct);


module.exports = router;
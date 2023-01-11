const express = require('express');
const { isSignIn, isAuthenticated, isAdmin } = require('../controllers/auth');
let router = express.Router()
const { getCategoryById, createCategory, getCategory, getAllCategories, updateCategory, deleteCategories } = require('../controllers/category');
const { getUserById } = require('../controllers/user');

// parameters for request
router.param('userId', getUserById);
router.param('categoryId', getCategoryById);

// All categories
router.get("/categorys/", getAllCategories);

// Actual routes
router.get("/category/:categoryId", getCategory);
router.post('/category/create/:userId', isSignIn, isAuthenticated, isAdmin, createCategory);
router.put("/category/update/:categoryId/:userId", isSignIn, isAuthenticated, isAdmin, updateCategory);
router.delete("/category/delete/:categoryId", isSignIn, isAuthenticated, isAdmin, deleteCategories);

module.exports = router;
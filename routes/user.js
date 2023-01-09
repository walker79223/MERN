let express = require('express');
const { isSignIn, isAuthenticated } = require('../controllers/auth');
const { getUserById, getUser, updateUser, userPurchaseList } = require('../controllers/user');
let router = express.Router()

router.param('userId', getUserById)

router.get('/user/:userId', isSignIn, isAuthenticated, getUser)
router.put("/user/:userId", isSignIn, isAuthenticated, updateUser)
router.get("/user/orders/:userId", isSignIn, isAuthenticated, userPurchaseList)

module.exports = router;

let express = require('express');
const { isSignIn, isAuthenticated } = require('../controllers/auth');
const { getUserById, getUser } = require('../controllers/user');
let router = express.Router()

router.param('/userId', getUserById)

router.get('/user/:userId', isSignIn, isAuthenticated, getUser)

module.exports = router;
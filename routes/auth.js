let express = require('express');
let router = express.Router()
const { check } = require('express-validator')
const { signUp, signIn, signOut } = require('../controllers/auth')

router.post('/signup', [
    check("name", "name must be at least 3 chars long").isLength({ min: 3 }),
    check("email", "email is required !!").isEmail(),
    check("password", "password must be at least 3 chars long").isLength({ min: 3 })
], signUp)

router.post('/signin', [
    check("email", "email is required !!").isEmail(),
    check("password", "password field is required").isLength({ min: 1 })
], signIn)

router.get('/signout', signOut)
module.exports = router;
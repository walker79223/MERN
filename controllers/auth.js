const User = require('../models/user');
const { validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
const expressJwt = require('express-jwt')

const signUp = (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: errors.array()[0].msg
        })
    }
    const user = new User(req.body)
    user.save((err, user) => {
        if (err) {
            console.log(err);
            return res.status(400).json({
                err: "CANT SIGN UP",
            })
        }
        return res.json(user).status(200)

    });
}
const signIn = (req, res) => {
    const errors = validationResult(req)
    const { email, password } = req.body;

    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: errors.array()[0].msg
        })
    }

    User.findOne({ email }, (err, user) => {
        if (err || !user) {
            return res.json({
                error: "email does not exist !!"
            })
        }
        if (!user.autheticate(password)) {
            return res.status(401).json({
                error: "email and pass do not match !!"
            })
        }
        const token = jwt.sign({ _id: user._id }, process.env.SECRET)

        res.cookie("token", token, { expire: new Date() + 9999 });

        const { _id, name, email, role } = user
        return res.json({
            token,
            user: {
                _id, name, email, role
            }
        })
    })
}

const signOut = (req, res) => {
    res.clearCookie("token")
    return res.status(200).json({
        msg: "User signed out"
    })
}

const isSignIn = expressJwt({
    secret: process.env.SECRET,
    userProperty: "auth",

})

const isAuthenticated = (req, res, next) => {
    let checker = req.profile && req.auth && req.profile._id == req.auth._id
    if (!checker) {
        return res.status(403).json({
            err: "ACCESS_DENIED"
        })
    }
    next()
}

const isAdmin = (req, res, next) => {
    if (req.auth.role === 0) {
        return res.status(403).json({
            err: "You're not Admin"
        })
    }
    next()
}

module.exports = { signUp, signIn, signOut, isSignIn, isAuthenticated, isAdmin}
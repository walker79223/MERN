const User = require('../models/user')
const jwt = require('jsonwebtoken')
const { Order } = require('../models/order');
const { Response, Request } = require('express')


exports.getUserById = (req, res, next, id) => {
    User.findById(id).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                err: "no user found"
            })
        }
        req.profile = user;
        next()
    })
};

exports.getUser = (req, res) => {
    req.profile.salt = undefined
    req.profile.encry_password = undefined
    return res.json(req.profile)
}

exports.updateUser = (req, res) => {
    User.findOneAndUpdate({
        _id: req.profile._id
    }, {
        $set: req.body
    }, {
        new: true, useFindAndModify: false
    }, (err, user) => {
        if (err || !user) {
            console.log(err);
            return res.status(400).json({
                err: "user not updated !!"
            })
        }
        user.salt = undefined
        user.encry_password = undefined
        return res.json(user)
    })
}

exports.userPurchaseList = (req, res) => {
    Order.find({ user: req.profile._id }).populate("user", "_id name").exec((err, order) => {
        if (err) {
            return res.status(400).json({
                err: "NO order"
            })
        }
        return res.json(order)
    })
}
/**
 * 
 * @param {Request} req 
 * @param {Response} res
 * */
exports.pushOrderInPurchaseList = (req, res, next) => {
    let purchases = [];
    req.body.order.products.forEach(product => {
        purchases.push({
            _id: product._id,
            name: product.name,
            description: product.description,
            category: product.category,
            quantity: product.quantity,
            amout: req.body.order.amout,
            transactionId: req.body.order.transaction_id
        })
    });
    // store in DB
    User.findOneAndUpdate({
        _id: req.profile._id
    }, {
        $push: {
            purchases: purchases
        }
    }, {
        new: true
    }, (err, purchases) => {
        if (err || !purchases) return res.status(400).json({
            err: "Unable to save purchase list"
        })
        next()
    })
}
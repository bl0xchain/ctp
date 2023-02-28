const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')

const protect = asyncHandler(async(req, res, next) => {
    let token

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1]
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            req.user = await User.findById(decoded.id).select('-password')
            next()
        } catch (error) {
            console.log(error)
            res.status(401)
            throw new Error('not authorized')
        }
    }

    if(!token) {
        res.status(401)
        throw new Error('not authorized. no token')
    }
})

const adminOnly = asyncHandler(async(req, res, next) => {
    let token

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1]
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            req.user = await User.findById(decoded.id).select('-password')
        } catch (error) {
            console.log(error)
            res.status(401)
            throw new Error('not authorized')
        }
        if(req.user.isAdmin) {
            next()
        } else {
            res.status(401)
            throw new Error('not authorized. admin only.')
        }
    }

    if(!token) {
        res.status(401)
        throw new Error('not authorized. no token')
    }
})

module.exports = { protect, adminOnly }
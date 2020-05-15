const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const checkAuth = require('../middleware/checkAuth');
const User = require('../models/user');

//User GET methods
router.get('/', checkAuth, (req, res, next) => {
    User.find()
    .select("-__v")
    .populate('pets', "-owner -__v")
    .then( result => {
        if(result.length > 0){
            res.status(200).json({
                Message: "All Users found",
                users: result
            })
        } else {
            res.status(200).json({
                Message: "Empty database"
            })
        }
    })
    .catch( err => {
        res.status(500).json({
            error: err
        })
    });
})

router.get('/userId', (req, res, next) => {

})

//User POST methods
router.post('/login', (req, res, next) => {
    User.find({
        email: req.body.email
    })
    .exec()
    .then(users => {
        if(users.length < 1){
            return res.status(401).json({
                message: "Auth failed"
            });
        } else {
            bcrypt.compare(req.body.password, users[0].password, (err, result) => {
                if(err){
                    return res.status(500).json({
                        error: err
                    });
                }
                if (result){
                    const token = jwt.sign({
                        userId: users[0]._id,
                        email: users[0].email
                    },
                    process.env.JWT_KEY,
                    {
                        expiresIn: "1h"
                    });
                    return res.status(200).json({
                        message: "Auth success",
                        token: token
                    });
                } else {
                    return res.status(401).json({
                        message: "Auth failed"
                    });
                }
            })
        }
    })
    .catch( error => {
        return res.status(500).json({
            error: error
        });
    })
});

router.post('/signup', (req, res, next) => {
    User.exists({
        username: req.body.username,
        email: req.body.email
    }, (error, result) => {
        if(error){
            return res.status(500).json({
                error: error
            })
        } else if (result){
            res.status(409).json({
                Message: "Conflicting request"
            })
        } else {
            bcrypt.hash(req.body.password, 10, (err, hash) =>{
                const user = new User({
                    _id: mongoose.Types.ObjectId(),
                    username: req.body.username,
                    email: req.body.email,
                    password: hash,
                    firstName: req.body.firstName,
                    lastName: req.body.lastName
                });
                user.save()
                .then( dbResult => {
                    res.status(201).json({
                        Message: "User added succesfully",
                        createdUser: {
                            _id: dbResult._id,
                            username: dbResult.username,
                            email: dbResult.email,
                            password: dbResult.password,
                            firstName: dbResult.firstName,
                            lastName: dbResult.lastName
                        }
                    })
                })
                .catch( err => {
                    res.status(500).json({
                        error: err
                    })
                });
            })
        }
    })
})

//User DELETE methods
router.delete('/userId', (req, res, next) => {

})

router.delete('/', (req, res, next) => {
    User.deleteMany({}, (err, result) => {
        if(err){
            res.status(500).json({
                error: err,
            })
        } else {
            if (result.deletedCount > 0){
                res.status(200).json({
                    Message: "Cleared database",
                })
            } else {
                res.status(404).json({
                    Message: "Delete failed",
                })
            }
        }
    })
})

//User PATCH methods
router.param('/userId', (req, res, next) => {

})

module.exports = router;
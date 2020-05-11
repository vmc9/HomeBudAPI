const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user');

//User GET methods
router.get('/', (req, res, next) => {
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
router.post('/', (req, res, next) => {
    User.exists({
        username: req.body.username,
        email: req.body.username
    }, (error, result) => {
        if(error){
            res.status(400).json({
                Message: "Bad request"
            })
        } else {
            if(!result){
                const user = new User({
                    _id: mongoose.Types.ObjectId(),
                    username: req.body.username,
                    email: req.body.email,
                    password: req.body.email,
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
            }
        }
    })
})

//User DELETE methods
router.get('/', (req, res, next) => {

})

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
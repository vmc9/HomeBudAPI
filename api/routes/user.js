const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const checkAuth = require('../middleware/checkAuth');

//Model
const User = require('../models/user');
const Pet = require('../models/pet')

//User GET methods
router.get('/', async (req, res, next) => {
    try{
        const result = await User.find()
        .select("-__v")
        .populate('pets', "-owner -__v")
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
    }catch(error){
        res.status(500).json({
            error
        })
    }
})

router.get('/:username', checkAuth, async (req, res, next) => {
    try{
        const users = await User.find({ username: req.params.username })
        if (users.length < 1){
            return res.status(401).json({
                message: "User not found"
            })
        } else {
            return res.status(200).json({
                message: "User found",
                user: {
                    id: users[0]._id,
                    firstname: users[0].firstName,
                    lastname: users[0].lastName,
                    pets: users[0].pets,
                    username: users[0].username,
                    email: users[0].email
                }
            })
        }
    }catch(error){
        return res.status(500).json({
            error: error
        })
    }
})

//User POST methods
router.post('/login', async (req, res, next) => {
    try{
        const users = await User.find({ username: req.body.username })
        if(users.length < 1){
            return res.status(401).json({
                message: "Auth failed"
            });
        } else {
            result = await bcrypt.compare(req.body.password, users[0].password)
            if (result){
                const token = jwt.sign({
                    userId: users[0]._id,
                    email: users[0].username
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
        }
    }catch(error){
        return res.status(500).json({
            error
        });
    }
});

//TODO: Add Postal to user model and signup entry
router.post('/signup', async (req, res, next) => {
    try{
        const result = await User.exists({ $or:[{username: req.body.username }, {email: req.body.email}] })
        if(result){
            res.status(409).json({
                Message: "Request conflict"//Email or username are not unique
            })
        }else{
            const hash = await bcrypt.hash(req.body.password, 10)
            const user = new User({
                _id: mongoose.Types.ObjectId(),
                username: req.body.username,
                email: req.body.email,
                password: hash,
                firstName: req.body.firstName,
                lastName: req.body.lastName
            });
            const dbResult = await user.save()
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
        }
    }catch(error){
        return res.status(500).json({
            error
        })
    }
});

//User DELETE methods
router.delete('/:username', async (req, res, next) => {
    try{
        //Delete owner's pets
        const deleted_pets = await Pet.deleteMany({owner: (await User.findOne({ username: req.params.username}))._id})
        //Delete owner
        const result = await User.deleteOne( { username: req.params.username })
        if (result.deletedCount > 0){
            res.status(200).json({
                Message: "User deleted",
                deleted_pets
            })
        }else{
            res.status(404).json({
                Message: "Delete failed",
            })
        }
    }catch(error){
        res.status(500).json({
            error
        })
    }
})

router.delete('/', async (req, res, next) => {
    try{
        //Delete pets
        const deleted_pets = await Pet.deleteMany({})
        //Delete users
        const result = await User.deleteMany({})
        if (result.deletedCount > 0){
            res.status(200).json({
                Message: "Cleared database",
                deleted_pets,
                deleted_owners: result.deletedCount
            }) 
        }else{
            res.status(404).json({
                Message: "Delete failed",
            })
        }
    }catch(error){
        res.status(500).json({
            error
        })
    }
})

//TODO: User PATCH methods
router.param('/userId', (req, res, next) => {

})

module.exports = router;
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Pet = require('../models/pet');
const Owner = require('../models/user')

//Pet GET methods
router.get('/', (req, res, next) => {
    Pet.find()
    .select('-__v')
    .exec()
    .then( result => {
        if(result.length > 0){
            res.status(200).json({
                Message: "All pets found",
                pets: result,
                petCount: result.length
            })
        } else {
            res.status(200).json({
                Message: "Empty database",
            })
        }
    })
    .catch( err => {
        res.status(404).json({
            error: err
        })
    });
});

router.get('/:petId', (req, res, next) => {
    const id = req.params.petId;
    Pet.findById({ _id: id })
    .select('-__v')
    .exec()
    .then( result => {
        if(result){
            res.status(200).json({
                Message: "Pet found",
                pet: result
            })
        } else {
            res.status(404).json({
                Message: "Pet not found"
            })
        }
    })
    .catch( err => {
        res.status(500).json({
            Message: err
        })
    });
});

//Pet POST methods
router.post('/', (req, res, next) => {
    Owner.findById(req.body.owner)
    .exec()
    .then( owner => {
        Pet.exists({ 
            name: req.body.name,
            animal: req.body.animal,
            owner: owner
        }, 
        (error, result) => {
            if(error) {
                res.status(500).json({
                    error: err
                })
            } else {
                if(!result){
                    const pet = new Pet({
                        _id: mongoose.Types.ObjectId(),
                        name: req.body.name,
                        animal: req.body.animal,
                        description: req.body.description,
                        owner: owner
                    });
                    pet.save()
                    .then( dbResult => {
                        res.status(201).json({
                            Message: "Pet added succesfully",
                            createdPet: {
                                _id: dbResult._id,
                                name: dbResult.name,
                                animal: dbResult.animal,
                                description: dbResult.description,
                                owner: dbResult.owner
                            }
                        })
                    })
                    .catch( err => {
                        res.status(500).json({
                            error: err
                        })
                    }) 
                } else {
                    res.status(400).json({
                        Message: "Bad request"
                    })
                }   
            }
        });
    })
    .catch( err => {
        res.status(500).json({
            error: err
        })
    });
});

//Pet PATCH methods
router.patch('/:petId', (req, res, next) => {
    const id = req.params.petId;
    Pet.update({ _id: id }, { $set: {
        //TO-DO
    }})
    .exec()
    .then( result => {
        res.status(200).json({
            Message: "Pet update succesfull",
            pet: result
        })
    })
    .catch( err => {
        res.status(500).json({
            error: err
        })
    })

});

//Pet DELETE methods
router.delete('/:petId', (req, res, next) => {
    const id = req.params.petId;
    Pet.deleteOne({ _id: id })
    .exec()
    .then( result => {
        if (result.deletedCount > 0){
            res.status(200).json({
                Message: "Pet deleted successfully",
            })
        } else {
            res.status(404).json({
                Message: "Delete failed",
            })
        }
    })
    .catch(err => {
        res.status(500).json({
            error: err,
        })
    });
});

router.delete('/', (req, res, next) => {
    Pet.deleteMany({}, (err, result) => {
        if(err){
            res.status(500).json({
                error: err,
            })
        } else {
            if (result.deletedCount === 1){
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
});

module.exports = router;
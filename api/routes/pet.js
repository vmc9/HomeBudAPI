const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Pet = require('../models/pet');

//Pet GET methods
router.get('/', (req, res, next) => {
    Pet.find()
    .exec()
    .then( result => {
        if(result.length > 0){
            res.status(200).json({
                Message: "All pets found",
                pets: result
            })
        } else {
            res.status(200).json({
                Message: "Empty database",
            })
        }
    })
    .catch( err => {
        res.status(404).json({
            Message: "No database found"
        })
    });
});

router.get('/:petId', (req, res, next) => {
    const id = req.params.petId;
    Pet.findById({ _id: id })
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
    const pet = new Pet({
        _id: mongoose.Types.ObjectId(),
        name: req.body.name,
        description: req.body.description,
    });
    pet.save()
    .then( result => {
        console.log(result);
    })
    .catch( error => console.log(err))
    res.status(201).json({
        Message: "Pet added succesfully",
        createdPet: pet
    })
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
        if (result.deletedCount === 1){
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

module.exports = router;
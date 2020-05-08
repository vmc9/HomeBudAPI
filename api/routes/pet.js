const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Pet = require('../models/pet');

//Pet GET methods
router.get('/', (req, res, next) => {
    Pet.find()
    .then( result => {
        res.status(200).json({
            Message: "Response to GET from /pet",
            pets: result
        })
    })
    .catch( err => {
        res.status(404).json({
            Message: "No pets found"
        })
    });
});

router.get('/:petId', (req, res, next) => {
    const id = req.params.petId;
    Pet.findById(id)
    .then( result => {
        res.status(200).json({
            Message: "Response to GET from /pet",
            pet: result
        })
    })
    .catch( err => {
        res.status(404).json({
            Message: "Pet not found"
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
        Message: "Response to POST from /pet",
        createdPet: pet
    })
});

router.patch('/:petId', (req, res, next) => {
    const id = req.params.petId;
    res.status(200).json({
        Message: "Response to PATCH from /pet",
    })
});

router.delete('/:petId', (req, res, next) => {
    const id = req.params.petId;
    res.status(200).json({
        Message: "Response to DELETE from /pet",
    })
});

module.exports = router;
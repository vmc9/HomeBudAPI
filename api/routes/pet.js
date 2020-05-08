const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Pet = require('../models/pet');

//Pet GET methods
router.get('/', (req, res, next) => {
    res.status(200).json({
        Message: "Response to GET from /pet"
    })
});

router.get('/:petId', (req, res, next) => {
    const id = req.params.petId;
    res.status(200).json({
        Message: "Response to GET from /pet",
        Id: id
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


module.exports = router;
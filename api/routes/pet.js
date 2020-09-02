const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const ownerConfirm = require('../middleware/ownerConfirm');
const Pet = require('../models/pet');
const Owner = require('../models/user')

//Pet GET methods
router.get('/', async (req, res, next) => {
    try{
        const result = await Pet.find()
        .select('-__v')
        .populate('owner', "username email")
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
    }catch(error){
        res.status(404).json({
            error: err
        })
    }
});

router.get('/:petId', async (req, res, next) => {
    try{
        const id = req.params.petId;
        const result = await Pet.findById({ _id: id })
        .select('-__v')
        .populate('owner', "username email")
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
    }catch(error){
        res.status(500).json({
            error
        })
    }
});

//Pet POST methods
router.post('/', ownerConfirm, async (req, res, next) => {
    if(req.confOwner){
        const owner = req.confOwner
        try{
            const result = await Pet.exists({
                name: req.body.name,
                animal: req.body.animal,
                owner: owner
            })
            if(!result){
                const pet = new Pet({
                    _id: mongoose.Types.ObjectId(),
                    name: req.body.name,
                    animal: req.body.animal,
                    description: req.body.description,
                    owner: owner
                });
                const petList = owner.pets;
                petList.push(pet._id);
                await Owner.updateOne({ _id: owner._id}, { $set: { pets: petList }})
                const dbResult = await pet.save()
                res.status(201).json({
                    Message: "Pet added succesfully",
                    createdPet: {
                        _id: dbResult._id,
                        name: dbResult.name,
                        animal: dbResult.animal,
                        description: dbResult.description,
                        owner: dbResult.owner.username
                    }
                });
            } else {
                res.status(400).json({
                    Message: "Pet Already Exists"
                })
            }
        }catch(error){
            res.status(500).json({
                error
            })
        }
    }
});

//TODO:Pet PATCH methods
router.patch('/:petId', (req, res, next) => {
    const id = req.params.petId;
    Pet.update({ _id: id }, { $set: {

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

//TODO: Pet DELETE methods (NEED TO ADD FEATURE TO REMOVE THE PET FROM THE USERS AS WELL)
router.delete('/:petId', async (req, res, next) => {
    try{
        const id = req.params.petId;
        const result = await Pet.deleteOne({ _id: id })
        if (result.deletedCount > 0){
            res.status(200).json({
                Message: "Pet deleted successfully",
            })
        } else {
            res.status(404).json({
                Message: "Delete failed",
            })
        }
    }catch(error){
        res.status(500).json({
            error
        })
    }
});

router.delete('/', async (req, res, next) => {
    try{
        const result = await Pet.deleteMany({})
        if (result.deletedCount > 0){
            res.status(200).json({
                Message: "Cleared database",
            })
        } else {
            res.status(404).json({
                Message: "Delete failed",
            })
        }
    }catch(error){
        res.status(500).json({
            error
        })
    }
});

module.exports = router;
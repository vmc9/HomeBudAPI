const express = require('express');
const mongoose = require('mongoose');

//File handling
const multer = require('multer');
const storage = multer.memoryStorage()
const upload = multer({storage: storage});

//AWS
const AWS = require('aws-sdk')
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKEy: process.env.AWS_ACCESS_KEY_ID,
    region: process.env.AWS_REGION
})
const s3 = new AWS.S3()

//Router
const router = express.Router();

//Middlewares
const ownerConfirm = require('../middleware/ownerConfirm');

//Models
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
        const id = req.query.petId;
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
router.post('/upload', upload.array('pet_photo', 5), async (req, res, next)=>{
    const uploads = [];
    const subfolder = `pet_images/${req.body.pet_id}`
    try{
        for (const [index, value] of req.files.entries()){
            if(value.mimetype != "image/jpeg"){ throw("Invalid file type")}
            var params = {
                Bucket: 'homebud',
                Key: `${subfolder}/${(index)}.${value.mimetype.split("/")[1]}`,
                Body: value.buffer,
                ContentType: value.mimetype,
                ACL: "public-read"
            }
            const data = await s3.upload(params).promise()
            if(data) {
              uploads.push(data.Location)
            }
        }
        res.status(201).json({
            uploaded: uploads        
        })
    }catch(error){
        res.status(500).json({
            message: "file upload failed",
            error
        })
    }
})

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
                    type: req.body.type,
                    breed: req.body.breed,
                    age: req.body.age,
                    sex: req.body.sex,
                    size: req.body.size,
                    description: req.body.description,
                    owner: owner,
                    profile: req.body.profile
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
                        type: dbResult.type,
                        breed: dbResult.breed,
                        age: dbResult.age,
                        sex: dbResult.sex,
                        size: dbResult.size,
                        description: dbResult.description,
                        owner: {
                            _id: dbResult.owner._id,
                            username: dbResult.owner.username,
                            name: `${dbResult.owner.firstName} ${dbResult.owner.lastName}`
                        },
                        profile: dbResult.profile
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
    const id = req.query.petId;
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

router.delete('/:petId', async (req, res, next) => {
    try{
        //Remove pet from user
        const id = req.query.petId;
        const result = await Pet.findOne({_id: id})
        const owner = await Owner.findOne({_id: result.owner._id})
        const updated_pets = owner.pets.filter((value, index, arr)=>{ return value._id != id})
        await Owner.updateOne({_id: result.owner._id}, {pets: updated_pets})

        //Delete pet
        const deleted = await Pet.deleteOne({ _id: id })
        if (deleted.deletedCount > 0){
            res.status(200).json({
                message: "Pet deleted successfully",
                deleted: result
            })
        } else {
            res.status(404).json({
                message: "Delete failed",
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
        const result = await Pet.find({})
        deletedCount = 0
        //Remove pets from users
        try{
            result.forEach(async pet => {
                const updated = await Owner.updateOne({_id: pet.owner._id}, {pets: []})
                if(updated){
                    deletedCount++
                }
            })
        }catch(error){
            res.status(500).json({
                message: "Failed to remove pet from owner",
                error
            })
        }
        //Delete pets
        const deleted = await Pet.deleteMany({})
        if (deleted.deletedCount > 0){
            res.status(200).json({
                message: "Cleared database",
                deleted: result,
                deletedCount
            })
        } else {
            res.status(404).json({
                message: "Delete failed",
            })
        }
    }catch(error){
        res.status(500).json({
            error
        })
    }
});

module.exports = router;
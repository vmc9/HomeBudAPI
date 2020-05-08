const express = require('express');
const router = express.Router();

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
    res.status(201).json({
        Message: "Response to POST from /pet"
    })
});


module.exports = router;
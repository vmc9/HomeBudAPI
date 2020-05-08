const express = require('express');
const router = express.Router();

//Search GET methods
router.get('/', (req, res, next) => {
    res.status(200).json({
        Message: 'Response to GET from search'
    })
});

router.get('/:searchId', (req, res, next) => {
    res.status(200).json({
        Message: 'Response to GET from search',
        id: req.params.searchId
    })
});

//Search POST methods
router.post('/:', (req, res, next) => {
    res.status(201).json({
        Message: 'Response to POST from search',
    })
});

//Search PATCH methods
router.patch('/:searchId', (req, res, next) => {
    res.status(200).json({
        Message: 'Response to PATCH from search',
        id: req.params.searchId
    })
});

//Search DELETE methods 
router.delete('/:searchId', (req, res, next) => {
    res.status(200).json({
        Message: 'Response to DELETE from search',
        id: req.params.searchId
    })
});

module.exports = router;
const Owner = require('../models/user')

module.exports = (req, res, next) => {
    Owner.findById(req.body.owner)
    .exec()
    .then( owner => {
        if(owner){
            req.confOwner = owner;
            next(); 
        } else {
            return res.status(404).json({
                message: "Owner does not exist"
            })
        }
    })
    .catch( error => {
        return res.status(500).json({
            message: "Owner search failed"
        })
    });
}
const Owner = require('../models/user')

module.exports = async (req, res, next) => {
    try{
        const owner = await Owner.findById(req.body.owner)
        if(owner){
                req.confOwner = owner;
                next(); 
            } else {
                return res.status(404).json({
                    message: "Owner does not exist"
                })
        }
    }catch(error){
        return res.status(500).json({
            message: "Owner search failed"
        })
    }
}
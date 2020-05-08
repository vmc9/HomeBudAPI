const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    _id: Schema.Types.ObjectId,
    username: {type: String, required: true},
    email: { 
        type: String,  
        required: true, 
        unique: true, 
        match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/},
    password: { type: String, required: true},
    firstName: { type: String, required: true},
    lastName: { type: String, required: true}, 
    pets: [{ type: Schema.Types.ObjectId, ref: 'pet'}]
});

module.exports = mongoose.model('User', userSchema);
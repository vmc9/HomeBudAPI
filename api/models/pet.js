const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const petSchema = new Schema({
    _id: Schema.Types.ObjectId,
    name: { type: String, required: true},
    type: {type: String, required: true},
    breed: {type: String, required: true},
    age: {type: String, required: true},
    sex: {type: String, required: true},
    size: {type: String, required: true},
    description: { type: String, required: true},
    owner: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true
    },
    profile: {type: Number},
    lost: { type: Boolean, default: false},
});

module.exports = mongoose.model('Pet', petSchema);
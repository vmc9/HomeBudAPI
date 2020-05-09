const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const petSchema = new Schema({
    _id: Schema.Types.ObjectId,
    name: { type: String, required: true},
    animal: {type: String, required: true},
    breed: String,
    age: Number,
    sex: String,
    description: { type: String, required: true},
    owner: { 
        type: Schema.Types.ObjectId, 
        ref: 'user', 
        //required: true
    },
    lostStatus: Boolean,
});

module.exports = mongoose.model('Pet', petSchema);
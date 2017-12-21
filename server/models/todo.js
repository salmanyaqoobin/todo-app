/**
 * Created by Salman on 12/13/2017.
 */

var mongoose = require('mongoose');

var TodoScheme = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        minlength: 1,
        required: true
    },
    text: {
        type: String,
        trim: true,
        minlength: 1,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Date,
        default: Date.now()
    },
    _creator:{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
});

var Todo = mongoose.model('Todo', TodoScheme);

module.exports = {Todo};
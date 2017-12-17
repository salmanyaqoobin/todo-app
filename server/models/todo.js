/**
 * Created by Salman on 12/13/2017.
 */

var mongoose = require('mongoose');


var Todo = mongoose.model('Todo', {
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

module.exports = {Todo};
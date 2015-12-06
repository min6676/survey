var mongoose = require('mongoose'),
    moment = require('moment'),
    Schema = mongoose.Schema;

var schema = new Schema({
  post: {type: Schema.Types.ObjectId, required: true, trim: true},
  email: {type: String, required: true, trim: true},
  content: {type: String, required: true},
  password: {type: String},
  createdAt: {type: Date, default: Date.now}
}, {
  toJSON: {virtuals: true},
  toObject: {virtuals: true}
});

var Question = mongoose.model('Question', schema);

module.exports = Question;

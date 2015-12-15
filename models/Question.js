var mongoose = require('mongoose'),
    moment = require('moment'),
    Schema = mongoose.Schema;

var schema = new Schema({
  post_id: {type: Schema.Types.ObjectId, required: true, trim: true},
  type: {type: String, reqired: true, trim: true},
  number: {type: Number, default: 0},
  content: {type: String, trim: true},
  item: [{item1: {type: String}, item2: {type: String},
              item3: {type: String}, item4: {type: String}}],
  createdAt: {type: Date, default: Date.now}
}, {
  toJSON: {virtuals: true},
  toObject: {virtuals: true}
});

var Question = mongoose.model('Question', schema);

module.exports = Question;

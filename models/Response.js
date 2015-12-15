var mongoose = require('mongoose'),
    moment = require('moment'),
    Schema = mongoose.Schema;

  var schema = new Schema({
    post_id: {type: Schema.Types.ObjectId, required: true, trim: true},
    question: {type: Schema.Types.ObjectId, required: true, trim: true},
    item: [{item1: {type: Number, default: 0}, item2: {type: Number, default: 0},
      item3: {type: Number, default: 0}, item4: {type: Number, default: 0}}],
    Response: {type: String, trim: true},
    email: {type: String, trim: true},
  }, {
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
  });

  var Response = mongoose.model('Response', schema);

  module.exports = Response;

var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var studentSchema = new Schema({
  name: String,
  githubId: String,
  cohort: String,
  score: Number
});

module.exports = mongoose.model('Student', studentSchema);

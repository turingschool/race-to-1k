var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var studentSchema = new Schema({
  name: String,
  githubId: String,
  githubName: String,
  avatarUrl: String,
  cohort: String,
  intermission: Number,
  nodeProject: Number,
  electronProject: Number,
  reactNativeProject: Number,
  capstoneProject: Number,
  dangerousDenver: Number,
  mockAssessment: Number,
  homework: Number,
  studentLedSession: Number,
  finalAssessment: Number,
  extraCredit: Number,
});

module.exports = mongoose.model('Student', studentSchema);

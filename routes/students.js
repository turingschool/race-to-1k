var express = require('express');
var router = express.Router();
var Student = require('../models/student')

/* GET users listing. */
router.get('/all_points', ensureTeacher, function(req, res) {
    Student.find(function(err, students) {
      if (err) {
        res.send(err)
      }
      // res.render(view, locals)
      res.send(students)
  })
})

router.get('/points', function(req, res){
  const { user } = req
  Student.findOne({githubId: user.githubId}, function(err, student) {
    if (err) {
      res.send(err)
    }
    // res.render(view, locals)
    res.render('points', { student });
  })
});

function ensureTeacher(req, res, next) {
  if (user.githubId === "7967403") { return next(); }
  res.redirect('/account')
}

module.exports = router;

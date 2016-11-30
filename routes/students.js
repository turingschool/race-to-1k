var express = require('express');
var methodOverride = require('method-override')
var router = express.Router();
var Student = require('../models/student')
var sixteenOhSix = ["ab255","kccrs","Jeff-Duke", "bcgodfrey91","bretthev"
                    ,"madison-kerndt","david-kerr","kylem038","07nguyenpaul"
                    ,"sikemausa","Peter-Springer","swanie21","mjvalade"
                    ,"blake-worsley","Alex-Tideman","stevekinney"]

router.use(methodOverride('X-HTTP-Method-Override'))
router.use(methodOverride('_method'))

/* GET users listing. */
router.get('/', ensureTeacher, function(req, res) {
  const { user } = req
  Student.findOne({githubId: user.githubId}, function(err, student) {
    if (err) {
      res.send(err)
    }
    Student.find(function(err, students) {
      if (err) {
        res.send(err)
      }
      // res.render(view, locals)
      res.render('students', { students, student })
    })
  })
})

router.get('/points', ensureStudent, function(req, res){
  const { user } = req
  Student.findOne({githubId: user.githubId}, function(err, student) {
    if (err) {
      res.send(err)
    }
    // res.render(view, locals)
    let totalPoints = getTotalPoints(student)
    res.render('points', { student, totalPoints });
  })
});

router.get('/:id', ensureTeacher, function(req, res){
  Student.findOne({githubId: req.params.id}, function(err, student) {
    if (err) {
      res.send(err)
    }
    let totalPoints = getTotalPoints(student)
    res.render('points', { student, totalPoints });
  })
});

router.get('/:id/edit', ensureTeacher, function(req, res){
  Student.findOne({githubId: req.params.id}, function(err, student) {
    if (err) {
      res.send(err)
    }
    res.render('form', { student });
  })
});


router.put('/:id', function(req, res){
  Student.findOne({githubId: req.params.id}, function(err, student) {
    if (err) {
      res.send(err)
    }
    for (prop in req.body) {
      student[prop] = req.body[prop]
    }

    // Save the dinosaur
    student.save(function(err) {
      if (err) {
        res.send(err)
      }
      res.redirect('/all_points');
    })
  })
});


function ensureTeacher(req, res, next) {
  const { user } = req
  if (user.githubId === "7967403") { return next(); }
  res.redirect('/')
}

function ensureStudent(req, res, next) {
  const { user } = req
  if ((sixteenOhSix.indexOf(user.githubName) > -1)) { return next(); }
  res.redirect('/')
}

function getTotalPoints(student) {
  let { intermission, nodeProject, electronProject, reactNativeProject
      , capstoneProject, dangerousDenver, mockAssessment, homework
      , studentLedSession, finalAssessment, extraCredit } = student

  let totalPoints = intermission + nodeProject + electronProject + reactNativeProject
       + capstoneProject + dangerousDenver + mockAssessment

  return totalPoints
}

module.exports = router;

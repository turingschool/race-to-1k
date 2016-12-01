var express = require('express')
var passport = require('passport')
var util = require('util')
const path = require('path');
var session = require('express-session')
var bodyParser = require('body-parser')
var methodOverride = require('method-override')
var GitHubStrategy = require('passport-github2').Strategy
var partials = require('express-partials')
var mongoose = require('mongoose')
var students = require('./routes/students')
var Student = require('./models/student')
var teachers = ["stevekinney","brittanystoroz","Alex-Tideman"]

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  Student.findOne({githubId: user.githubId}, function(err,student) {
    done(null, student);
  })
});

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    // callbackURL: "http://localhost:3000/auth/github/callback"
    callbackURL: "https://race-to-1k.herokuapp.com/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, done) {
     Student.findOne({
         'githubId': profile.id
     }, function(err, student) {
         if (err) {
             return done(err);
         }
         if (!student) {
             student = new Student({
                githubId: profile.id,
                name: profile.displayName,
                githubName: profile._json.login,
                avatarUrl: profile._json.avatar_url,
                cohort: "1606",
                intermission: 0,
                nodeProject: 0,
                electronProject: 0,
                reactNativeProject: 0,
                capstoneProject: 0,
                dangerousDenver: 0,
                mockAssessment: 0,
                homework: 0,
                studentLedSession: 0,
                finalAssessment: 0,
                extraCredit: 0,
             });
             student.save(function(err) {
                 if (err) console.log(err);
                 return done(err, student);
             });
         } else {
          return done(err, student);
         }
     });
 }
));

// Configure express
var app = express()
app.set('views', __dirname + '/views')
app.set('view engine', 'ejs')
app.use(partials());
app.use(session({ secret: 'dinosaurs roar', resave: false, saveUninitialized: false }));
app.use(bodyParser.json())
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')))
// Authenticate students
app.use('/students', ensureAuthenticated, students)

//Configure DB
// var dbName = 'studentDB';
// var connectionString = 'mongodb://localhost:27017/' + dbName;
// mongoose.connect(connectionString);

mongoose.connect(process.env.MONGOLAB_URI, function (error) {
    if (error) console.error(error);
    else console.log('mongo connected');
});

app.locals.title = "Race to 1k"


app.get('/', function(req, res){
  const { user } = req
    if(req.user) {
      Student.findOne({githubId: user.githubId}, function(err, student) {
        if (err) {
          res.send(err)
        }
      res.render('points', { student });
    })
  }
  res.render('index', { student: null });
});

app.get('/auth/github',
  passport.authenticate('github', { scope: [ 'student:email' ] }),
  function(req, res){
    // The request will be redirected to GitHub for authentication, so this
    // function will not be called.
  });

app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/' }),
  function(req, res) {
    if ((teachers.indexOf(user.githubName) > -1)) {
      res.redirect('/students');
    }
    res.redirect('/students/points');
  });

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/')
}

var port_number = process.env.PORT || 3000

app.listen(port_number, () => {
  console.log(`${app.locals.title} is running on ${port_number}.`);
});

module.exports = app

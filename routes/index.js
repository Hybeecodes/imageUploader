var express = require('express');
var router = express.Router();
var multer = require('multer');
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/imageUpload');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null,__dirname, '/uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
})
 
var upload = multer({ storage: storage })
 

router.post('/upload',upload.single('picture'),function(req,res,next){
  var dir = req.file.path;
  var db = req.db;

  var collection = db.get('images');

  collection.insert(req.file,function(err,doc){
    if(err){
      res.send('There was an issue saving the file');
    }
    else{
      res.redirect('/');
    }
  })
  
});

/* GET home page. */
router.get('/', function(req, res, next) {
  var db = req.db;
  var collection = db.get('images')
  collection.find().then(function(err,images){
  res.render('index', { title: 'Express',images:images });
    
  });

});

module.exports = router;

var express = require('express');
var router = express.Router();
var multer = require('multer');
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/imageUpload');
var cookieParser = require('cookie-parser');
var csrf = require('csurf');
var clipboard = require('clipboard-js');
var jquery = require('jquery');
var Client = require('node-rest-client').Client;

var client = new Client();

var root = 'https://jsonplaceholder.typicode.com';

var csrfProtection = csrf();
// router.use(csrfProtection);
var loc = __dirname+"/upload";
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, loc)
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
})
 

var upload = multer({ storage: storage })

router.get('/get_images',function(req,res,next){
  client.get('http://localhost:4000/get_all_images',function(data,response){
  console.log(data);

  console.log(response);
  res.json(data);
});

})
 

router.post('/upload',upload.single('picture'),function(req,res,next){
  var dir = req.file.path;
  var db = req.db;

  var collection = db.get('images');

  //check for existence
  // collection.find({originalname:req.file.originalname},function(err,image){
  //   if(image){
  //     res.redirect('/');
  //   }
  //   else{
      collection.insert(req.file,function(err,doc){
    if(err){
      res.send('There was an issue saving the file');
    }
    else{
      res.redirect('/');
    }
  })
  //   }

  // })

  
  
});

/* GET home page. */
router.get('/', function(req, res, next) {
  var db = req.db;
  var collection = db.get('images')
  collection.find({},{},function(err,images){
    
    res.render('index', { title: 'Image Uploader',images:images});
  });
    
  });


module.exports = router;

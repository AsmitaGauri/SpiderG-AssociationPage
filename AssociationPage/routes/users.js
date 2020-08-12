var express = require('express');
var mongoose=require('mongoose');
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
var bodyParser=require('body-parser');
var User=require('../models/users');
const multer = require('multer');
var path=require('path');
var sesClient=require('../server_client');
/* GET users listing. */
var userRouter=express.Router();
userRouter.use(bodyParser.json());
userRouter.use(bodyParser.urlencoded({extended:true}));

var Storage=multer.diskStorage({
 destination:'./public/images/',
 filename:(req,file,cb)=>{
   cb(null, file.fieldname+"_"+Date.now()+"-"+Math.round(Math.random() * 1E9)+"-"+file.originalname);
 }
 });

const fileFilter =(req,file,cb)=>{
  if(file.mimetype==='image/jpeg' || file.mimetype==='image/png'){
    cb(null,true);
  }else{
    cb(new Error('Upload Images only'),false);
  }
  
  
}


var upload=multer({
  storage:Storage,
  fileFilter:fileFilter
});



//test


//test
userRouter.get('/:userId/:associationName', function(req, res, next) {
 
  
  User.findById(req.params.userId,function(err,user){
    if(err){
      res.send('This site is on progress!');
      res.statusCode=404;

      res.redirect('/');
    }else{
      res.statusCode=200;
      
      res.render("users",{user:user});

    }
  });
});

userRouter.post('/',upload.fields([
  {
    name:"DescImg",
    maxCount:1
  },
  {
    name:"galleryImag",
    maxCount:8
  },
  {
    name:"P1Img",
    maxCount:1
  },
  {
    name:"P2Img",
    maxCount:1
  },
  {
    name:"P3Img",
    maxCount:1,
  
  }
]),function(req,res,next){


  if(typeof req.files['P2Img']=="undefined"){
    var P2ImgUploaded="default.png"
  }else{
    var P2ImgUploaded=req.files['P2Img'][0].filename;
  }

  if(typeof req.files['P3Img']=="undefined"){
    var P3ImgUploaded="default.png"
  }else{
    var P3ImgUploaded=req.files['P3Img'][0].filename;
  }


  var newuser={
    _id:mongoose.Types.ObjectId(),
    Associationname:req.body.Associationname,
    AssociationType:req.body.AssociationType,
    DescHeading:req.body.DescHeading,
    desc:req.body.desc,

    DescImg: req.files['DescImg'][0].filename,

  activeMembers:req.body.activeMembers,
 
  totalEvents:req.body.totalEvents,

  galleryImag:req.files['galleryImag'],

  P1name:req.body.P1name,

  P1Pos:req.body.P1Pos,

  P1Img:req.files['P1Img'][0].filename,

  P2name:req.body.P2name,

  P2Pos:req.body.P2Pos,

  P2Img:P2ImgUploaded,

  P3name:req.body.P3name,

  P3Pos:req.body.P3Pos,

  P3Img: P3ImgUploaded,


  address:req.body.address,

  Phone:req.body.Phone,

  email:req.body.email,

  hrs:req.body.hrs,

  pin:req.body.pin,
  days:req.body.days

  };
  // console.log(newuser);
  User.create(newuser)
  .then((user)=>{
    console.log(user);
    res.statusCode=200;
    
    res.redirect('/users/'+user._id+"/"+user.Associationname);
  },(err)=> alert(err.message))
  .catch((err)=> alert(err,message));

});


userRouter.post('/:userId/form-submit',function(req,res,next){


  User.findById(req.params.userId,function(err,user){

    if(err){
      res.send('Some error ocurred try sending again!');
    }else{
      var name= req.body.name;
     var customerEmail=req.body.email;
     var toEmail=user.email;
    var subject=req.body.subject;
    var message =req.body.message;
    var newEmail={
    name:name,
    customerEmail:customerEmail,
    toEmail:user.email,
    subject:subject,
    message:message
  }
  console.log(newEmail);
  
  // sesClient.sendEmail(customerEmail, subject, message,toEmail);
  res.send("Thank you for submitting!");
    }
    
  });
  
  
    
});

module.exports = userRouter;

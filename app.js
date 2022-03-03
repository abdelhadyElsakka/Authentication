//jshint esversion:6
require("dotenv").config();
const express=require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const mongoose=require("mongoose");
const encrypt=require("mongoose-encryption");


const app =express();

app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
  name:String,
  password:String
});

secret = process.env.SECRET;
userSchema.plugin(encrypt,{secret:secret,encryptedFields:["password"]});

const User = new mongoose.model("User",userSchema);

app.get("/",function(req,res){
  res.render("home");
});

app.get("/login",function(req,res){
  res.render("login");
});

app.get("/register",function(req,res){
  res.render("register");
});

app.get("/secrets",function(req,res){
  res.render("secrets");
});

app.get("/submit",function(req,res){
  res.render("submit");
});

app.post("/register",function(req,res){
  name=req.body.username;
  password=req.body.password;

  User.findOne({name:name},function(err,founduser){
    if (founduser){
      res.send("you already has an account");
    }else{
      const newUser = new User({
        name:name,
        password:password
      });
      newUser.save(function(err){
        if (err){
          console.log(err);
        }else{
          res.render("secrets");
        }
      });

    }
  });
});

app.post("/login",function(req,res){
  name=req.body.username;
  password=req.body.password;
User.findOne({name:name},function(err,founduser){
  if (err){
    console.log(err);
  }else{
    if(founduser){
      if(founduser.password === password){
        res.render("secrets");
      }
    }else{
      res.render('register');
    }
  }
});

});


app.listen(3000, function(){
  console.log("your server is running 3000");
});

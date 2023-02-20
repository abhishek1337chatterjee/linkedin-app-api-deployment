const express = require("express");

const userRouter = express.Router();

const jwt = require("jsonwebtoken");

const bcrypt = require('bcrypt');
const { UserModel } = require("../Models/Users.model");

userRouter.get("/", async (req, res) => {
  try {
    const user = new UserModel();
    res.send(user);
  } catch (error) {
    res.send({ msg: "Cannot get User", error: error.message });
  }
});

userRouter.post("/register", async (req, res) => {
  const { name, email, gender, age, city, pass } = req.body;
  try {
    bcrypt.hash(pass, 5, async (err, hash) => {
      if (err) {
        res.send({ msg: "Could not register", error: err.message });
      } else {
        const user = new UserModel({ name, email, gender,age,city, pass: hash });
        await user.save();
        res.send({ msg: "New User has Registered"});
      }
    });
  } catch (error) {
    res.send({ msg: "Could not register", error: error.message });
  }
});

userRouter.post("/login", async(req, res) => {
  const {email, pass} = req.body;
  try {
    const user = await UserModel.find({email});
    if(user.length > 0) {
      bcrypt.compare(pass, user[0].pass, (err, result)=>{
        if(result){
          const token = jwt.sign({userID: user[0]._id}, "saheb1337")
          res.send({msg: "User Logged in", token: token})
        }else{
          res.send({msg: "Cannot able to login", error: err})
        }
      })
    }
  } catch (error) {
    res.send({msg: "Could not Logged in", error: error.message})
  }
})

module.exports = {
    userRouter
}

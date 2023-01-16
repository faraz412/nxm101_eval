const express=require("express");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
require("dotenv").config();
const {UserModel} =require("../models/user.model");

const userRouter=express.Router();

userRouter.post("/register", async (req,res)=>{
    const {name,email,gender,password}=req.body;
    try{
        const user=await UserModel.find({email});
        if(user.length==0){
            bcrypt.hash(password,7, async(err,hash)=>{
                if(err){
                    console.log(err);
                }else{
                    const new_user=new UserModel({name,email,gender,password:hash});
                    await new_user.save();
                    res.send({"msg":"Registered"});
                }
            })
        }else{
            res.send({"msg":"Please Login"});
        }
    }catch(err){
        console.log("error in registering new user");
    }
})

userRouter.post("/login", async (req,res)=>{
    const {email,password}=req.body;
    try{
        const user=await UserModel.find({email});
        if(user.length>0){
            bcrypt.compare(password,user[0].password, (err,result)=>{
                if(result){
                    const token=jwt.sign({userID:user[0]._id},process.env.key);
                    res.send({"msg":"Login Successful", "token":token});
                }else{
                    res.send({"msg":"Wrong Credentials"});
                }
            })
        }else{
            res.send({"msg":"Wrong Credentials"});
        }
    }catch(err){
        console.log("error in logging in");
    }
})

module.exports={userRouter};
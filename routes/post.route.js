const express=require("express");
require("dotenv").config();
const {PostModel} =require("../models/post.model.js");

const postRouter=express.Router();

postRouter.get("/", async(req,res)=>{
    const query=req.query;
    //console.log(query);
    const userID=req.body.userID;
    let posts;
    try{
        if(query.device){
            posts=await PostModel.find({userID:userID,device:query.device});
        }
        else if(query.device1 && query.device2){
             posts=await PostModel.find( { $and: [ { userID}, { device: query.device1 }, { device: query.device2 }] } );
        }
        else{
            posts=await PostModel.find({userID});
        }
        res.send(posts);
    }catch(err){
        res.send({"err in getting posts":err});
    }
})

postRouter.post("/create", async(req,res)=>{
    const payload=req.body;
    try{
        const post=new PostModel(payload);
        await post.save();
        res.send({"msg":"Post created"});
    }catch(err){
        res.send({"err in posting data":err});
    }
})


postRouter.patch("/update/:id", async(req,res)=>{
    const ID=req.params.id;
    const payload=req.body;
    try{
        const post=await PostModel.findOne({_id:ID});
        const userID_in_post=post.userID;
        const userID_req=req.body.userID;
        if(userID_in_post==userID_req){
            await PostModel.findByIdAndUpdate({_id:ID},payload);
            res.send({"msg":"Post Updated"});
        }else{
            res.send({"msg":"You are not authorized"});
        }
    }catch(err){
        res.send({"err in updating data":err});
    }
})


postRouter.delete("/delete/:id", async(req,res)=>{
    const ID=req.params.id;
    try{
        const post=await PostModel.findOne({_id:ID});
        const userID_in_post=post.userID;
        const userID_req=req.body.userID;
        if(userID_in_post==userID_req){
            await PostModel.findByIdAndDelete({_id:ID});
            res.send({"msg":"Post Deleted"});
        }else{
            res.send({"msg":"You are not authorized"});
        }
    }catch(err){
        res.send({"err in updating data":err});
    }
})

module.exports={postRouter};
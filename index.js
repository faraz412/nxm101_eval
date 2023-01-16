const express=require("express");
const cors=require("cors");
const {connection}= require("./config/db.js");
const {userRouter}= require("./routes/user.route.js");
const {postRouter}= require("./routes/post.route.js");
const { authenticator } = require("./middlewares/authenticator.js");
require("dotenv").config();

const app=express();
app.use(express.json());
app.use(cors());

app.get("/",(req,res)=>{
    res.send("Welcome to Social Media App Home Page");
})

app.use("/users",userRouter);
app.use(authenticator);
app.use("/posts",postRouter);


app.listen(process.env.port, async()=>{
    try{
        await connection;
        console.log("Connected to db");
    }catch(err){
        console.log("Error connecting to DB");
    }
    console.log(`Server running on port ${process.env.port}`);
})
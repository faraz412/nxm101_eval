require("dotenv").config();
const jwt=require("jsonwebtoken");

const authenticator=(req,res,next)=>{
    const token=req.headers.authorization;
    if(token){
        const decoded=jwt.verify(token,process.env.key);
        if(decoded){
            const userID=decoded.userID;
            req.body.userID=userID;
            next();
        }else{
            res.send({"msg":"You are not authorized"});
        }
    }else{
        res.send({"msg":"You are not authorized"});
    }
}

module.exports={authenticator};
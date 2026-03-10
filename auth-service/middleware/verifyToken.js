const jwt = require("jsonwebtoken");

module.exports = function(req,res,next){

 const token = req.headers["authorization"];

 if(!token){
  return res.status(403).json({message:"Token required"});
 }

 const realToken = token.split(" ")[1];

 jwt.verify(realToken, process.env.JWT_SECRET || "mysecret", (err,user)=>{

  if(err){
   return res.status(401).json({message:"Invalid token"});
  }

  req.user = user;
  next();

 });

};

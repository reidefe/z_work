const jwt = require('jsonwebtoken');
var express = require('express')
const { User,} =require('../model/index')

var cookieParser = require('cookie-parser')
 
var app = express()
app.use(cookieParser())

exports.auth = (req,res,next) =>{
    try{
        const token = req.Headers.authorization;
        const decoded = jwt.verify(token, '', function(err, decoded){
            if(err){
                return console.log(err)
            }
            else{
                return console.log(decoded.handle)
            }
        } );
        console.log(token)
       /*  req.userData = decoded;
        next(); */
    }catch(error){
        return res.status(401).json({

            message: "failed to grant access to resource"
        })
    }

   
};
                                                             
exports.checkAgain = (req,res, next) => {
    var token =req.query.token ||
    req.headers['x-access-token'] ||
    req.body.token ||
    req.cookies.token;
    if(!token){
        res.send(401, 'invalid or missing koen')
    }
    else{
        jwt.verify(token, 'nosayaba')
      
    }
}

exports.wellAgain = (req,res,next) => {    
        const tok =
        req.body.token ||         
        req.headers.authorization ||    
        req.query.token ||
        req.headers['x-access-token'] 
        //req.Cookies.token;

        console.log(tok)
        //req.cookie.token
      
    if (!tok) {      
        res.status(401).send('Unauthorized: No token provided');
    } else {
        jwt.verify(req.cookies.token,'nosayaba', function(err, decoded) {
        if (err) {
            return res.status(401).send('Unauthorized: Invalid token');
        } else {
            next()
         /*  return res.status(200) .send('auth allowed')
          next() */
            
        }
        });
    }    

    
}
const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const fs = require('fs')
var app = express()
var { User,  Cont,} = require('../model/index')
var bodyparser = require('body-parser')
const cookieParser = require('cookie-parser')
const multer = require('multer')
app.use(cookieParser())
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:false}));
const cors = require('cors')
const refreshTokenSecret = 'nosayaba123';
const refreshTokens = [];

app.use(cors());


var storage = multer.diskStorage({    
    destination: function(req,file,cb){
        cb(null, __dirname  + '/uploads')
    },
    filename: function(req,file,cb){
        cb(null, file.fieldname + '_' + Date.now() + "_" + file.originalname)         
    }         
})
exports.upload = multer({storage: storage}, )


exports.signup = (req, res, next) => {  
    bcrypt.hash(req.body.password, 10,(err, hash) =>{
        if (err) return res.status(500) .json({
            error: err
        })
        else{
            User.findOrCreate( {where: { name: req.body.name }, defaults:{password:hash, email: req.body.email}})
            .then(user => res.json(user)) 
            .catch((error)=>{
                console.log(error)
                return res.json('Error when trying to upload file', error)           
            })
        }
    })
   
}


//post upload file(s) to the server
exports.uploadFiles = async (req,res) => {
    try{
        console.log(req.file)

        if(req.file == undefined){
            return res.send('pls select a file');
        }
        Cont.create({
            filename: req.file.originalname,
            filetype: req.file.mimetype,
            filesize: req.file.size,
            data:fs.readFileSync(__dirname + '/uploads/' + req.file.filename)
        }).then((file) => {
            fs.writeFileSync(__dirname + '/uploads/' + file.name, file.data)
            return res.json({'msg': 'File uploaded successfully!', 'file': req.file})
        })
    }catch(error){
        console.log(error)
        return res.json({'err': error})
    }
} 


//get uploaded files based on query options
exports.getsizedfiles = (req, res, next) => {
    list_size = req.query.list_size
    page_number = req.query.page_number
    if(req.params == '' || req.params == 'undefined'){                
        page_number = 1
        Cont.findAll({ limit:10})
    }
    else((req,res) =>{
        list_size = req.query.list_size
        list_sizes = req.params
        page_number = req.query.page_number
        Cont.findAll({limit : list_sizes})
        .then((lists) =>{
            return res.json(lists)
    }).catch(error =>{
        console.log(error)
        return res.json('Error when trying to return upload file or not enough files', error) 
    })
    })


}

//delete files from params input
exports.deletefilesbyid = (req,res) =>{
    //id = req.params.id
    Cont.destroy({
        where: {
            id:req.params.id
        }
    }) .then((deletedfile) =>{
        console.log('file deleted  ')
        res.json('file deleted')
    }).catch(error =>{
        console.log(error)
        return res.json('Error when trying to delete file', error) 
    })

}

//Post update file
exports.updatefile = (req,res) =>{
    Cont.update({
        filename: req.file.originalname,
        filetype: req.file.mimetype,
        filesize: req.file.size,
        data:fs.readFileSync(__basedir + '/uploads' + req.file.filename)
    }, {where: req.params.id}
    ).then((file) => {
        fs.writeFileSync(__basedir + '/uploads' + file.name, file.data)
        return res.send(file.filename,  'has been uploaded to the server')
    })
}

// get user id from name 
exports.userinfo = (req,res,) =>{
    User.findOne({ where: {
        name: req.body.name
    }}).then((user) =>{
        return res.json({
            id:user.id
        })        
    }).catch(error =>{
        console.log(error)
        return res.json('Error when trying to find user credentials', error) 
    })
}

//get file details from its ID
exports.getfileinfo = (req,res,next) =>{
    Cont.findOne({ where: {
        id: req.params.id
    }}).then((file) =>{
        return res.json({
            fieldname: file.fieldname,
            filename: file.filename,
            filetype: file.filetype,
            filesize: file.filesize
        })
    }).catch(error =>{
        console.log(error)
        return res.json('Error when trying to get file details from ID', error) 
    })
}

// get a specific file from ID
exports.getfile = (req, res, next) => {
    Cont.findOne({ where: {
        id: req.params.id
    }}).then((file) =>{
        return res.json( file)
    }).catch(error =>{
        console.log(error)
        return res.json('Error when trying to get a specific file', error) 
    })   
}

//Local signin with jwt
exports.signin = (req,res, next) => {
    const accesstokensecret = 'nosayaba'
    const refreshTokenSecret = 'nosayaba123';
    const refreshTokens = [];
    User.findOne({ where: { name: req.body.name}})
    .then((user, err) =>{
        if(err){
            return res.status(401) .json({
                message: 'auth failed because user doesnt exist'
            }) 
        }
        bcrypt.compare(req.body.password,  user.password, (err, result) =>{
            if(err){
                return res.status(401) .json({
                    //message: 'auth failed to login user',
                    message: 'auth failed to login user due to insufficient or bad credentials'

                })
            } 
            else  {
               const accesstoken =  jwt.sign({                   
                   id: user.id,
                   name: user.name,
                   password: user.password,
               },
               accesstokensecret,
               { expiresIn: '10d'},
               );
               const refreshtoken = jwt.sign({                   
                id: user.id,
                name: user.name,
                password: user.password,
                },
                refreshTokenSecret);
                refreshTokens.push(refreshtoken)
                //res.cookie('token', accesstoken,{ expires:'10d' }); 
                //console.log(req.cookies)
                res.status(200) .json({
                    message: 'auth successful for user',
                    token: accesstoken,
                }) 
                
            }     
        
    }) 
})

}


//new token generator
exports.newtoken = (req,res,next) =>{
    const { token } = req.body;

    if (!token) {
        return res.sendStatus(401);
    }

    if (!refreshTokens.includes(token)) {
        return res.sendStatus(403);
    }
    jwt.verify(token, refreshTokenSecret, (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }

        const accessToken = jwt.sign({ username: user.username, role: user.role }, accessTokenSecret, { expiresIn: '20m' });

        res.json({
            accessToken
        });
    });

}

     


exports.logout = (req, res) => {
    const { token } = req.body;
    refreshTokens = refreshTokens.filter(token => t !== token);
    res.send("Logout successful");
}
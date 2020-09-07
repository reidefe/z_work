
var express = require('express')
var app = express()
const http = require('http').createServer(app)
const jwt = require('jsonwebtoken')

var bodyparser = require('body-parser')
var contrl = require('./controller/index')


const port = process.env.PORT || 8080
app.use(bodyparser.json())

const jwtauth = (req,res,next) => {  
    const accesstokensecret = 'nosayaba'
    const refreshTokenSecret = 'nosayba123';
    const { token } = req.body;
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, accesstokensecret, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }

            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
    
    
} 


http.listen(port,() =>{
    console.log('server started')
})
app.post('/signin',  contrl.signin )
app.post('/signup', contrl.signup)
app.post('/signin/new_token',jwtauth, contrl.newtoken)
app.post('/upload', jwtauth, contrl.upload.single('files'), contrl.uploadFiles)
app.get('/file/list', jwtauth, contrl.getsizedfiles)
app.delete('/file/delete/:id/', jwtauth, contrl.deletefilesbyid)
app.get('/file/:id/', jwtauth, contrl.getfileinfo)
app.get('/file/download/:id/', jwtauth, contrl.getfile)
app.put('/file/update/:id/', jwtauth, contrl.updatefile)
app.get('/info/',  contrl.userinfo)
app.get('/logout', jwtauth, contrl.logout)
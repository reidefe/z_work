const Sequelize = require('sequelize');
const user = require('./userModel')
const group = require('./groupModel');
const msg = require('./mesgModel');
const cont = require('./contModel');


const path = 'mysql://5O5shdaYRF:Kt4wBbfdRU@remotemysql.com:3306/5O5shdaYRF';

const sequelize = new Sequelize( path, { operatorAliases: false} ); 

//const userTag = sequelize.define('user_tag', {});

const User = user(sequelize, Sequelize)

const Cont = cont(sequelize, Sequelize)

User.hasMany(Cont )







sequelize.sync()
  .then(() => {
    console.log(`Database & tables created!`)
  })

  module.exports = {
    User,
    
    Cont
  }

  
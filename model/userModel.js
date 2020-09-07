const Sequelize = require('sequelize');

const uuid = require('uuid')

module.exports = (sequelize,type) => {

       return sequelize.define('user', {
       
        name: {
            type: type.STRING,
            validate: {
                min: 4,            
            },
        },
        password: {
            type: type.STRING,
            validate: {
                min: 6,            
            }
        },
        email: {
            type: type.STRING
        },
     
       })
            
} 
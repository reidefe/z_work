//const { Sequelize } = require("sequelize/types")
const Sequelize = require('sequelize');

module.exports = (sequelize,type) => {
    return sequelize.define('cont', {       
        fieldname:{
            type:type.STRING
        },
        data:{
             type: type.BLOB('long')
        },
        filename:{
            type:type.STRING
        },
        filesize:{
            type:type.STRING
        },
        filetype: {
            type:type.STRING
        },
        filedate: {
            type:type.DATE
        }       

     
    })
         
}


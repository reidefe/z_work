
module.exports = (sequelize,type) => {

    return sequelize.define('msg', {
        
        
      /*   userId: {
            type: Sequelize.UUID
    
         },
        groupId: {
            type: Sequelize.UUID
    
        }, */
        date: {
            type: type.DATE,
            defaultValue: type.NOW,
    
        },
        messages: {
            type: type.TEXT
        },
    })
         
}
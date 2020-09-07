
module.exports = (sequelize,type) => {

    return sequelize.define('group', {
        name: {
            type:type.STRING,
            validate: {
                min: 4,
                
            }
        },
        description: type.TEXT,
    })
         
}
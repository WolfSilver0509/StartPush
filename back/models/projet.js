const { DataTypes } = require('sequelize');
const sequelize = require('./connector');


const Projet = {
    schema: {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            
        },
        content: {
            type: DataTypes.STRING,
            allowNull: false,
           
        },
        image: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    },
    tableName: "Projet"
}


module.exports = Projet;
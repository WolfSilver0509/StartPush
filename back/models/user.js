const { DataTypes } = require('sequelize');
const sequelize = require('./connector');


const User = {
    schema: {
        pseudo: {
            type: DataTypes.STRING,
            allowNull: false,
            unique:true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique:true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        image: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        isAdmin: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            default:false
        }
    },
    tableName: "User"
}


module.exports = User;
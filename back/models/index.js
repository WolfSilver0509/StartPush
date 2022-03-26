const sequelize = require('./connector');
const { DataTypes } = require('sequelize');

const User = require('./user');
const Projet = require ('./projet')

class ModelManager {
    constructor(){
    }

    init(){
        const user = sequelize.define(User.tableName, User.schema, {
            tableName: User.tableName
        })

        const projet = sequelize.define(Projet.tableName, Projet.schema, {
            tableName: Projet.tableName
        })
        
        try {
            user.hasMany(projet,{ onDelete: 'cascade', hooks:true })
            projet.belongsTo(user)
        } catch (error) {
            console.log(error)
        }
    }


    getModels(){
        return sequelize.models;
    }

    getModel(str){
        return sequelize.models[str];
    }
}

module.exports = ModelManager


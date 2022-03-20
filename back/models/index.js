const sequelize = require('./connector');
const { DataTypes } = require('sequelize');

const User = require('./user');


class ModelManager {
    constructor(){
    }

    init(){
        const user = sequelize.define(User.tableName, User.schema, {
            tableName: User.tableName
        })
    }

    getModels(){
        return sequelize.models;
    }

    getModel(str){
        return sequelize.models[str];
    }
}

module.exports = ModelManager


const ModelManager = require("../models/index")

const mm = new ModelManager()

const UserModel = mm.getModel("User")
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const fs = require("fs");

exports.signup = (req, res, next) => {  // async
   console.log("ici avant le hash");
   let fileName = null;
   if (req.file != null) {
    fileName = `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`;
  }
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = UserModel.create({

                pseudo: req.body.pseudo,
                email: req.body.email,
                isAdmin:false,
                image: fileName,
                password: hash
                
            }).then(() => {
                console.log('utilisateur enregistré');
                res.status(201).json({ message: 'utilisateur créé'});
            }).catch(error => {
                console.log('error in controllers/auth.js : ' + error);
                res.status(400).json({ error: 'erreur d\'authentification'})
            });
        })
        .catch(error => res.status(500).json({ error }));
};


exports.login = (req, res, next) => {
    UserModel.findOne({ where: {pseudo: req.body.pseudo}})
        .then((userData) => {
            if(!userData) {
                return res.status(401).json({ error: 'utilisateur non trouvé '});
            }
            bcrypt.compare(req.body.password, userData.password)
                .then(valid => {
                    if(!valid) {
                        return res.status(401).json({ error: 'Password incorrect'});
                    }

                    const token = jwt.sign(
                        { userId: userData.id, isAdmin:userData.isAdmin }, // PLAYLOAD
                        process.env.TOKEN_SECRET, // Clé encryptage
                        { expiresIn: '24h' }
                    )

                    res.locals.user = userData.id;
                    res.status(200).json({
                        userId: userData.id,
                        pseudo: userData.pseudo,
                        isAdmin: userData.isAdmin,
                        email:userData.email,
                        token
                    });
                })
                .catch(error =>{
                    console.log(error);
                    res.status(500).json({ error })});
        })
        .catch(error => {
            console.log(error);
            res.status(400).json({ error: error});
        })
}

exports.checkToken = (req,res,next)=>{
    try {
        //récupère le token dans headers
      const token = req.headers.authorization.split(' ')[1];  
      req.token = jwt.verify(token,process.env.TOKEN_SECRET); // Verif token 
      res.status(200).json({message : true})
  
    } catch(error) {
        res.status(200).json({message : false})
  
    }
}
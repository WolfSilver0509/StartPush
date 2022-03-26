
const ModelManager = require("../models/index")

const mm = new ModelManager()

const User = mm.getModel("User");


const bcrypt = require('bcrypt');

const fs = require("fs");

exports.getUser = (req, res, next) => {
    console.log('user demandé : ' + req.params.id);
    User.findOne({ where: {id: req.params.id}})
        .then(user => {
            
            let userInfo = {
                pseudo: user.pseudo,
                image : user.image

            }
            res.status(200).json({userInfo})
        })

        .catch(error => res.status(400).json({ message: 'Error je ne trouve pas le User' }));
}



exports.updateUser = async (req, res, next) => {

    console.log('mise à jour d\'utilisateur demandée');

       
     const user = await User.findOne({ where: {id: req.params.id}})
     console.log(req.token, user);
     if ( user && user.id === req.token.userId || req.token.isAdmin){
       
            const userObject = 
            {
                pseudo:req.body.pseudo,

            };

            if(req.file){
                if (user.image){
                    const filename = user.image.split("/images/")[1];
                    fs.unlink(`images/${filename}`,()=>{
                     console.log("Image SUpp");
                    })
                }
                userObject.image=`${req.protocol}://${req.get("host")}/images/${
                    req.file.filename
                  }`;
            }
            console.log(userObject);
            User.update(userObject,{ where: {id: req.params.id}})
                .then(() => {
                    console.log('user mis à jour');
                    res.status(200).json({
                        

                        pseudo: userObject.pseudo,


                        message:'User mis à jour !'

                    })
                })
                .catch(error => 
                    {
                        console.log(error);
                        res.status(400).json({ message: 'Erreur actualisation utilisateur' })});
          
} else{
    res.status(401).json({message :' Vous n\'avez pas les droits de modification sur cette utilisateur'})
}  
}


//Supression d'un compte
exports.deleteUser = async (req, res) => {

    const user = await User.findOne({ where: { id: req.params.id }, })

    if (user && user.id === req.token.userId ||  req.token.isAdmin){
        try {
            user.destroy()
        } catch (error) {
            res.status(400).json({ message: 'Erreur suppression utilisateur' })
        }
        res.status(203).json({ message: 'Utilisateur supprimé' });
    }else{
        return res.status(400).json({message: 'Erreur je ne peut pas supprimé utilisateur'})    
    }

  };
const ModelManager = require("../models/index");

const mm = new ModelManager();

const Projet = mm.getModel("Projet");
const User = mm.getModel("User");
const fs = require("fs");

exports.createProject = (req, res, next) => {
  const _AuthUserId = req.token.userId;
  let fileName = null;
  if (req.file != null) {
    fileName = `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`;
  }
  const ProJect = Projet.create({
    title: req.body.title,
    content: req.body.content,
    UserId: _AuthUserId,
    image: fileName,
  })

    .then(() => {
      console.log("Project check");
      res.status(200).json({ message: "demande de projet ok" });
    })
    .catch((error) => {
      console.log("error in project controller : " + error);
      res.status(500).json({ error: error });
    });
};

exports.getAllProject = async (req, res, next) => {
  const ProjectResult = await Projet.findAll({
    include: [{ model: User, attributes: ["id", "pseudo"] }],

    order: [["updatedAt", "DESC"]],
  }); //Recups de tous les postes

  res.status(200).json(ProjectResult);
};

// "projets/:id"
exports.getProject = async (req, res, next) => {
  const _AuthUserId = req.token.userId;
  const ProjectResult =
    (await Projet.findOne({
      where: { id: req.params.id },
      include: [{ model: User, attributes: ["id", "pseudo"] }],
    })) || null; //Recups tout les Comments

  if (!ProjectResult) return res.status(404).json({ message: "not found" });

  res.status(200).json(ProjectResult);
};

exports.updateProject = async (req, res, next) => {
  const comment = await Projet.findOne({ where: { id: req.params.id } });

  if (comment.UserId === req.token.userId || req.token.isAdmin) {
    const CommentObject = {
      ...req.body,
    };
    if (req.file) {
      if (comment.image) {
        const filename = comment.image.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          console.log("Image SUpp");
        });
      }
      CommentObject.image = `${req.protocol}://${req.get("host")}/images/${
        req.file.filename
      }`;
    }
    console.log(CommentObject);
    comment
      .update(CommentObject, { where: { ...CommentObject, id: req.params.id } })
      .then(() => {
        console.log("Commentaire mis à jour");
        res.status(200).json({
          title: CommentObject.title,

          message: "Commentaire mis à jour !",
        });
      })
      .catch((error) => {
        console.log(error);
        res
          .status(400)
          .json({ message: "Erreur actualisation du Commentaire" });
      });
  } else {
    res.status(401).json({
      message: " Vous n'avez pas les droits de modification du Commentaire",
    });
  }
};

//Supression d'un commentaire
exports.deleteProject = async (req, res) => {
  const comment = await Projet.findOne({ where: { id: req.params.id } });

  if (comment.UserId === req.token.userId || req.token.isAdmin) {
    if (comment.image) {
      const filename = comment.image.split("/images/")[1];

      fs.unlink(`images/${filename}`, () => {
        try {
          comment.destroy();
        } catch (error) {
          res
            .status(400)
            .json({ message: "Erreur suppression de commentaire" });
        }
        res.status(203).json({ message: "Commentaire supprimé" });
      });
    } else {
      comment.destroy();
      res.status(203).json({ message: "Commentaire supprimé" });
    }
  } else {
    return res
      .status(400)
      .json({ message: "Erreur je ne peut pas supprimé ce commentaire" });
  }
};

import { Type } from "../models/model.js";
import validate from "../validators/validator.js";
import typeSchemas from "../validators/type.schemas.js";

const typeController = {
  async getAllTypes(req, res) {
    try {
      const types = await Type.find()
      return res.json(types);
    } catch (err) {
      return res.status(500).send(err.message);
    }
  },

  async getTypeById(req, res) {
    try {
      const typeId = req.params.id;
      const type = await Type.findOne({ _id: typeId });
      if (!type) {
        return res.status(404).send("Type introuvable");
      }
      return res.json(type);
    } catch (err) {
      return res.status(500).send(err.message);
    }
  },

  async deleteType(req, res) {
    try {
      const typeId = req.params.id;
      if (!typeId) {
        return res.status(400).send("ID introuvable.");
      }
      await Type.deleteOne({ _id: typeId });
      return res.status(200).send("Type supprimée avec succès");
    } catch (err) {
      return res.status(500).send(err.message);
    }
  },

  async updateType(req, res) {
    try {
      const typeId = req.params.id;
      const { name, description } = req.body;
      validate(typeSchemas.updateAndCreateData, req.body);

      // vérifie la présence de tous les params
      if (
        !name &&
        !description &&
        !typeId
      ) {
        return res
          .status(401)
          .send(
            "Il manque des paramètres parmis: name, description, typeId"
          );
      }

      const type = await Type.findByIdAndUpdate(
        typeId,
        { $set: { name, description } },
        { new: true }
      );

      if (!type) {
        return res.status(404).send("Type non trouvé");
      }

      return res.status(200).send(type);
    } catch (err) {
      return res.status(500).send(err.message);
    }
  },

  async createType(req, res) {
    try {
      const { name, description } = req.body;
      validate(typeSchemas.updateAndCreateData, req.body);
      const newType = new Type({
        name,
        description,
      });
      const savedType = await newType.save();
      return res.status(200).send(savedType);
    } catch (err) {
      return res.status(500).send(err.message);
    }
  },
};

export default typeController;

import {Color} from "../models/model.js";
import validate from "../validators/validator.js";
import colorSchemas from "../validators/color.schemas.js";

const colorController = {
  async getAllColors(req, res) {
    try {
      const colors = await Color.find()
      return res.json(colors);
    } catch (err) {
      return res.status(500).send(err.message);
    }
  },

  async getColorById(req, res) {
    try {
      const colorId = req.params.id;
      const color = await Color.findOne({ _id: colorId });
      if (!color) {
        return res.status(404).send("Couleur introuvable");
      }
      return res.json(color);
    } catch (err) {
      return res.status(500).send(err.message);
    }
  },

  async deleteColor(req, res) {
    try {
      const colorId = req.params.id;
      if (!colorId) {
        return res.status(400).send("ID introuvable.");
      }
      await Color.deleteOne({ _id: colorId });
      return res.status(200).send("Couleur supprimée avec succès");
    } catch (err) {
      return res.status(500).send(err.message);
    }
  },

  async updateColor(req, res) {
    try {
      const colorId = req.params.id;
      const { name, description } = req.body;
      validate(colorSchemas.updateAndCreateData, req.body);

      // vérifie la présence de tous les params
      if (
        !name &&
        !description &&
        !colorId
      ) {
        return res
          .status(401)
          .send(
            "Il manque des paramètres parmis: name, description, colorId"
          );
      }

      const color = await Color.findByIdAndUpdate(
        colorId,
        { $set: { name, description } },
        { new: true }
      );

      if (!color) {
        return res.status(404).send("Couleur non trouvé");
      }

      return res.status(200).send(color);
    } catch (err) {
      return res.status(500).send(err.message);
    }
  },

  async createColor(req, res) {
    try {
      const { name, description } = req.body;
      validate(colorSchemas.updateAndCreateData, req.body);
      const newColor = new Color({
        name,
        description,
      });
      const savedColor = await newColor.save();
      return res.status(200).send(savedColor);
    } catch (err) {
      return res.status(500).send(err.message);
    }
  },
};

export default colorController;

import { Beer, List } from "../models/model.js";
import validate from "../validators/validator.js";
import beerSchemas from "../validators/beer.schemas.js";

const beerController = {
  async getAllBeers(req, res) {
    try {
      const beers = await Beer.find().populate([
        "id_type",
        "id_color",
        "lists",
      ]);
      return res.json(beers);
    } catch (err) {
      return res.status(500).json(err.message);
    }
  },

  async getBeerById(req, res) {
    try {
      const beerId = req.params.id;
      const beer = await Beer.findOne({ _id: beerId }).populate([
        "id_type",
        "id_color",
        "lists",
      ]);
      if (!beer) {
        return res.status(404).json("Bière introuvable");
      }
      return res.json(beer);
    } catch (err) {
      return res.status(500).json(err.message);
    }
  },

  async deleteBeer(req, res) {
    try {
      const beerId = req.params.id;
      if (!beerId) {
        return res.status(400).json("ID introuvable.");
      }
      await Beer.deleteOne({ _id: beerId });
      return res.status(200).json("Bière supprimée avec succès");
    } catch (err) {
      return res.status(500).json(err.message);
    }
  },

  async updateBeer(req, res) {
    const beerId = req.params.id;
    try {
      const { name, description, url, degree, id_type, id_color } = req.body;
      validate(beerSchemas.updateAndCreateData, req.body);

      // vérifie la présence de tous les params
      if (
        !name &&
        !description &&
        !url &&
        !degree &&
        !id_type & !id_color &&
        !beerId
      ) {
        return res
          .status(401)
          .json(
            "Il manque des paramètres parmis: name, description, url, degree, id_type, id_color beerId"
          );
      }

      const beer = await Beer.findByIdAndUpdate(
        beerId,
        { $set: { name, description, url, degree, id_type, id_color } },
        { new: true }
      );

      console.log("beer : ", beer);

      if (!beer) {
        return res.status(404).json("Bière non trouvé");
      }

      return res.status(200).json(beer);
    } catch (err) {
      return res.status(500).json(err.message);
    }
  },

  async createBeer(req, res) {
    try {
      const { name, description, url, degree, id_type, id_color, lists } =
        req.body;
      validate(beerSchemas.updateAndCreateData, req.body);
      const newBeer = new Beer({
        name,
        description,
        url,
        degree,
        id_type,
        id_color,
      });
      const savedBeer = await newBeer.save();

      // ajoute la nouvelle bière dans les listes de req.body.lists
      lists.forEach(async (list) => {
        const l = await List.findById(list);
        l.beers.push(savedBeer._id);
      });

      return res.status(200).json(savedBeer);
    } catch (err) {
      return res.status(500).json(err.message);
    }
  },
};

export default beerController;

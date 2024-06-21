import { List, Beer } from "../models/model.js";
import validate from "../validators/validator.js";
import listSchemas from "../validators/list.schemas.js";

const listController = {
  async getAllLists(req, res) {
    console.log("getAllLists execution");
    const userId = req.userId;
    try {
      const lists = await List.find({ id_user: userId }).populate("beers");
      console.log("lists : ", lists);
      return res.json(lists);
    } catch (err) {
      return res.status(500).send(err.message);
    }
  },

  async getListById(req, res) {
    try {
      const listId = req.params.id;
      const list = await List.findOne({ _id: listId }).populate([
        "id_user",
        "beers",
      ]);
      if (!list) {
        return res.status(404).send("Liste introuvable");
      }
      return res.json(list);
    } catch (err) {
      return res.status(500).send(err.message);
    }
  },

  async deleteList(req, res) {
    try {
      const listId = req.params.id;
      if (!listId) {
        return res.status(400).send("ID introuvable.");
      }
      await List.deleteOne({ _id: listId });
      return res.status(200).send("Liste supprimée avec succès");
    } catch (err) {
      return res.status(500).send(err.message);
    }
  },


  async updateList(req, res) {
    try {
      const listId = req.params.id;
      const { name, removedIds, addedIds } = req.body;
      validate(listSchemas.updateData, req.body);

      const existingList = await List.findById(listId).beers;
      console.log("existingList : ", existingList);
      console.log("removedIds : ", removedIds);
      console.log("addedIds : ", addedIds);

      // Supprimer les valeurs contenues dans removedIds
      existingList = existingList.filter(item => !removedIds.includes(item));

      // Ajouter les valeurs contenues dans addedIds
      existingList = [...existingList, ...addedIds];

      // vérifie la présence de tous les params
      if (!name && !removedIds && !addedIds && !listId) {
        return res
          .status(401)
          .send("Il manque des paramètres parmis: name, removedIds, addedIds, listId");
      }

      const list = await List.findByIdAndUpdate(
        listId,
        { $set: { name, beers: existingList } },
        { new: false }
      );

      if (!list) {
        return res.status(404).send("Liste non trouvé");
      }

      return res.status(200).json(list);
    } catch (err) {
      return res.status(500).send(err.message);
    }
  },

  async createList(req, res) {
    try {
      const id_user = req.userId;
      const { name, beersId } = req.body;
      console.log("beersId : ", beersId);

      validate(listSchemas.createData, req.body);
      const newList = new List({
        name,
        beers: beersId,
        id_user,
      });

      const savedList = await newList.save();

      // ajoute la nouvelle liste dans les bières de req.body.beers
      beersId.forEach(async (beerId) => {
        const beer = await Beer.findById(beerId);
        const beerLists = beer.lists;
        await Beer.findByIdAndUpdate(
          beerId,
          { $set: { lists: [...beerLists, savedList._id] } },
          { new: true }
        );
      });

      return res.status(200).json(savedList);
    } catch (err) {
      return res.status(500).json(err.message);
    }
  },
};

export default listController;

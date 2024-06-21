import {Review} from "../models/model.js";
import validate from "../validators/validator.js";
import reviewSchemas from "../validators/review.schemas.js";

const reviewController = {
  async getAllReviews(req, res) {
    try {
      const reviews = await Review.find().populate(["id_user", "id_beer"])
      return res.json(reviews);
    } catch (err) {
      return res.status(500).send(err.message);
    }
  },

  async getReviewById(req, res) {
    try {
      const reviewId = req.params.id;
      const review = await List.findOne({ _id: reviewId }).populate(["id_user", "id_beer"]);
      if (!review) {
        return res.status(404).send("Review introuvable");
      }
      return res.json(review);
    } catch (err) {
      return res.status(500).send(err.message);
    }
  },

  async deleteReview(req, res) {
    try {
      const reviewId = req.params.id;
      if (!reviewId) {
        return res.status(400).send("ID introuvable.");
      }
      await Review.deleteOne({ _id: reviewId });
      return res.status(200).send("Review supprimée avec succès");
    } catch (err) {
      return res.status(500).send(err.message);
    }
  },

  async updateReview(req, res) {
    try {
      const reviewId = req.params.id;
      const { rate, comment } = req.body;
      validate(reviewSchemas.updateData, req.body);

      // vérifie la présence de tous les params
      if (
        !rate &&
        !comment &&
        !reviewId
      ) {
        return res
          .status(401)
          .send(
            "Il manque des paramètres parmis: rate, comment, reviewId"
          );
      }

      const review = await Review.findByIdAndUpdate(
        reviewId,
        { $set: { rate, comment } },
        { new: true }
      );

      if (!review) {
        return res.status(404).send("Review non trouvé");
      }

      return res.status(200).send(review);
    } catch (err) {
      return res.status(500).send(err.message);
    }
  },

  async createReview(req, res) {
    try {
      const { rate, comment, id_beer, id_user } = req.body;
      validate(reviewSchemas.createData, req.body);
      const newReview = new Review({
        rate,
        comment,
        id_beer,
        id_user,
      });
      const savedReview = await newReview.save();
      return res.status(200).send(savedReview);
    } catch (err) {
      return res.status(500).send(err.message);
    }
  },
};

export default reviewController;

import "dotenv/config";
import { User } from "../models/model.js";
import bcrypt from "bcrypt";
import emailValidator from "email-validator";
import jwt from "jsonwebtoken";

import { createToken, createRefreshToken } from "../utils/token.util.js";
import validate from "../validators/validator.js";
import authSchemas from "../validators/auth.schemas.js";

const authController = {
  async signupUser(req, res) {
    let { email, pseudo, birthdate, password, confirmPassword } = req.body;

    birthdate = new Date(birthdate);

    console.log(birthdate);
    /* validate(authSchemas.registerData, req.body); */

    try {
      // ===== VALIDATION DES DONNEES UTILISATEUR ====
      // Vérifier que tous les champs sont non vides et non null
      if (!email || !pseudo || !birthdate || !password || !confirmPassword) {
        console.log("Tous les champs sont obligatoires.");
        res.status(400).send("Tous les champs sont obligatoires.");
        return;
      }

      // Vérifier que le MDP === confirmPassword
      if (password !== confirmPassword) {
        console.log("Le mot de passe et sa confirmation ne correspondent pas.");
        return res
          .status(400)
          .send("Le mot de passe et sa confirmation ne correspondent pas.");
      }

      // Vérifier le format de l'email (valide) => email-validator
      if (!emailValidator.validate(email)) {
        console.log("Le format de l'email n'est pas valide.");
        return res.status(400).send("Le format de l'email n'est pas valide.");
      }

      // Vérifier la force du mot de passe
      if (password.length < 8) {
        console.log("Le mot de passe doit faire plus de 8 caractères.");
        return res
          .status(400)
          .send("Le mot de passe doit faire plus de 8 caractères.");
      }

      if (!/[0-9]/.test(password)) {
        console.log("Le mot de passe doit contenir au moins un chiffre.");
        return res
          .status(400)
          .send("Le mot de passe doit contenir au moins un chiffre.");
      }

      if (!/[A-Z]/.test(password)) {
        console.log("Le mot de passe doit contenir une lettre majuscule.");
        return res
          .status(400)
          .send("Le mot de passe doit contenir une lettre majuscule.");
      }

      if (!/[a-z]/.test(password)) {
        console.log("Le mot de passe doit contenir une lettre minuscule.");
        return res
          .status(400)
          .send("Le mot de passe doit contenir une lettre minuscule.");
      }

      const eighteenYearsAgo = new Date();
      eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);
      if (birthdate > eighteenYearsAgo) {
        console.log("Vous devez être âgé(e) de 18 ans ou plus.");
        return res
          .status(400)
          .send("Vous devez être âgé(e) de 18 ans ou plus.");
      }

      // Vérifier que l'email n'est pas déjà utilisé par un autre utilisateur déjà en BDD
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        console.log("Cet email est déjà utilisé.");
        return res.status(400).send("Cet email est déjà utilisé.");
      }

      // Hacher le mot de passe utilisateur avant de l'insérer en BDD
      const nbOfSaltRounds = parseInt(process.env.NB_OF_SALT_ROUNDS) || 10;
      const hashedPassword = await bcrypt.hash(password, nbOfSaltRounds);

      // Créer un User en BDD avec les informations du body
      const newUser = await User.create({
        email,
        pseudo,
        birthdate,
        password: hashedPassword,
      });
      const userWhitoutPassword = { ...newUser._doc, password: undefined };

      res.send(userWhitoutPassword);
    } catch (err) {
      return res.status(500).send(err.message);
    }
  },

  async loginUser(req, res) {
    const { email, password } = req.body;

    console.log(email);
    console.log(password);

    try {
      if (!email || !password) {
        res.status(400).send("Tous les champs sont obligatoires.");
        return;
      }

      // Récupérer l'utilisateur (user) en BDD
      const user = await User.findOne({ email }).select("+password");

      if (!user) {
        return res.status(400).send("Mauvais couple email/mot de passe.");
      }

      const isMatching = bcrypt.compareSync(password, user.password);

      if (!isMatching) {
        console.log("Mauvais couple email/mot de passe.");
        return res.status(400).send("Mauvais couple email/mot de passe.");
      }

      const userData = {
        userId: user._id,
        role: user.role,
      };

      const accessTokenJWT = createToken(userData);

      const refreshTokenJWT = createRefreshToken({ userId: user._id });

      const loginData = {
        token: accessTokenJWT,
        refreshToken: refreshTokenJWT,
      };

      res.status(200).json(loginData);
    } catch (err) {
      console.log(err.message);
      return res.status(500).send(err.message);
    }
  },

  async refreshToken(req, res) {
    const { refreshToken } = req.body;

    const decodedRefreshToken = jwt.verify(
      refreshToken,
      process.env.JWT_SECRET,
      {
        algorithms: ["HS256"],
      }
    );

    const user = await User.findById(decodedRefreshToken.userId);

    const userData = {
      userId: user._id,
      role: user.role,
    };

    const newAccessTokenJWT = createToken(userData);

    res.status(200).json(newAccessTokenJWT);
  },
};

export default authController;

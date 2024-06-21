import bcrypt from "bcrypt";
import { User } from "../models/model.js";
import validate from "../validators/validator.js";
import userSchemas from "../validators/user.schemas.js";
import { createToken } from "../utils/token.util.js";

const userController = {
  async getAllUsers(req, res) {
    try {
      const users = await User.find();
      const usersWhitoutPassword = users.map((user) => {
        return { ...user, password: undefined }._doc;
      });
      res.status(200).json(usersWhitoutPassword);
    } catch (error) {
      res.status(500).json(error.message);
    }
  },

  async getUserById(req, res) {
    try {
      const userId = req.userId;
      console.log("getUserById userId : ", userId);
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json("Utilisateur introuvable");
      }
      const userData = {
        pseudo: user._doc.pseudo,
        email: user._doc.email,
        password: user._doc.password,
        birthdate: user._doc.birthdate,
        role: user._doc.role,
      };

      const userTokenJWT = createToken(userData);

      return res.json(userTokenJWT);
    } catch (error) {
      res.status(500).json(error.message);
    }
  },

  async deleteUser(req, res) {
    try {
      const userId = req.userId;
      if (!userId) {
        return res.status(400).json("ID introuvable.");
      }
      await User.deleteOne({ _id: userId });
      return res.status(200).json("Utilisateur supprimé avec succès.");
    } catch (error) {
      res.status(500).json(error.message);
    }
  },

  async updateUser(req, res) {
    try {
      const userId = req.userId;
      const { currentEmail, newEmail, newPseudo } = req.body;
      validate(userSchemas.updateData, req.body);
      // vérifie la présence de tous les params
      if (!currentEmail && !newEmail && !newPseudo && !userId) {
        return res
          .status(401)
          .json(
            "Il manque des paramètres parmis: currentEmail, newEmail, newPseudo, userId"
          );
      }
      // vérifie que l'email est disponible
      const existingUser = await User.findOne({ email: newEmail });
      if (existingUser && existingUser.email != currentEmail) {
        return res
          .status(400)
          .json("Cet email est déjà utilisé par un autre utilisateur");
      }
      const user = await User.findByIdAndUpdate(
        userId,
        { $set: { pseudo: newPseudo, email: newEmail } },
        { new: true }
      );

      if (!user) {
        return res.status(404).json("Utilisateur non trouvé");
      }

      const userData = {
        pseudo: user._doc.pseudo,
        email: user._doc.email,
        password: user._doc.password,
        birthdate: user._doc.birthdate,
        role: user._doc.role,
      };

      const updateTokenJWT = createToken(userData);

      return res.json(updateTokenJWT);
    } catch (error) {
      res.status(500).json(error.message);
    }
  },

  async changePassword(req, res) {
    try {
      const userId = req.userId;
      const { oldPassword, newPassword, confirmNewPassword } = req.body;
      validate(userSchemas.updatePassword, req.body);

      if (newPassword.length < 8) {
        return res
          .status(400)
          .json("Le nouveau mot de passe doit avoir au moins 8 caractères");
      }

      if (newPassword !== confirmNewPassword) {
        console.log("Le mot de passe et sa confirmation ne correspondent pas.");
        return res
          .status(400)
          .send("Le mot de passe et sa confirmation ne correspondent pas.");
      }

      const user = await User.findById(userId).select("+password");
      if (!user) {
        return res.status(404).json("Utilisateur non trouvé");
      }

      const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
      if (!isPasswordValid) {
        return res.status(401).json("Ancien mot de passe incorrect");
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await User.findByIdAndUpdate(userId, {
        $set: { password: hashedPassword },
      });

      res.json("Mot de passe modifié");
    } catch (err) {
      res.status(500).json(err.message);
    }
  },
};

export default userController;

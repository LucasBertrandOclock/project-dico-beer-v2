import JoiBase from "joi";
import JoiDate from "@joi/date";

const Joi = JoiBase.extend(JoiDate);

const userSchemas = {
  updateData: {
    currentEmail: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net", "fr"] },
      })
      .message("Le format de l'email est incorrect")
      .required(),
    newEmail: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net", "fr"] },
      })
      .message("Le format de l'email est incorrect")
      .required(),
    newPseudo: Joi.string().required(),
  },
  updatePassword: {
    oldPassword: Joi.string()
      .min(8)
      .pattern(
        new RegExp(
          "^(?=.*[a-z])(?=.*[A-Z])(?=.*d)[a-zA-Zd][A-Za-zd@$!%*?&]{8,}$"
        )
      )
      .message(
        "Le mot de passe doit contenir au moins 8 charactère dont 1 majuscule, 1 minuscule et 1 chiffre"
      )
      .required(),
    newPassword: Joi.string()
      .min(8)
      .pattern(
        new RegExp(
          "^(?=.*[a-z])(?=.*[A-Z])(?=.*d)[a-zA-Zd][A-Za-zd@$!%*?&]{8,}$"
        )
      )
      .message(
        "Le mot de passe doit contenir au moins 8 charactère dont 1 majuscule, 1 minuscule et 1 chiffre"
      )
      .required(),
    confirmNewPassword: Joi.ref("newPassword"),
  },
};

export default userSchemas;

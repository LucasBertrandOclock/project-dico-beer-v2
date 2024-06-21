import JoiBase from "joi";
import JoiDate from "@joi/date";

const Joi = JoiBase.extend(JoiDate);

const authSchemas = {
  registerData: {
    email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net", "fr"] },
      })
      .message("Le format de l'email est incorrect")
      .required(),
    pseudo: Joi.string().min(1).required(),
    birthdate: Joi.date().utc().format(["DD-MM-YYYY"]).required(),
    password: Joi.string()
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
    confirmPassword: Joi.ref('password'),
  },
  loginData: {
    email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net", "fr"] },
      })
      .message("Le format de l'email est incorrect")
      .required(),
    password: Joi.string()
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
  },
};

export default authSchemas;

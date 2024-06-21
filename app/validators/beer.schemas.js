import JoiBase from "joi";
import JoiDate from "@joi/date";

const Joi = JoiBase.extend(JoiDate);

const beerSchemas = {
  updateAndCreateData: {
    name: Joi.string().required(),
    description: Joi.string().required(),
    url: Joi.string().required(),
    degree: Joi.number(),
    id_type: Joi.string().required(),
    id_color: Joi.string().required(),
    lists: Joi.array(),
  },
};

export default beerSchemas;

import JoiBase from "joi";
import JoiDate from "@joi/date";

const Joi = JoiBase.extend(JoiDate);

const reviewSchemas = {
  updateData: {
    rate: Joi.string().number(),
    comment: Joi.string(),
  },
  createData: {
    rate: Joi.string().number(),
    comment: Joi.string(),
    id_beer: Joi.string().required(),
    id_user: Joi.string().required(),
  },
};

export default reviewSchemas;

import JoiBase from "joi";
import JoiDate from "@joi/date";

const Joi = JoiBase.extend(JoiDate);

const listSchemas = {
  updateData: {
    name: Joi.string().required(),
    removedIds: Joi.array().required(),
    addedIds: Joi.array().required()
  },
  createData: {
    name: Joi.string().required(),
    beersId: Joi.array().required(),
  },
};

export default listSchemas;

import JoiBase from "joi";
import JoiDate from "@joi/date";

const Joi = JoiBase.extend(JoiDate);

const colorSchemas = {
  updateAndCreateData: {
    name: Joi.string().required(),
    description: Joi.string().required()
  },
};

export default colorSchemas;

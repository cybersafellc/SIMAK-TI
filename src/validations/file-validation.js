import Joi from "joi";

const upload = Joi.object({
  filename: Joi.string().required(),
  description: Joi.string().required(),
});

const get = Joi.object({
  page: Joi.number().required(),
  search: Joi.string().optional(),
});

const deletes = Joi.object({
  id: Joi.string().required(),
});

export default { upload, get, deletes };

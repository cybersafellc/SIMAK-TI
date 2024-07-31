import Joi from "joi";

const create = Joi.object({
  nama: Joi.string().required(),
  nim: Joi.string().required(),
  no_hp: Joi.string().required(),
  pembimbing_akademik: Joi.string().required(),
  password: Joi.string().required(),
  email: Joi.string().required(),
});

const login = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

const tokenVerify = Joi.object({
  id: Joi.string().required(),
  role: Joi.string().required(),
});

const profile = Joi.object({
  id: Joi.string().required(),
});

export default { create, login, tokenVerify, profile };

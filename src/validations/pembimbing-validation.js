import Joi from "joi";

const create = Joi.object({
  nama: Joi.string().required(),
  no_hp: Joi.string().required(),
  nidn: Joi.string().required(),
  jabatan: Joi.string().required(),
  password: Joi.string().required(),
  email: Joi.string().required(),
});

const login = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

const updateProfile = Joi.object({
  id: Joi.string().required(),
  nama: Joi.string().optional(),
  no_hp: Joi.string().optional(),
  nidn: Joi.string().optional(),
  jabatan: Joi.string().optional(),
  email: Joi.string().optional(),
});

const updatePassword = Joi.object({
  id: Joi.string().required(),
  curent_password: Joi.string().required(),
  new_password: Joi.string().required(),
});

const tokenVerify = Joi.object({
  id: Joi.string().required(),
  role: Joi.string().required(),
});

const profile = Joi.object({
  id: Joi.string().required(),
});

const getAllPublic = Joi.object({
  page: Joi.number().required(),
  search: Joi.string().optional(),
});

const getById = Joi.object({
  id: Joi.string().required(),
});

export default {
  create,
  login,
  tokenVerify,
  profile,
  getAllPublic,
  getById,
  updatePassword,
  updateProfile,
};

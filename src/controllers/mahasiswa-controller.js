import mahasiswaService from "../service/mahasiswa-service.js";

const create = async (req, res, next) => {
  try {
    const response = await mahasiswaService.create(req.body);
    res.status(response.status).json(response).end();
  } catch (error) {
    next(error);
  }
};
const login = async (req, res, next) => {
  try {
    const response = await mahasiswaService.login(req.body);
    res.status(response.status).json(response).end();
  } catch (error) {
    next(error);
  }
};
const tokenVerify = async (req, res, next) => {
  try {
    req.body.id = await req.id;
    req.body.role = await req.role;
    const response = await mahasiswaService.tokenVerify(req.body);
    res.status(response.status).json(response).end();
  } catch (error) {
    next(error);
  }
};
const profile = async (req, res, next) => {
  try {
    req.body.id = await req.id;
    const response = await mahasiswaService.profile(req.body);
    res.status(response.status).json(response).end();
  } catch (error) {
    next(error);
  }
};
const getAll = async (req, res, next) => {
  try {
    req.body.page = (await req.query.page) || 1;
    req.body.search = (await req.query.search) || undefined;
    const response = await mahasiswaService.getAll(req.body);
    res.status(response.status).json(response).end();
  } catch (error) {
    next(error);
  }
};
const count = async (req, res, next) => {
  try {
    const response = await mahasiswaService.count();
    res.status(response.status).json(response).end();
  } catch (error) {
    next(error);
  }
};
export default { create, login, tokenVerify, profile, getAll, count };

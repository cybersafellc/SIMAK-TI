import pembimbingService from "../service/pembimbing-service.js";

const create = async (req, res, next) => {
  try {
    const response = await pembimbingService.create(req.body);
    res.status(response.status).json(response).end();
  } catch (error) {
    next(error);
  }
};
const login = async (req, res, next) => {
  try {
    const response = await pembimbingService.login(req.body);
    res.status(response.status).json(response).end();
  } catch (error) {
    next(error);
  }
};
const tokenVerify = async (req, res, next) => {
  try {
    req.body.id = await req.id;
    req.body.role = await req.role;
    const response = await pembimbingService.tokenVerify(req.body);
    res.status(response.status).json(response).end();
  } catch (error) {
    next(error);
  }
};
const profile = async (req, res, next) => {
  try {
    req.body.id = req.id;
    const response = await pembimbingService.profile(req.body);
    res.status(response.status).json(response).end();
  } catch (error) {
    next(error);
  }
};
const getAllPublic = async (req, res, next) => {
  try {
    req.body.page = (await req.query.page) || 1;
    const response = await pembimbingService.getAllPublic(req.body);
    res.status(response.status).json(response).end();
  } catch (error) {
    next(error);
  }
};
export default { create, login, tokenVerify, profile, getAllPublic };

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
    if (req.query.id) {
      req.body.id = await req.query.id;
      const response = await pembimbingService.getById(req.body);
      res.status(response.status).json(response).end();
    } else {
      req.body.page = (await req.query.page) || 1;
      req.body.search = (await req.query.search) || undefined;
      const response = await pembimbingService.getAllPublic(req.body);
      res.status(response.status).json(response).end();
    }
  } catch (error) {
    next(error);
  }
};
const count = async (req, res, next) => {
  try {
    const response = await pembimbingService.count();
    res.status(response.status).json(response).end();
  } catch (error) {
    next(error);
  }
};
const updateProfile = async (req, res, next) => {
  try {
    req.body.id = await req.id;
    const response = await pembimbingService.updateProfile(req.body);
    res.status(response.status).json(response).end();
  } catch (error) {
    next(error);
  }
};
const updatePassword = async (req, res, next) => {
  try {
    req.body.id = await req.id;
    const response = await pembimbingService.updatePassword(req.body);
    res.status(response.status).json(response).end();
  } catch (error) {
    next(error);
  }
};
export default {
  create,
  login,
  tokenVerify,
  profile,
  getAllPublic,
  count,
  updatePassword,
  updateProfile,
};

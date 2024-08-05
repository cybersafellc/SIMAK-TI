import kordinatorService from "../service/kordinator-service.js";

const create = async (req, res, next) => {
  try {
    const response = await kordinatorService.create(req.body);
    res.status(response.status).json(response).end();
  } catch (error) {
    next(error);
  }
};
const login = async (req, res, next) => {
  try {
    const response = await kordinatorService.login(req.body);
    res.status(response.status).json(response).end();
  } catch (error) {
    next(error);
  }
};
const tokenVerify = async (req, res, next) => {
  try {
    req.body.id = await req.id;
    req.body.role = await req.role;
    const response = await kordinatorService.tokenVerify(req.body);
    res.status(response.status).json(response).end();
  } catch (error) {
    next(error);
  }
};
const profile = async (req, res, next) => {
  try {
    req.body.id = req.id;
    const response = await kordinatorService.profile(req.body);
    res.status(response.status).json(response).end();
  } catch (error) {
    next(error);
  }
};
const getAll = async (req, res, next) => {
  try {
    req.body.page = req.query.page || 1;
    const response = await kordinatorService.getAll(req.body);
    res.status(response.status).json(response).end();
  } catch (error) {
    next(error);
  }
};
export default { create, login, profile, getAll, tokenVerify };

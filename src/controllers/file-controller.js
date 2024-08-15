import { ResponseError } from "../errors/response-error.js";
import fileService from "../service/file-service.js";

const upload = async (req, res, next) => {
  try {
    if (!req?.file?.filename)
      throw new ResponseError(
        400,
        "please provided valid file extention .pdf .doc .docx"
      );
    req.body.filename = await req?.file?.filename;
    const responses = await fileService.upload(req.body);
    res.status(responses.status).json(responses).end();
  } catch (error) {
    next(error);
  }
};

const get = async (req, res, next) => {
  try {
    req.body.page = (await req.query.page) || 1;
    req.body.search = (await req.query.search) || undefined;
    const response = await fileService.get(req.body);
    res.status(response.status).json(response).end();
  } catch (error) {
    next(error);
  }
};

const deletes = async (req, res, next) => {
  try {
    const response = await fileService.deletes(req.body);
    res.status(response.status).json(response).end();
  } catch (error) {
    next(error);
  }
};

export default { upload, get, deletes };

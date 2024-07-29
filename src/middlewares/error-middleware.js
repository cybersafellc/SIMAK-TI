import { logger } from "../app/logging.js";
import { Response } from "../app/response.js";
import { ResponseError } from "../errors/response-error.js";

const routeNotFound = async (req, res, next) => {
  try {
    throw new ResponseError(404, "page not found");
  } catch (error) {
    next(error);
  }
};

const errorHandler = async (err, req, res, next) => {
  try {
    if (!err) {
      next();
      return;
    }
    if (err instanceof ResponseError) {
      const response = new Response(err.status, err.message, null, null, false);
      res.status(response.status).json(response).end();
    } else {
      const response = new Response(500, err.message, null, null, false);
      res.status(response.status).json(response).end();
      logger.error(err.message);
    }
  } catch (error) {
    next(error);
  }
};

export default { routeNotFound, errorHandler };

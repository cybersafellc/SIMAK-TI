import Jwt from "jsonwebtoken";
import { ResponseError } from "../errors/response-error.js";

const kordinator = async (req, res, next) => {
  try {
    const access_token = await req.headers["authorization"]?.split(" ")[1];
    const decode = await Jwt.verify(
      access_token,
      process.env.SECRET,
      (err, decode) => {
        return decode;
      }
    );
    if (!decode)
      throw new ResponseError(400, "tolong masukkan access_token valid");
    if (decode.role !== "kordinator")
      throw new ResponseError(400, "kamu bukan kordinator");
    req.id = await decode.id;
    req.role = await decode.role;
    next();
  } catch (error) {
    next(error);
  }
};

const mahasiswa = async (req, res, next) => {
  try {
    const access_token = await req.headers["authorization"]?.split(" ")[1];
    const decode = await Jwt.verify(
      access_token,
      process.env.SECRET,
      (err, decode) => {
        return decode;
      }
    );
    if (!decode)
      throw new ResponseError(400, "tolong masukkan access_token valid");
    if (decode.role !== "mahasiswa")
      throw new ResponseError(400, "kamu bukan mahasiswa");
    req.id = await decode.id;
    req.role = await decode.role;
    next();
  } catch (error) {
    next(error);
  }
};

export default { kordinator, mahasiswa };

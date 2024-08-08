import { database } from "../app/database.js";
import { ResponseError } from "../errors/response-error.js";
import pembimbingValidation from "../validations/pembimbing-validation.js";
import validation from "../validations/validation.js";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { Response } from "../app/response.js";
import Jwt from "jsonwebtoken";

const create = async (request) => {
  const result = validation(pembimbingValidation.create, request);
  const count = await database.pembimbing.count({
    where: {
      username: result.nidn,
    },
  });
  if (count)
    throw new ResponseError(
      400,
      "nidn " + result.nidn + " sudah ada sebagai dosen pembimbing"
    );
  result.id = crypto.randomUUID();
  result.username = result.nidn;
  result.password = await bcrypt.hash(result.password, 10);
  result.status = "active";
  result.remember_token = "";

  const createPembimbing = await database.pembimbing.create({
    data: result,
    select: {
      id: true,
      username: true,
      created_at: true,
    },
  });

  return new Response(
    200,
    "berhasil membuat akun pembimbing",
    createPembimbing,
    null,
    false
  );
};

const login = async (request) => {
  const result = await validation(pembimbingValidation.login, request);
  const pembimbing = await database.pembimbing.findFirst({
    where: {
      username: result.username,
    },
  });
  if (
    pembimbing &&
    (await bcrypt.compare(result.password, pembimbing.password))
  ) {
    const access_token = await Jwt.sign(
      { id: pembimbing.id, role: "pembimbing" },
      process.env.SECRET,
      { expiresIn: "7d" }
    );
    return new Response(200, "berhasil login", { access_token }, null, false);
  } else {
    throw new ResponseError(400, "username atau password salah!");
  }
};

const tokenVerify = async (request) => {
  const result = await validation(pembimbingValidation.tokenVerify, request);
  return new Response(200, "access_token active", result, null, false);
};

const profile = async (request) => {
  const result = await validation(pembimbingValidation.profile, request);
  const pembimbing = await database.pembimbing.findFirst({
    where: {
      id: result.id,
    },
    select: {
      id: true,
      nama: true,
      no_hp: true,
      nidn: true,
      jabatan: true,
      username: true,
      email: true,
      status: true,
    },
  });
  return new Response(200, "profile", pembimbing, null, false);
};

const getAllPublic = async (request) => {
  const result = await validation(pembimbingValidation.getAllPublic, request);
  result.page = result.page - 1;
  result.page = result.page * 30;
  const pembimbings = await database.pembimbing.findMany({
    orderBy: {
      nama: "desc",
    },
    skip: result.page,
    take: 30,
    select: {
      id: true,
      nama: true,
      nidn: true,
      email: true,
      status: true,
    },
  });
  return new Response(200, "list pembimbing", pembimbings, null, false);
};

export default { create, login, tokenVerify, profile, getAllPublic };

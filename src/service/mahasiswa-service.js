import { database } from "../app/database.js";
import { ResponseError } from "../errors/response-error.js";
import mahasiswaValidation from "../validations/mahasiswa-validation.js";
import validation from "../validations/validation.js";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { Response } from "../app/response.js";
import Jwt from "jsonwebtoken";

const create = async (request) => {
  const result = await validation(mahasiswaValidation.create, request);
  const count = await database.mahasiswa.count({
    where: {
      username: result.nim,
    },
  });
  if (count)
    throw new ResponseError(
      400,
      "mahasiswa dengan nim " + result.nim + " sudah ada"
    );

  result.id = crypto.randomUUID();
  result.username = await result.nim;
  result.password = await bcrypt.hash(result.password, 10);
  result.status = "active";
  result.remember_token = "";

  const mahasiswaCreate = await database.mahasiswa.create({
    data: result,
  });

  return new Response(
    200,
    "Berhasil membuat akun mahasiswa",
    mahasiswaCreate,
    null,
    false
  );
};

const login = async (request) => {
  const result = await validation(mahasiswaValidation.login, request);
  const mahasiswa = await database.mahasiswa.findFirst({
    where: {
      username: result.username,
    },
  });
  if (
    mahasiswa &&
    (await bcrypt.compare(result.password, mahasiswa.password))
  ) {
    const access_token = await Jwt.sign(
      { id: mahasiswa.id, role: "mahasiswa" },
      process.env.SECRET,
      { expiresIn: "7d" }
    );
    return new Response(200, "berhasil login", { access_token }, null, false);
  } else {
    throw new ResponseError(400, "username atau password salah!");
  }
};

const tokenVerify = async (request) => {
  const result = await validation(mahasiswaValidation.tokenVerify, request);
  return new Response(200, "access_token active", result, null, false);
};

const profile = async (request) => {
  const result = await validation(mahasiswaValidation.profile, request);
  const mahasiswa = await database.mahasiswa.findFirst({
    where: result,
    select: {
      id: true,
      nama: true,
      nim: true,
      no_hp: true,
      pembimbing_akademik: true,
      username: true,
      email: true,
      status: true,
    },
  });
  return new Response(200, "profil mahasiswa", mahasiswa, null, false);
};

const getAll = async (request) => {
  const result = await validation(mahasiswaValidation.getAll, request);
  result.page = result.page - 1;
  result.page = result.page * 30;
  const mahasiswas = await database.mahasiswa.findMany({
    where: {
      OR: [
        {
          nama: {
            contains: result.search || "",
          },
        },
        {
          nim: {
            contains: result.search || "",
          },
        },
      ],
    },
    orderBy: {
      created_at: "desc",
    },
    skip: result.page,
    take: 30,
    select: {
      id: true,
      nama: true,
      nim: true,
      no_hp: true,
      pembimbing_akademik: true,
      username: true,
      email: true,
      status: true,
      created_at: true,
    },
  });
  return new Response(200, "list mahasiswa", mahasiswas, null, false);
};
const count = async () => {
  const count = await database.mahasiswa.count();
  return await new Response(200, "berhasil menghitung", count, null, false);
};
export default { create, login, tokenVerify, profile, getAll, count };

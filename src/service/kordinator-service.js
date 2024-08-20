import { database } from "../app/database.js";
import { ResponseError } from "../errors/response-error.js";
import kordinatorValidation from "../validations/kordinator-validation.js";
import validation from "../validations/validation.js";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { Response } from "../app/response.js";
import Jwt from "jsonwebtoken";

const create = async (request) => {
  const result = await validation(kordinatorValidation.create, request);
  if (result.secret !== process.env.ADMIN_PASS)
    throw new ResponseError(400, "SECRET YANG ANDA MASUKKAN SALAH!");
  result.secret = undefined;
  const count = await database.kordinator.count({
    where: {
      username: result.nidn,
    },
  });
  if (count)
    throw new ResponseError(
      400,
      "nidn " + result.nidn + " sudah ada sebagai kordinator"
    );
  result.id = crypto.randomUUID();
  result.username = result.nidn;
  result.password = await bcrypt.hash(result.password, 10);
  result.status = "active";
  result.remember_token = "";
  const responseCreate = await database.kordinator.create({
    data: result,
    select: {
      id: true,
      username: true,
      created_at: true,
    },
  });
  return new Response(
    200,
    "berhasil membuat akun kordinator",
    responseCreate,
    "/kordinator/login",
    false
  );
};

const login = async (request) => {
  const result = await validation(kordinatorValidation.login, request);
  const kordinator = await database.kordinator.findFirst({
    where: {
      username: result.username,
    },
  });
  if (
    kordinator &&
    (await bcrypt.compare(result.password, kordinator.password))
  ) {
    const access_token = await Jwt.sign(
      { id: kordinator.id, role: "kordinator" },
      process.env.SECRET,
      { expiresIn: "7d" }
    );
    await database.kordinator.update({
      data: {
        remember_token: access_token,
      },
      where: {
        id: kordinator.id,
      },
    });
    return new Response(200, "berhasil login", { access_token }, null, false);
  } else {
    throw new ResponseError(400, "username atau password salah!");
  }
};

const tokenVerify = async (request) => {
  const result = await validation(kordinatorValidation.tokenVerify, request);
  return new Response(200, "access_token active", result, null, false);
};

const profile = async (request) => {
  const result = await validation(kordinatorValidation.profile, request);
  const kordinator = await database.kordinator.findFirst({
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
      remember_token: true,
    },
  });
  return new Response(200, "profile", kordinator, null, false);
};

const getAll = async (request) => {
  const result = await validation(kordinatorValidation.getAll, request);
  result.page = result.page - 1;
  result.page = result.page * 30;
  const kordinators = await database.kordinator.findMany({
    where: {
      OR: [
        {
          nama: {
            contains: result.search || "",
          },
        },
        {
          nidn: {
            contains: result.search || "",
          },
        },
      ],
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
      remember_token: true,
    },
    orderBy: {
      created_at: "desc",
    },
    skip: result.page,
    take: 30,
  });
  return new Response(200, "kordinators", kordinators, null, false);
};

const count = async () => {
  const count = await database.kordinator.count();
  return await new Response(200, "berhasil menghitung", count, null, false);
};

const updateProfile = async (request) => {
  const result = await validation(kordinatorValidation.updateProfile, request);
  const count = await database.kordinator.count({
    where: {
      id: result.id,
    },
  });
  if (!count)
    throw new ResponseError(400, "tidak ada kordinator dengan id:" + result.id);
  await database.kordinator.update({
    data: result,
    where: {
      id: result.id,
    },
  });
  return new Response(200, "berhasil mengupdate profile", result, null, false);
};

const updatePassword = async (request) => {
  const result = await validation(kordinatorValidation.updatePassword, request);
  const kordinator = await database.kordinator.findUnique({
    where: {
      id: result.id,
    },
  });
  if (
    kordinator &&
    (await bcrypt.compare(result.curent_password, kordinator.password))
  ) {
    result.new_password = await bcrypt.hash(result.new_password, 10);
    const respUpdate = await database.kordinator.update({
      data: {
        password: result.new_password,
      },
      where: {
        id: result.id,
      },
      select: {
        id: true,
      },
    });
    return new Response(
      200,
      "berhasil mengupdate password",
      respUpdate,
      null,
      false
    );
  }
  throw new ResponseError(400, "current password salah!");
};

export default {
  create,
  login,
  profile,
  getAll,
  tokenVerify,
  count,
  updateProfile,
  updatePassword,
};

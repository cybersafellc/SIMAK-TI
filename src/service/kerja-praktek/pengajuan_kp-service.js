import { database } from "../../app/database.js";
import { Response } from "../../app/response.js";
import { ResponseError } from "../../errors/response-error.js";
import pengajuan_kpValidation from "../../validations/kerja-praktek/pengajuan_kp-validation.js";
import validation from "../../validations/validation.js";
import crypto from "crypto";

const create = async (request) => {
  const result = await validation(pengajuan_kpValidation.create, request);
  const count = await database.pengajuan_kp.count({
    where: {
      mahasiswa_id: result.mahasiswa_id,
    },
  });
  if (count)
    throw new ResponseError(
      400,
      "kamu sudah melakukan pengajuan kp sebelumnya!"
    );
  result.id = crypto.randomUUID();
  result.status = "menunggu";
  const pengajuan = await database.pengajuan_kp.create({
    data: result,
  });
  return new Response(200, "berhasil mengajukan kp", pengajuan, null, false);
};

const getMahasiswa = async (request) => {
  const result = await validation(pengajuan_kpValidation.getMahasiswa, request);
  const pengajuankps = await database.pengajuan_kp.findFirst({
    where: {
      mahasiswa_id: result.id,
    },
  });
  return new Response(200, "data pengajuan kp", pengajuankps, null, false);
};

const getAllByKordinator = async (request) => {
  const result = await validation(
    pengajuan_kpValidation.getAllByKordinator,
    request
  );
  const take = 30;
  result.page -= 1;
  result.page *= take;
  const pengajuans = await database.pengajuan_kp.findMany({
    where: {
      mahasiswa: {
        nama: {
          contains: result.search,
        },
      },
      id: result.id,
    },
    orderBy: {
      created_at: "desc",
    },
    skip: result.page,
    take: take,
  });
  const pengajuanRemap = await Promise.all(
    pengajuans.map(async (pengajuan) => {
      pengajuan.mahasiswa = await database.mahasiswa.findUnique({
        where: {
          id: pengajuan.mahasiswa_id,
        },
        select: {
          id: true,
          nama: true,
          nim: true,
          no_hp: true,
          pembimbing_akademik: true,
          email: true,
          status: true,
        },
      });
      pengajuan.mahasiswa_id = undefined;
      return pengajuan;
    })
  );
  return new Response(200, "list pengajuan kp", pengajuanRemap, null, false);
};

const getById = async (request) => {
  const result = await validation(pengajuan_kpValidation.getById, request);
  const pengajuan = await database.pengajuan_kp.findUnique({
    where: {
      id: result.id,
    },
  });
  pengajuan.mahasiswa = await database.mahasiswa.findUnique({
    where: {
      id: pengajuan.mahasiswa_id,
    },
    select: {
      id: true,
      nama: true,
      nim: true,
      no_hp: true,
      pembimbing_akademik: true,
      email: true,
      status: true,
    },
  });
  pengajuan.mahasiswa_id = undefined;
  return new Response(
    200,
    `informasi pengajuan id ${result.id}`,
    pengajuan,
    null,
    false
  );
};

export default { create, getMahasiswa, getAllByKordinator, getById };

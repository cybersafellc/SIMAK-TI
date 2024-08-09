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
  if (!pengajuankps)
    throw new ResponseError(400, "anda belum melakukan pengajuan kp");
  pengajuankps.details_disetujui =
    await database.kerja_praktek_disetujui.findFirst({
      where: {
        pengajuan_kp_id: pengajuankps.id,
      },
    });
  if (pengajuankps.details_disetujui) {
    pengajuankps.details_disetujui.pembimbing_satu =
      await database.pembimbing.findUnique({
        where: {
          id: pengajuankps.details_disetujui.pembimbing_satu_id,
        },
        select: {
          nama: true,
          no_hp: true,
          nidn: true,
          email: true,
          status: true,
        },
      });
    pengajuankps.details_disetujui.pengajuan_kp_id = undefined;
    pengajuankps.details_disetujui.id = undefined;
    pengajuankps.details_disetujui.pembimbing_satu_id = undefined;
  }
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
      pengajuan.details_disetujui =
        await database.kerja_praktek_disetujui.findFirst({
          where: {
            pengajuan_kp_id: pengajuan.id,
          },
        });
      if (pengajuan.details_disetujui) {
        pengajuan.details_disetujui.pembimbing_satu =
          await database.pembimbing.findUnique({
            where: {
              id: pengajuan.details_disetujui.pembimbing_satu_id,
            },
            select: {
              id: true,
              nama: true,
              no_hp: true,
              nidn: true,
              email: true,
              status: true,
            },
          });
        pengajuan.details_disetujui.pengajuan_kp_id = undefined;
        pengajuan.details_disetujui.pembimbing_satu_id = undefined;
      }
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
  if (!pengajuan)
    throw new ResponseError(
      400,
      "pengajuan dengan id " + result.id + " tidak ada"
    );
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
  pengajuan.details_disetujui =
    await database.kerja_praktek_disetujui.findFirst({
      where: {
        pengajuan_kp_id: pengajuan.id,
      },
    });
  if (pengajuan.details_disetujui) {
    pengajuan.details_disetujui.pembimbing_satu =
      await database.pembimbing.findUnique({
        where: {
          id: pengajuan.details_disetujui.pembimbing_satu_id,
        },
        select: {
          id: true,
          nama: true,
          no_hp: true,
          nidn: true,
          email: true,
          status: true,
        },
      });

    pengajuan.details_disetujui.pengajuan_kp_id = undefined;
    pengajuan.details_disetujui.pembimbing_satu_id = undefined;
  }
  pengajuan.mahasiswa_id = undefined;
  return new Response(
    200,
    `informasi pengajuan id ${result.id}`,
    pengajuan,
    null,
    false
  );
};

const getAllByPembimbing = async (request) => {
  const result = await validation(
    pengajuan_kpValidation.getAllByPembimbing,
    request
  );
  const take = 30;
  result.page -= 1;
  result.page *= take;
  const kpdisetujui = await database.kerja_praktek_disetujui.findMany({
    orderBy: {
      created_at: "desc",
    },
    where: {
      pengajuan_kp: {
        mahasiswa: {
          nama: {
            contains: result.search,
          },
        },
      },
      pembimbing_satu_id: result.id,
    },
    skip: result.page,
    take: take,
  });

  const kpdisetujuiMaping = await Promise.all(
    kpdisetujui.map(async (data) => {
      data.detail_pengajuan_kp = await database.pengajuan_kp.findUnique({
        where: {
          id: data.pengajuan_kp_id,
        },
      });
      data.detail_mahasiswa = await database.mahasiswa.findUnique({
        where: {
          id: data.detail_pengajuan_kp.mahasiswa_id,
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
      data.pengajuan_kp_id = undefined;
      data.detail_pengajuan_kp.mahasiswa_id = undefined;
      return data;
    })
  );

  return new Response(
    200,
    "list mahasiswa bimbingan",
    kpdisetujuiMaping,
    null,
    false
  );
};

const getByIdPembimbing = async (request) => {
  const result = await validation(
    pengajuan_kpValidation.getByIdPembimbing,
    request
  );
  const kerja_praktek_disetujui =
    await database.kerja_praktek_disetujui.findUnique({
      where: {
        id: result.byid,
        pembimbing_satu_id: result.id,
      },
    });
  if (!kerja_praktek_disetujui)
    throw new ResponseError(
      400,
      "tidak ada mahasiswa bimbingan dengan id " + result.byid
    );
  kerja_praktek_disetujui.detail_pengajuan_kp =
    await database.pengajuan_kp.findUnique({
      where: {
        id: kerja_praktek_disetujui.pengajuan_kp_id,
      },
    });
  kerja_praktek_disetujui.detail_mahasiswa =
    await database.mahasiswa.findUnique({
      where: {
        id: kerja_praktek_disetujui.detail_pengajuan_kp.mahasiswa_id,
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
  kerja_praktek_disetujui.pengajuan_kp_id = undefined;
  kerja_praktek_disetujui.detail_pengajuan_kp.mahasiswa_id = undefined;
  return new Response(
    200,
    "mahasiswa bimbingan dengan id " + result.byid,
    kerja_praktek_disetujui,
    null,
    false
  );
};

const diterima = async (request) => {
  const result = await validation(pengajuan_kpValidation.diterima, request);
  const count = await database.pengajuan_kp.count({
    where: {
      id: result.id,
      status: "menunggu",
    },
  });
  const pembimbingCount = await database.pembimbing.count({
    where: {
      id: result.pembimbing_id,
    },
  });
  if (!count || !pembimbingCount)
    throw new ResponseError(
      400,
      `tidak ada pengajuan dengan id:${result.id} berstatus 'menunggu' atau tidak ada pembimbing dengan id ${result.pembimbing_id}`
    );
  await database.pengajuan_kp.update({
    data: {
      status: "diterima",
      keterangan: result.keterangan,
    },
    where: {
      id: result.id,
      status: "menunggu",
    },
    select: {
      id: true,
    },
  });
  await database.kerja_praktek_disetujui.create({
    data: {
      id: await crypto.randomUUID(),
      pengajuan_kp_id: result.id,
      pembimbing_satu_id: result.pembimbing_id,
    },
    select: {
      id: true,
    },
  });
  return new Response(200, "berhasil diterima", result, null, false);
};

const ditolak = async (request) => {
  const result = await validation(pengajuan_kpValidation.ditolak, request);
  const count = await database.pengajuan_kp.count({
    where: {
      id: result.id,
      status: "menunggu",
    },
  });
  if (!count)
    throw new ResponseError(
      400,
      `pengajuan kp dengan id ${result.id} tidak ditemukan`
    );
  await database.pengajuan_kp.update({
    where: {
      id: result.id,
      status: "menunggu",
    },
    data: {
      keterangan: result.keterangan,
      status: "ditolak",
    },
    select: {
      id: true,
    },
  });
  return new Response(
    200,
    "berhasil menolak pengajuan kp id:" + result.id,
    result,
    null,
    false
  );
};

const revisi = async (request) => {
  const result = await validation(pengajuan_kpValidation.revisi, request);
  const data = await database.pengajuan_kp.findFirst({
    where: {
      mahasiswa_id: result.mahasiswa_id,
      status: "ditolak",
    },
    select: {
      id: true,
    },
  });
  if (!data)
    throw new ResponseError(
      400,
      "kamu tidak memiliki pengajuan kp yang ditolak"
    );
  result.mahasiswa_id = undefined;
  result.status = "menunggu";
  const revisiExe = await database.pengajuan_kp.update({
    where: {
      id: data.id,
      status: "ditolak",
    },
    data: result,
  });
  return new Response(200, "berhasil revisi", revisiExe, null, false);
};

export default {
  create,
  getMahasiswa,
  getAllByKordinator,
  getById,
  getAllByPembimbing,
  getByIdPembimbing,
  diterima,
  ditolak,
  revisi,
};

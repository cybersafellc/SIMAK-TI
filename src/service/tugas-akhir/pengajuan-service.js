import crypto from "crypto";
import validation from "../../validations/validation.js";
import pengajuanValidation from "../../validations/tugas-akhir/pengajuan-validation.js";
import { database } from "../../app/database.js";
import { ResponseError } from "../../errors/response-error.js";
import { Response } from "../../app/response.js";

const create = async (request) => {
  const result = await validation(pengajuanValidation.create, request);
  //   pengecekan apakah mahasiswa sudah mengajukan ta
  const count = await database.pengajuan_ta.count({
    where: {
      mahasiswa_id: result.mahasiswa_id,
    },
  });
  if (count) throw new ResponseError(400, "kamu sudah mengajukan tugas akhir!");
  //   pengecekan pembimbing yang mahasiswa pilih
  if (
    result.pembimbing_satu === result.pembimbing_dua ||
    result.pembimbing_tiga === result.pembimbing_empat
  )
    throw new ResponseError(
      400,
      "pembimbing 1 dan 2 atau 3 dan 4 tidak boleh sama!"
    );
  const pembimbing1Count = await database.pembimbing.count({
    where: {
      id: result.pembimbing_satu,
    },
  });
  const pembimbing2Count = await database.pembimbing.count({
    where: {
      id: result.pembimbing_dua,
    },
  });
  const pembimbing3Count = await database.pembimbing.count({
    where: {
      id: result.pembimbing_tiga,
    },
  });
  const pembimbing4Count = await database.pembimbing.count({
    where: {
      id: result.pembimbing_empat,
    },
  });
  if (
    !pembimbing1Count ||
    !pembimbing2Count ||
    !pembimbing3Count ||
    !pembimbing4Count
  )
    throw new ResponseError(400, "dosen pembinbing 1 / 2 / 3 / 4 tidak ada!");
  // execute pengajuan ta
  result.id = crypto.randomUUID();
  result.status = "menunggu";
  const pengajuan = await database.pengajuan_ta.create({
    data: result,
  });
  return new Response(
    200,
    "berhasil mengajukan tugas akhir",
    pengajuan,
    null,
    false
  );
};

const getKordinator = async (request) => {
  const result = await validation(
    pengajuanValidation.getAllKordinator,
    request
  );
  const take = 30;
  result.page -= 1;
  result.page *= 30;
  let pengajuan_tas = await database.pengajuan_ta.findMany({
    orderBy: {
      created_at: "desc",
    },
    skip: result.page,
    take: take,
    where: {
      mahasiswa: {
        nama: {
          contains: result.search,
        },
      },
    },
  });
  if (pengajuan_tas.length > 0) {
    pengajuan_tas = await Promise.all(
      pengajuan_tas.map(async (pengajuan) => {
        pengajuan.details_disetujui =
          await database.tugas_akhir_disetujui.findFirst({
            where: {
              pengajuan_ta_id: pengajuan.id,
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
                jabatan: true,
                email: true,
                status: true,
              },
            });
          pengajuan.details_disetujui.pembimbing_dua =
            await database.pembimbing.findUnique({
              where: {
                id: pengajuan.details_disetujui.pembimbing_dua_id,
              },
              select: {
                id: true,
                nama: true,
                no_hp: true,
                nidn: true,
                jabatan: true,
                email: true,
                status: true,
              },
            });
          pengajuan.details_disetujui.pembimbing_satu_id = undefined;
          pengajuan.details_disetujui.pembimbing_dua_id = undefined;
        }
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
  }
  return new Response(
    200,
    "list pengajuan tugas akhir",
    pengajuan_tas,
    null,
    false
  );
};

const getIdKordinator = async (request) => {
  const result = await validation(pengajuanValidation.getIdKordinator, request);
  let pengajuan_ta = await database.pengajuan_ta.findUnique({
    where: {
      id: result.id,
    },
  });
  if (!pengajuan_ta)
    throw new ResponseError(
      400,
      "tidak ada pengajuan tugas akhir dengan id:" + result.id
    );
  pengajuan_ta.details_disetujui =
    await database.tugas_akhir_disetujui.findFirst({
      where: {
        pengajuan_ta_id: pengajuan_ta.id,
      },
    });
  if (pengajuan_ta.details_disetujui) {
    pengajuan_ta.details_disetujui.pembimbing_satu =
      await database.pembimbing.findUnique({
        where: {
          id: pengajuan_ta.details_disetujui.pembimbing_satu_id,
        },
        select: {
          id: true,
          nama: true,
          no_hp: true,
          nidn: true,
          jabatan: true,
          email: true,
          status: true,
        },
      });
    pengajuan_ta.details_disetujui.pembimbing_dua =
      await database.pembimbing.findUnique({
        where: {
          id: pengajuan_ta.details_disetujui.pembimbing_dua_id,
        },
        select: {
          id: true,
          nama: true,
          no_hp: true,
          nidn: true,
          jabatan: true,
          email: true,
          status: true,
        },
      });
    pengajuan_ta.details_disetujui.pembimbing_satu_id = undefined;
    pengajuan_ta.details_disetujui.pembimbing_dua_id = undefined;
  }
  pengajuan_ta.mahasiswa = await database.mahasiswa.findUnique({
    where: {
      id: pengajuan_ta.mahasiswa_id,
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
  pengajuan_ta.mahasiswa_id = undefined;
  return new Response(
    200,
    "pengajuan tugas akhir id:" + result.id,
    pengajuan_ta,
    null,
    false
  );
};

const getMahasiswa = async (request) => {
  const result = await validation(pengajuanValidation.getMahasiswa, request);
  let pengajuanTa = await database.pengajuan_ta.findFirst({
    where: result,
  });
  if (!pengajuanTa)
    throw new ResponseError(400, "anda belum mengajukan tugas akhir");
  pengajuanTa.details_disetujui =
    await database.tugas_akhir_disetujui.findFirst({
      where: {
        pengajuan_ta_id: pengajuanTa.id,
      },
      select: {
        id: true,
        pembimbing_satu_id: true,
        pembimbing_dua_id: true,
        judul_penelitian: true,
        created_at: true,
        update_at: true,
      },
    });
  if (pengajuanTa.details_disetujui) {
    pengajuanTa.details_disetujui.pembimbing_satu =
      await database.pembimbing.findUnique({
        where: {
          id: pengajuanTa.details_disetujui.pembimbing_satu_id,
        },
        select: {
          id: true,
          nama: true,
          no_hp: true,
          nidn: true,
          jabatan: true,
          email: true,
          status: true,
        },
      });
    pengajuanTa.details_disetujui.pembimbing_dua =
      await database.pembimbing.findUnique({
        where: {
          id: pengajuanTa.details_disetujui.pembimbing_dua_id,
        },
        select: {
          id: true,
          nama: true,
          no_hp: true,
          nidn: true,
          jabatan: true,
          email: true,
          status: true,
        },
      });
    pengajuanTa.details_disetujui.pembimbing_satu_id = undefined;
    pengajuanTa.details_disetujui.pembimbing_dua_id = undefined;
  }
  return new Response(
    200,
    "informasi pengajuan tugas akhir anda",
    pengajuanTa,
    null,
    false
  );
};

// wajib di testing
const getAllPembimbing = async (request) => {
  const result = await validation(
    pengajuanValidation.getAllPembimbing,
    request
  );
  const take = 30;
  result.page -= 1;
  result.page *= take;
  let tugasAkhirDisetujui = await database.tugas_akhir_disetujui.findMany({
    where: {
      OR: [
        {
          pembimbing_satu_id: result.pembimbing_id,
        },
        {
          pembimbing_dua_id: result.pembimbing_id,
        },
      ],
      pengajuan_ta: {
        mahasiswa: {
          nama: {
            contains: result.search,
          },
        },
      },
    },
    orderBy: {
      created_at: "desc",
    },
    skip: result.page,
    take: take,
  });
  if (tugasAkhirDisetujui.length > 0) {
    tugasAkhirDisetujui = await Promise.all(
      tugasAkhirDisetujui.map(async (taDisetujui) => {
        taDisetujui.pembimbing_satu = await database.pembimbing.findUnique({
          where: {
            id: taDisetujui.pembimbing_satu_id,
          },
          select: {
            id: true,
            nama: true,
            no_hp: true,
            nidn: true,
            jabatan: true,
            email: true,
            status: true,
          },
        });
        taDisetujui.pembimbing_dua = await database.pembimbing.findUnique({
          where: {
            id: taDisetujui.pembimbing_dua_id,
          },
          select: {
            id: true,
            nama: true,
            no_hp: true,
            nidn: true,
            jabatan: true,
            email: true,
            status: true,
          },
        });
        taDisetujui.details_pengajuan_ta =
          await database.pengajuan_ta.findUnique({
            where: {
              id: taDisetujui.pengajuan_ta_id,
            },
          });

        if (taDisetujui.details_pengajuan_ta) {
          taDisetujui.mahasiswa = await database.mahasiswa.findUnique({
            where: {
              id: taDisetujui.details_pengajuan_ta.mahasiswa_id,
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
          taDisetujui.details_pengajuan_ta.mahasiswa_id = undefined;
        }
        taDisetujui.pengajuan_ta_id = undefined;
        taDisetujui.pembimbing_satu_id = undefined;
        taDisetujui.pembimbing_dua_id = undefined;
        return taDisetujui;
      })
    );
  }
  return new Response(
    200,
    "list mahasiswa bimbingan",
    tugasAkhirDisetujui,
    null,
    false
  );
};

const getIdPembimbing = async (request) => {
  const result = await validation(pengajuanValidation.getIdPembimbing, request);
  let taDisetujui = await database.tugas_akhir_disetujui.findUnique({
    where: {
      id: result.id,
      OR: [
        {
          pembimbing_satu_id: result.pembimbing_id,
        },
        {
          pembimbing_dua_id: result.pembimbing_id,
        },
      ],
    },
  });
  if (!taDisetujui)
    throw new ResponseError(
      400,
      "tidak ada mahasaiswa bimbingan dengan id:" + result.id
    );
  taDisetujui.pembimbing_satu = await database.pembimbing.findUnique({
    where: {
      id: taDisetujui.pembimbing_satu_id,
    },
    select: {
      id: true,
      nama: true,
      no_hp: true,
      nidn: true,
      jabatan: true,
      email: true,
      status: true,
    },
  });
  taDisetujui.pembimbing_dua = await database.pembimbing.findUnique({
    where: {
      id: taDisetujui.pembimbing_dua_id,
    },
    select: {
      id: true,
      nama: true,
      no_hp: true,
      nidn: true,
      jabatan: true,
      email: true,
      status: true,
    },
  });
  taDisetujui.details_pengajuan_ta = await database.pengajuan_ta.findUnique({
    where: {
      id: taDisetujui.pengajuan_ta_id,
    },
  });

  if (taDisetujui.details_pengajuan_ta) {
    taDisetujui.mahasiswa = await database.mahasiswa.findUnique({
      where: {
        id: taDisetujui.details_pengajuan_ta.mahasiswa_id,
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
    taDisetujui.details_pengajuan_ta.mahasiswa_id = undefined;
  }
  taDisetujui.pengajuan_ta_id = undefined;
  taDisetujui.pembimbing_satu_id = undefined;
  taDisetujui.pembimbing_dua_id = undefined;
  return new Response(
    200,
    "mahasiswa bimbingan dengan id:" + result.id,
    taDisetujui,
    null,
    false
  );
};

const ditolak = async (request) => {
  const result = await validation(pengajuanValidation.ditolak, request);
  const count = await database.pengajuan_ta.count({
    where: {
      id: result.id,
      status: "menunggu",
    },
  });
  if (!count)
    throw new ResponseError(
      400,
      "tidak ada pengajuan ta dengan status menunggu untuk id" + result.id
    );
  result.status = "ditolak";
  await database.pengajuan_ta.update({
    where: {
      id: result.id,
    },
    data: result,
    select: {
      id: true,
    },
  });
  return new Response(200, "berhasil menolak", result, null, false);
};

const revisi = async (request) => {
  const result = await validation(pengajuanValidation.revisi, request);
  const pengajuanTa = await database.pengajuan_ta.findFirst({
    where: {
      mahasiswa_id: result.mahasiswa_id,
      status: "ditolak",
    },
    select: {
      id: true,
    },
  });
  if (!pengajuanTa)
    throw new ResponseError(
      400,
      "anda tidak memiliki pengajuan tugas akhir yang ditolak"
    );
  result.status = "menunggu";
  const executeRevisi = await database.pengajuan_ta.update({
    data: result,
    where: {
      id: pengajuanTa.id,
    },
    select: {
      id: true,
      status: true,
    },
  });
  return new Response(
    200,
    "berhasil revisi pengajuan tugas akhir anda",
    executeRevisi,
    null,
    false
  );
};

const diterima = async (request) => {
  const result = await validation(pengajuanValidation.diterima, request);
  const pengajuanTa = await database.pengajuan_ta.findFirst({
    where: {
      id: result.id,
      status: "menunggu",
    },
  });
  if (!pengajuanTa)
    throw new ResponseError(
      400,
      "tidak ada pengajuan tugas akhir dengan id:" +
        result.id +
        " status menunggu"
    );
  if (result.pembimbing_satu_id === result.pembimbing_dua_id)
    throw new ResponseError(400, "pembimbing satu dan dua tidak boleh sama!");
  const pembimbing1Count = await database.pembimbing.count({
    where: {
      id: result.pembimbing_satu_id,
    },
  });
  const pembimbing2Count = await database.pembimbing.count({
    where: {
      id: result.pembimbing_dua_id,
    },
  });
  if (!pembimbing1Count || !pembimbing2Count)
    throw new ResponseError(
      400,
      "pembimbing 1 atau 2 tidak ditemukan, silahkan memasukkan id pembimbing yang valid"
    );
  await database.pengajuan_ta.update({
    data: {
      status: "diterima",
      keterangan: result.keterangan,
    },
    where: {
      id: pengajuanTa.id,
    },
    select: {
      id: true,
    },
  });
  const disetujuiResponse = await database.tugas_akhir_disetujui.create({
    data: {
      id: crypto.randomUUID(),
      pengajuan_ta_id: pengajuanTa.id,
      pembimbing_satu_id: result.pembimbing_satu_id,
      pembimbing_dua_id: result.pembimbing_dua_id,
      judul_penelitian: result.judul_penelitian,
    },
  });
  return new Response(
    200,
    "berhasil menerima pengajuan tugas akhir",
    disetujuiResponse,
    null,
    false
  );
};

export default {
  create,
  getKordinator,
  getIdKordinator,
  getMahasiswa,
  getAllPembimbing,
  ditolak,
  revisi,
  getIdPembimbing,
  diterima,
};

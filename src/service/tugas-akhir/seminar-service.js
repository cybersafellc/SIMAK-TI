import { database } from "../../app/database.js";
import { Response } from "../../app/response.js";
import { ResponseError } from "../../errors/response-error.js";
import seminarValidation from "../../validations/tugas-akhir/seminar-validation.js";
import validation from "../../validations/validation.js";
import crypto from "crypto";

const createSempro = async (request) => {
  const result = await validation(seminarValidation.createSempro, request);
  const count = await database.seminar.count({
    where: {
      mahasiswa_id: result.mahasiswa_id,
      jenis_seminar: "sempro",
    },
  });
  if (count)
    throw new ResponseError(400, "anda sudah mengajukan seminar proposal");
  const pengajuanTa = await database.pengajuan_ta.findFirst({
    where: {
      mahasiswa_id: result.mahasiswa_id,
      status: "diterima",
    },
  });
  if (!pengajuanTa)
    throw new ResponseError(
      400,
      "tidak ada pengajuan tugas akhir anda yang diterima"
    );
  const tugasAkhirDisetujui = await database.tugas_akhir_disetujui.findFirst({
    where: {
      pengajuan_ta_id: pengajuanTa.id,
    },
    select: {
      id: true,
    },
  });
  const executeResponse = await database.seminar.create({
    data: {
      id: crypto.randomUUID(),
      mahasiswa_id: result.mahasiswa_id,
      jenis_seminar: "sempro",
      details_seminar: tugasAkhirDisetujui.id,
      status: "menunggu",
    },
  });
  return new Response(
    200,
    "berhasil mengajukan seminar proposal",
    executeResponse,
    null,
    false
  );
};

const setujuiSempro = async (request) => {
  const result = await validation(seminarValidation.setujuiSempro, request);
  const count = await database.seminar.count({
    where: {
      id: result.id,
      jenis_seminar: "sempro",
      status: "menunggu",
    },
  });
  if (!count)
    throw new ResponseError(
      400,
      "tidak ada seminar proposal id:" + result.id + " dengan status menunggu"
    );
  await database.seminar.update({
    data: {
      tanggal_seminar: result.tanggal_seminar,
      jam_mulai_seminar: result.jam_mulai_seminar,
      jam_akhir_seminar: result.jam_akhir_seminar,
      status: "disetujui",
      ruangan: result.ruangan,
      lampiran: result.lampiran,
    },
    where: {
      id: result.id,
    },
  });
  const resSetPenguji = await database.penguji.create({
    data: {
      id: crypto.randomUUID(),
      seminar_id: result.id,
      penguji_satu: result.penguji_satu,
      penguji_dua: result.penguji_dua,
    },
  });
  return new Response(
    200,
    "berhasil menyetujui seminar id:" + result.id,
    resSetPenguji,
    null,
    false
  );
};

const getKordinatorSempro = async (request) => {
  const result = await validation(
    seminarValidation.getKordinatorSempro,
    request
  );
  const take = 30;
  result.page -= 1;
  result.page *= 30;
  let seminars = await database.seminar.findMany({
    where: {
      jenis_seminar: "sempro",
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
  if (seminars.length > 0) {
    seminars = await Promise.all(
      seminars.map(async (seminar) => {
        seminar.penguji = await database.penguji.findFirst({
          where: {
            seminar_id: seminar.id,
          },
          select: {
            id: true,
            penguji_satu: true,
            penguji_dua: true,
            created_at: true,
            update_at: true,
          },
        });
        seminar.penilaian = await database.penilaian_seminar_proposal.findFirst(
          {
            where: {
              seminar_id: seminar.id,
            },
            select: {
              id: true,
              nilai_sempro: true,
              nilai_sidang_komprehensif: true,
              nilai_pembimbing_satu: true,
              niali_pembimbing_dua: true,
              created_at: true,
              update_at: true,
            },
          }
        );
        seminar.mahasiswa = await database.mahasiswa.findUnique({
          where: {
            id: seminar.mahasiswa_id,
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
        seminar.details_seminar =
          await database.tugas_akhir_disetujui.findUnique({
            where: {
              id: seminar.details_seminar,
            },
          });
        if (seminar.details_seminar) {
          seminar.details_seminar.pembimbing_satu =
            await database.pembimbing.findUnique({
              where: {
                id: seminar.details_seminar.pembimbing_satu_id,
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
          seminar.details_seminar.pembimbing_dua =
            await database.pembimbing.findUnique({
              where: {
                id: seminar.details_seminar.pembimbing_dua_id,
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
          seminar.details_seminar.pembimbing_satu_id = undefined;
          seminar.details_seminar.pembimbing_dua_id = undefined;
        }
        seminar.mahasiswa_id = undefined;
        return seminar;
      })
    );
  }
  return new Response(200, "list seminar proposal", seminars, null, false);
};

const getKordinatorByIdSempro = async (request) => {
  const result = await validation(
    seminarValidation.getKordinatorByIdSempro,
    request
  );
  let seminar = await database.seminar.findUnique({
    where: {
      id: result.id,
      jenis_seminar: "sempro",
    },
  });
  if (!seminar)
    throw new ResponseError(
      400,
      "seminar proposal dengan id:" + result.id + " tidak ditemukan"
    );
  seminar.penguji = await database.penguji.findFirst({
    where: {
      seminar_id: seminar.id,
    },
    select: {
      id: true,
      penguji_satu: true,
      penguji_dua: true,
      created_at: true,
      update_at: true,
    },
  });
  seminar.penilaian = await database.penilaian_seminar_proposal.findFirst({
    where: {
      seminar_id: seminar.id,
    },
    select: {
      id: true,
      nilai_sempro: true,
      nilai_sidang_komprehensif: true,
      nilai_pembimbing_satu: true,
      niali_pembimbing_dua: true,
      created_at: true,
      update_at: true,
    },
  });
  seminar.mahasiswa = await database.mahasiswa.findUnique({
    where: {
      id: seminar.mahasiswa_id,
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
  seminar.details_seminar = await database.tugas_akhir_disetujui.findUnique({
    where: {
      id: seminar.details_seminar,
    },
  });
  if (seminar.details_seminar) {
    seminar.details_seminar.pembimbing_satu =
      await database.pembimbing.findUnique({
        where: {
          id: seminar.details_seminar.pembimbing_satu_id,
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
    seminar.details_seminar.pembimbing_dua =
      await database.pembimbing.findUnique({
        where: {
          id: seminar.details_seminar.pembimbing_dua_id,
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
    seminar.details_seminar.pembimbing_satu_id = undefined;
    seminar.details_seminar.pembimbing_dua_id = undefined;
  }
  seminar.mahasiswa_id = undefined;
  return new Response(
    200,
    "detail seminar proposal id:" + result.id,
    seminar,
    null,
    false
  );
};

const getMahasiswaSempro = async (request) => {
  const result = await validation(
    seminarValidation.getMahasiswaSempro,
    request
  );
  const seminar = await database.seminar.findFirst({
    where: {
      mahasiswa_id: result.mahasiswa_id,
      jenis_seminar: "sempro",
    },
  });
  if (!seminar)
    throw new ResponseError(400, "anda belum mengajukan seminar proposal");
  seminar.penguji = await database.penguji.findFirst({
    where: {
      seminar_id: seminar.id,
    },
    select: {
      id: true,
      penguji_satu: true,
      penguji_dua: true,
      created_at: true,
      update_at: true,
    },
  });
  seminar.penilaian = await database.penilaian_seminar_proposal.findFirst({
    where: {
      seminar_id: seminar.id,
    },
    select: {
      id: true,
      nilai_sempro: true,
      nilai_sidang_komprehensif: true,
      nilai_pembimbing_satu: true,
      niali_pembimbing_dua: true,
      created_at: true,
      update_at: true,
    },
  });
  seminar.details_seminar = await database.tugas_akhir_disetujui.findUnique({
    where: {
      id: seminar.details_seminar,
    },
  });
  if (seminar.details_seminar) {
    seminar.details_seminar.pembimbing_satu =
      await database.pembimbing.findUnique({
        where: {
          id: seminar.details_seminar.pembimbing_satu_id,
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
    seminar.details_seminar.pembimbing_dua =
      await database.pembimbing.findUnique({
        where: {
          id: seminar.details_seminar.pembimbing_dua_id,
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
    seminar.details_seminar.pembimbing_satu_id = undefined;
    seminar.details_seminar.pembimbing_dua_id = undefined;
  }
  seminar.mahasiswa_id = undefined;
  return new Response(
    200,
    "detail seminar proposal anda",
    seminar,
    null,
    false
  );
};

const penilaianSempro = async (request) => {
  const result = await validation(seminarValidation.penilaian, request);
  const count = await database.penilaian_seminar_proposal.count({
    where: {
      seminar_id: result.id,
    },
  });
  if (count)
    throw new ResponseError(400, "seminar ini sudah dilakukan penilaian");
  const seminar = await database.seminar.findFirst({
    where: {
      id: result.id,
      jenis_seminar: "sempro",
      status: "disetujui",
    },
  });
  if (!seminar)
    throw new ResponseError(
      400,
      "tidak ada seminar proposal id:" + result.id + " dengan status disetujui"
    );
  const resPenilaian = await database.penilaian_seminar_proposal.create({
    data: {
      id: crypto.randomUUID(),
      mahasiswa_id: seminar.mahasiswa_id,
      seminar_id: seminar.id,
      nilai_sempro: result.nilai_sempro,
      nilai_sidang_komprehensif: result.nilai_sidang_komprehensif,
      nilai_pembimbing_satu: result.nilai_pembimbing_satu,
      niali_pembimbing_dua: result.nilai_pembimbing_dua,
    },
  });
  return new Response(
    200,
    "berhasil memberikan nilai",
    resPenilaian,
    null,
    false
  );
};

const createSemhas = async (request) => {
  const result = await validation(seminarValidation.createSemhas, request);
  const count = await database.seminar.count({
    where: {
      mahasiswa_id: result.mahasiswa_id,
      jenis_seminar: "semhas",
    },
  });
  if (count)
    throw new ResponseError(400, "anda sudah mengajukan seminar hasil!");
  const countSemrpo = await database.seminar.count({
    where: {
      mahasiswa_id: result.mahasiswa_id,
      jenis_seminar: "sempro",
      status: "disetujui",
    },
  });
  if (!countSemrpo)
    throw new ResponseError(400, "anda belum menyelesaikan seminar proposal!");
  const tugasAkhirDisetujui = await database.tugas_akhir_disetujui.findFirst({
    where: {
      pengajuan_ta: {
        mahasiswa_id: result.mahasiswa_id,
      },
    },
    select: {
      id: true,
    },
  });
  result.id = crypto.randomUUID();
  result.jenis_seminar = "semhas";
  result.details_seminar = tugasAkhirDisetujui.id;
  result.status = "menunggu";
  const resCreate = await database.seminar.create({
    data: result,
  });
  return new Response(
    200,
    "berhasil mengajukan seminar hasil",
    resCreate,
    null,
    false
  );
};

const setujuiSemhas = async (request) => {
  const result = await validation(seminarValidation.setujuiSemhas, request);
  const count = await database.seminar.count({
    where: {
      id: result.id,
      jenis_seminar: "semhas",
      status: "menunggu",
    },
  });
  if (!count)
    throw new ResponseError(
      400,
      "tidak ada pengajuan seminar hasil untuk id:" + result.id
    );
  await database.seminar.update({
    data: {
      tanggal_seminar: result.tanggal_seminar,
      jam_mulai_seminar: result.jam_mulai_seminar,
      jam_akhir_seminar: result.jam_akhir_seminar,
      status: "disetujui",
      ruangan: result.ruangan,
      lampiran: result.lampiran,
    },
    select: {
      id: true,
    },
    where: {
      id: result.id,
    },
  });
  await database.penguji.create({
    data: {
      id: crypto.randomUUID(),
      seminar_id: result.id,
      penguji_satu: result.penguji_satu,
      penguji_dua: result.penguji_dua,
    },
    select: {
      id: true,
    },
  });
  return new Response(
    200,
    "berhasil menyetujui seminar hasil id:" + result.id,
    result,
    null,
    false
  );
};

const getKordinatorSemhas = async (request) => {
  const result = await validation(
    seminarValidation.getKordinatorSemhas,
    request
  );
  const take = 30;
  result.page -= 1;
  result.page *= 30;
  let seminars = await database.seminar.findMany({
    where: {
      jenis_seminar: "semhas",
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
  if (seminars.length > 0) {
    seminars = await Promise.all(
      seminars.map(async (seminar) => {
        seminar.penguji = await database.penguji.findFirst({
          where: {
            seminar_id: seminar.id,
          },
          select: {
            id: true,
            penguji_satu: true,
            penguji_dua: true,
            created_at: true,
            update_at: true,
          },
        });
        seminar.penilaian = await database.penilaian_seminar_hasil.findFirst({
          where: {
            seminar_id: seminar.id,
          },
          select: {
            id: true,
            nilai_semhas: true,
            nilai_sidang_komprehensif: true,
            nilai_pembimbing_satu: true,
            niali_pembimbing_dua: true,
            created_at: true,
            update_at: true,
          },
        });
        seminar.mahasiswa = await database.mahasiswa.findUnique({
          where: {
            id: seminar.mahasiswa_id,
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
        seminar.details_seminar =
          await database.tugas_akhir_disetujui.findUnique({
            where: {
              id: seminar.details_seminar,
            },
          });
        if (seminar.details_seminar) {
          seminar.details_seminar.pembimbing_satu =
            await database.pembimbing.findUnique({
              where: {
                id: seminar.details_seminar.pembimbing_satu_id,
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
          seminar.details_seminar.pembimbing_dua =
            await database.pembimbing.findUnique({
              where: {
                id: seminar.details_seminar.pembimbing_dua_id,
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
          seminar.details_seminar.pembimbing_satu_id = undefined;
          seminar.details_seminar.pembimbing_dua_id = undefined;
        }
        seminar.mahasiswa_id = undefined;
        return seminar;
      })
    );
  }
  return new Response(200, "list seminar hasil", seminars, null, false);
};

const getKordinatorByIdSemhas = async (request) => {
  const result = await validation(
    seminarValidation.getKordinatorByIdSemhas,
    request
  );
  let seminar = await database.seminar.findUnique({
    where: {
      id: result.id,
      jenis_seminar: "semhas",
    },
  });
  if (!seminar)
    throw new ResponseError(
      400,
      "seminar hasil dengan id:" + result.id + " tidak ditemukan"
    );
  seminar.penguji = await database.penguji.findFirst({
    where: {
      seminar_id: seminar.id,
    },
    select: {
      id: true,
      penguji_satu: true,
      penguji_dua: true,
      created_at: true,
      update_at: true,
    },
  });
  seminar.penilaian = await database.penilaian_seminar_hasil.findFirst({
    where: {
      seminar_id: seminar.id,
    },
    select: {
      id: true,
      nilai_semhas: true,
      nilai_sidang_komprehensif: true,
      nilai_pembimbing_satu: true,
      niali_pembimbing_dua: true,
      created_at: true,
      update_at: true,
    },
  });
  seminar.mahasiswa = await database.mahasiswa.findUnique({
    where: {
      id: seminar.mahasiswa_id,
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
  seminar.details_seminar = await database.tugas_akhir_disetujui.findUnique({
    where: {
      id: seminar.details_seminar,
    },
  });
  if (seminar.details_seminar) {
    seminar.details_seminar.pembimbing_satu =
      await database.pembimbing.findUnique({
        where: {
          id: seminar.details_seminar.pembimbing_satu_id,
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
    seminar.details_seminar.pembimbing_dua =
      await database.pembimbing.findUnique({
        where: {
          id: seminar.details_seminar.pembimbing_dua_id,
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
    seminar.details_seminar.pembimbing_satu_id = undefined;
    seminar.details_seminar.pembimbing_dua_id = undefined;
  }
  seminar.mahasiswa_id = undefined;
  return new Response(
    200,
    "detail seminar hasil id:" + result.id,
    seminar,
    null,
    false
  );
};

const getMahasiswaSemhas = async (request) => {
  const result = await validation(
    seminarValidation.getMahasiswaSemhas,
    request
  );
  const seminar = await database.seminar.findFirst({
    where: {
      mahasiswa_id: result.mahasiswa_id,
      jenis_seminar: "semhas",
    },
  });
  if (!seminar)
    throw new ResponseError(400, "anda belum mengajukan seminar hasil");
  seminar.penguji = await database.penguji.findFirst({
    where: {
      seminar_id: seminar.id,
    },
    select: {
      id: true,
      penguji_satu: true,
      penguji_dua: true,
      created_at: true,
      update_at: true,
    },
  });
  seminar.penilaian = await database.penilaian_seminar_hasil.findFirst({
    where: {
      seminar_id: seminar.id,
    },
    select: {
      id: true,
      nilai_semhas: true,
      nilai_sidang_komprehensif: true,
      nilai_pembimbing_satu: true,
      niali_pembimbing_dua: true,
      created_at: true,
      update_at: true,
    },
  });
  seminar.details_seminar = await database.tugas_akhir_disetujui.findUnique({
    where: {
      id: seminar.details_seminar,
    },
  });
  if (seminar.details_seminar) {
    seminar.details_seminar.pembimbing_satu =
      await database.pembimbing.findUnique({
        where: {
          id: seminar.details_seminar.pembimbing_satu_id,
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
    seminar.details_seminar.pembimbing_dua =
      await database.pembimbing.findUnique({
        where: {
          id: seminar.details_seminar.pembimbing_dua_id,
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
    seminar.details_seminar.pembimbing_satu_id = undefined;
    seminar.details_seminar.pembimbing_dua_id = undefined;
  }
  seminar.mahasiswa_id = undefined;
  return new Response(200, "detail seminar hasil anda", seminar, null, false);
};

const penilaianSemhas = async (request) => {
  const result = await validation(seminarValidation.penilaianSemhas, request);
  const count = await database.penilaian_seminar_hasil.count({
    where: {
      seminar_id: result.id,
    },
  });
  if (count)
    throw new ResponseError(400, "seminar ini sudah dilakukan penilaian");
  const seminar = await database.seminar.findFirst({
    where: {
      id: result.id,
      jenis_seminar: "semhas",
      status: "disetujui",
    },
  });
  if (!seminar)
    throw new ResponseError(
      400,
      "tidak ada seminar hasil id:" + result.id + " dengan status disetujui"
    );
  const resPenilaian = await database.penilaian_seminar_hasil.create({
    data: {
      id: crypto.randomUUID(),
      mahasiswa_id: seminar.mahasiswa_id,
      seminar_id: seminar.id,
      nilai_semhas: result.nilai_semhas,
      nilai_sidang_komprehensif: result.nilai_sidang_komprehensif,
      nilai_pembimbing_satu: result.nilai_pembimbing_satu,
      niali_pembimbing_dua: result.nilai_pembimbing_dua,
    },
  });
  return new Response(
    200,
    "berhasil memberikan nilai",
    resPenilaian,
    null,
    false
  );
};

export default {
  createSempro,
  setujuiSempro,
  getKordinatorSempro,
  getKordinatorByIdSempro,
  getMahasiswaSempro,
  penilaianSempro,
  createSemhas,
  setujuiSemhas,
  getKordinatorSemhas,
  getKordinatorByIdSemhas,
  getMahasiswaSemhas,
  penilaianSemhas,
};

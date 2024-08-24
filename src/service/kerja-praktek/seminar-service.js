import { database } from "../../app/database.js";
import { Response } from "../../app/response.js";
import { ResponseError } from "../../errors/response-error.js";
import seminarValidation from "../../validations/kerja-praktek/seminar-validation.js";
import validation from "../../validations/validation.js";
import crypto from "crypto";

const create = async (request) => {
  const result = await validation(seminarValidation.create, request);
  //   validasi apakah sudah mengajukan seminar kp
  const count = await database.seminar.count({
    where: {
      mahasiswa_id: result.mahasiswa_id,
      jenis_seminar: "kp",
    },
  });
  if (count)
    throw new ResponseError(
      400,
      "anda sudah mengajukan seminar kp sebelumnya !"
    );
  //   validasi pengajuan kp dipastikan sudah di ajukan dan diterima statusnya
  result.status = "diterima";
  const pengajuan_kp = await database.pengajuan_kp.findFirst({
    where: {
      mahasiswa_id: result.mahasiswa_id,
      status: "diterima",
    },
    select: {
      id: true,
    },
  });
  if (!pengajuan_kp)
    throw new ResponseError(
      400,
      "maaf kamu belum bisa melakukan pengajuan seminar!. Pastikan pengajuan kp anda sudah disetujui/diterima kordinator terlebih dahulu."
    );
  // validasi sudah memiliki judul laporan
  const kerja_praktek_disetujui =
    await database.kerja_praktek_disetujui.findFirst({
      where: {
        pengajuan_kp_id: pengajuan_kp.id,
      },
      select: {
        id: true,
        judul_laporan: true,
      },
    });
  if (!kerja_praktek_disetujui?.judul_laporan)
    throw new ResponseError(400, "maaf anda belum memiliki judul laporan !");
  //   pengajuan seminar
  const dataSeminar = {};
  dataSeminar.id = crypto.randomUUID();
  dataSeminar.mahasiswa_id = result.mahasiswa_id;
  dataSeminar.jenis_seminar = "kp";
  dataSeminar.details_seminar = kerja_praktek_disetujui.id;
  dataSeminar.status = "menunggu";
  dataSeminar.bukti_acc_pembimbing = result.bukti_acc_pembimbing;

  const createSeminar = await database.seminar.create({
    data: dataSeminar,
  });

  return new Response(
    200,
    "berhasil megajukan seminar",
    createSeminar,
    null,
    false
  );
};

const disetujui = async (request) => {
  const result = await validation(seminarValidation.disetujui, request);
  const count = await database.seminar.count({
    where: {
      id: result.id,
      jenis_seminar: "kp",
      status: "menunggu",
    },
  });
  if (!count)
    throw new ResponseError(
      400,
      "tidak ada seminar id:" + result.id + " dengan status menunggu"
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
    select: {
      id: true,
    },
  });
  await database.penguji.create({
    data: {
      id: crypto.randomUUID(),
      seminar_id: result.id,
      penguji_satu: result.penguji_satu,
      penguji_dua: result.penguji_dua,
    },
  });
  return new Response(
    200,
    "berhasil menyetujui dan menetapkan penguji untuk seminar id:" + result.id,
    result,
    null,
    false
  );
};

const getPKordinator = async (request) => {
  const result = await validation(seminarValidation.getPKordinator, request);
  const take = 30;
  result.page -= 1;
  result.page *= take;
  let seminars = await database.seminar.findMany({
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
      jenis_seminar: "kp",
    },
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
        seminar.penilaian_seminar_kp =
          await database.penilaian_seminar_kp.findFirst({
            where: {
              seminar_id: seminar.id,
            },
            select: {
              id: true,
              nilai: true,
              nilai_sidang_komprehensif: true,
              nilai_pembimbing_satu: true,
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
          await database.kerja_praktek_disetujui.findUnique({
            where: {
              id: seminar.details_seminar,
            },
            select: {
              id: true,
              pembimbing_satu_id: true,
              judul_laporan: true,
              created_at: true,
              update_at: true,
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
                created_at: true,
                update_at: true,
              },
            });
          seminar.details_seminar.pembimbing_satu_id = undefined;
        }
        seminar.mahasiswa_id = undefined;
        return seminar;
      })
    );
  }
  return new Response(200, "list seminar", seminars, null, false);
};

const getPKordinatorById = async (request) => {
  const result = await validation(
    seminarValidation.getPKordinatorById,
    request
  );
  const seminar = await database.seminar.findUnique({
    where: {
      id: result.id,
      jenis_seminar: "kp",
    },
  });
  if (!seminar)
    throw new ResponseError(
      400,
      "seminar dengan id:" + result.id + " tidak ada!"
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
  seminar.penilaian_seminar_kp = await database.penilaian_seminar_kp.findFirst({
    where: {
      seminar_id: seminar.id,
    },
    select: {
      id: true,
      nilai: true,
      nilai_sidang_komprehensif: true,
      nilai_pembimbing_satu: true,
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
  seminar.details_seminar = await database.kerja_praktek_disetujui.findUnique({
    where: {
      id: seminar.details_seminar,
    },
    select: {
      id: true,
      pembimbing_satu_id: true,
      judul_laporan: true,
      created_at: true,
      update_at: true,
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
          created_at: true,
          update_at: true,
        },
      });
    seminar.details_seminar.pembimbing_satu_id = undefined;
  }
  seminar.mahasiswa_id = undefined;
  return new Response(
    200,
    "seminar kp dengan id:" + result.id,
    seminar,
    null,
    false
  );
};

const getPMahasiswa = async (request) => {
  const result = await validation(seminarValidation.getPMahasiswa, request);
  result.jenis_seminar = "kp";
  const seminar = await database.seminar.findFirst({
    where: result,
  });
  if (!seminar)
    throw new ResponseError(400, "anda belum mengajukan seminar kp!");
  seminar.details_seminar = await database.kerja_praktek_disetujui.findUnique({
    where: {
      id: seminar.details_seminar,
    },
    select: {
      id: true,
      pembimbing_satu_id: true,
      judul_laporan: true,
      created_at: true,
      update_at: true,
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
          created_at: true,
          update_at: true,
        },
      });
    seminar.details_seminar.pembimbing_satu_id = undefined;
  }
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
  seminar.penilaian_seminar_kp = await database.penilaian_seminar_kp.findFirst({
    where: {
      seminar_id: seminar.id,
    },
    select: {
      id: true,
      nilai: true,
      nilai_sidang_komprehensif: true,
      nilai_pembimbing_satu: true,
      created_at: true,
      update_at: true,
    },
  });
  return new Response(200, "details seminar", seminar, null, false);
};

const penilaian = async (request) => {
  const result = await validation(seminarValidation.penilaian, request);
  const count = await database.penilaian_seminar_kp.count({
    where: {
      seminar_id: result.id,
    },
  });
  if (count)
    throw new ResponseError(400, "seminar ini sudah dilakukan penilaian");
  const seminar = await database.seminar.findFirst({
    where: {
      id: result.id,
      status: "disetujui",
      jenis_seminar: "kp",
    },
  });
  if (!seminar)
    throw new ResponseError(
      400,
      "tidak ada seminar kp disetujui dengan id:" + result.id
    );
  const resPenilaian = await database.penilaian_seminar_kp.create({
    data: {
      id: crypto.randomUUID(),
      mahasiswa_id: seminar.mahasiswa_id,
      seminar_id: seminar.id,
      nilai: result.nilai,
      nilai_sidang_komprehensif: result.nilai_sidang_komprehensif,
      nilai_pembimbing_satu: result.nilai_pembimbing_satu,
    },
  });
  return new Response(
    200,
    "berhasil menambahkan nilai",
    resPenilaian,
    null,
    false
  );
};

export default {
  create,
  disetujui,
  getPKordinator,
  getPKordinatorById,
  getPMahasiswa,
  penilaian,
};

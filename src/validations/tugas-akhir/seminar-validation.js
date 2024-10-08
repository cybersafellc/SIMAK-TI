import Joi from "joi";

const createSempro = Joi.object({
  mahasiswa_id: Joi.string().required(),
  bukti_acc_pembimbing: Joi.string().required(),
});

const setujuiSempro = Joi.object({
  id: Joi.string().required(),
  tanggal_seminar: Joi.date().required(),
  jam_mulai_seminar: Joi.date().required(),
  jam_akhir_seminar: Joi.date().required(),
  ruangan: Joi.string().required(),
  lampiran: Joi.string().optional(),
  penguji_satu: Joi.string().required(),
  penguji_dua: Joi.string().required(),
});

const getKordinatorSempro = Joi.object({
  page: Joi.number().required(),
  search: Joi.string().optional(),
});

const getKordinatorByIdSempro = Joi.object({
  id: Joi.string().required(),
});

const getMahasiswaSempro = Joi.object({
  mahasiswa_id: Joi.string().required(),
});

const penilaian = Joi.object({
  id: Joi.string().required(),
  nilai_sempro: Joi.string().required(),
  nilai_sidang_komprehensif: Joi.string().required(),
  nilai_pembimbing_satu: Joi.string().required(),
  nilai_pembimbing_dua: Joi.string().required(),
});

const createSemhas = Joi.object({
  mahasiswa_id: Joi.string().required(),
  bukti_acc_pembimbing: Joi.string().required(),
});

const setujuiSemhas = Joi.object({
  id: Joi.string().required(),
  tanggal_seminar: Joi.date().required(),
  jam_mulai_seminar: Joi.date().required(),
  jam_akhir_seminar: Joi.date().required(),
  ruangan: Joi.string().required(),
  lampiran: Joi.string().optional(),
  penguji_satu: Joi.string().required(),
  penguji_dua: Joi.string().required(),
});

const getKordinatorSemhas = Joi.object({
  page: Joi.number().required(),
  search: Joi.string().optional(),
});

const getKordinatorByIdSemhas = Joi.object({
  id: Joi.string().required(),
});

const getMahasiswaSemhas = Joi.object({
  mahasiswa_id: Joi.string().required(),
});

const penilaianSemhas = Joi.object({
  id: Joi.string().required(),
  nilai_semhas: Joi.string().required(),
  nilai_sidang_komprehensif: Joi.string().required(),
  nilai_pembimbing_satu: Joi.string().required(),
  nilai_pembimbing_dua: Joi.string().required(),
});

export default {
  createSempro,
  setujuiSempro,
  getKordinatorSempro,
  getKordinatorByIdSempro,
  getMahasiswaSempro,
  penilaian,
  createSemhas,
  setujuiSemhas,
  getKordinatorSemhas,
  getKordinatorByIdSemhas,
  getMahasiswaSemhas,
  penilaianSemhas,
};

import Joi from "joi";

const create = Joi.object({
  mahasiswa_id: Joi.string().required(),
  form_ta: Joi.string().required(),
  judul_pertama: Joi.string().required(),
  deskripsi_judul_pertama: Joi.string().required(),
  judul_kedua: Joi.string().required(),
  deskripsi_judul_kedua: Joi.string().required(),
  pembimbing_satu: Joi.string().required(),
  pembimbing_dua: Joi.string().required(),
  pembimbing_tiga: Joi.string().required(),
  pembimbing_empat: Joi.string().required(),
  transkip_nilai: Joi.string().required(),
  krs: Joi.string().required(),
  bukti_pembayaran: Joi.string().required(),
  bukti_selesai_praktikum: Joi.string().required(),
  bukti_selsai_kp: Joi.string().required(),
  jumlah_sks: Joi.string().required(),
  ipk: Joi.string().required(),
});

const getAllKordinator = Joi.object({
  page: Joi.number().required(),
  search: Joi.string().optional(),
});

const getIdKordinator = Joi.object({
  id: Joi.string().required(),
});

const getMahasiswa = Joi.object({
  mahasiswa_id: Joi.string().required(),
});

const getAllPembimbing = Joi.object({
  pembimbing_id: Joi.string().required(),
  page: Joi.number().required(),
  search: Joi.string().optional(),
});

const getIdPembimbing = Joi.object({
  pembimbing_id: Joi.string().required(),
  id: Joi.string().required(),
});

const ditolak = Joi.object({
  id: Joi.string().required(),
  keterangan: Joi.string().required(),
});

const revisi = Joi.object({
  mahasiswa_id: Joi.string().required(),
  form_ta: Joi.string().optional(),
  judul_pertama: Joi.string().optional(),
  deskripsi_judul_pertama: Joi.string().optional(),
  judul_kedua: Joi.string().optional(),
  deskripsi_judul_kedua: Joi.string().optional(),
  transkip_nilai: Joi.string().optional(),
  krs: Joi.string().optional(),
  bukti_pembayaran: Joi.string().optional(),
  bukti_selesai_praktikum: Joi.string().optional(),
  bukti_selsai_kp: Joi.string().optional(),
  jumlah_sks: Joi.string().optional(),
  ipk: Joi.string().optional(),
});

const diterima = Joi.object({
  id: Joi.string().required(),
  pembimbing_satu_id: Joi.string().required(),
  pembimbing_dua_id: Joi.string().required(),
  judul_penelitian: Joi.string().required(),
  keterangan: Joi.string().optional(),
});

export default {
  create,
  getAllKordinator,
  getIdKordinator,
  getMahasiswa,
  getAllPembimbing,
  ditolak,
  revisi,
  diterima,
  getIdPembimbing,
};

import Joi from "joi";

const create = Joi.object({
  mahasiswa_id: Joi.string().required(),
  form_rekomendasi_pa_1: Joi.string().required(),
  form_rekomendasi_pa_2: Joi.string().required(),
  form_persetujuan_perusahaan: Joi.string().required(),
  transkip_nilai: Joi.string().required(),
  krs: Joi.string().required(),
  bukti_pembayaran: Joi.string().required(),
  bukti_selesai_praktikum: Joi.string().required(),
  ipk: Joi.string().required(),
  jumlah_sks: Joi.string().required(),
});

const getMahasiswa = Joi.object({
  id: Joi.string().required(),
});

const getAllByKordinator = Joi.object({
  page: Joi.number().required(),
  search: Joi.string().optional(),
});

const getById = Joi.object({
  id: Joi.string().required(),
});

const getAllByPembimbing = Joi.object({
  page: Joi.number().required(),
  search: Joi.string().optional(),
  id: Joi.string().required(),
});

const getByIdPembimbing = Joi.object({
  id: Joi.string().required(),
  byid: Joi.string().required(),
});

const diterima = Joi.object({
  id: Joi.string().required(),
  keterangan: Joi.string().required(),
  pembimbing_id: Joi.string().required(),
});

const ditolak = Joi.object({
  id: Joi.string().required(),
  keterangan: Joi.string().required(),
});

const revisi = Joi.object({
  mahasiswa_id: Joi.string().required(),
  form_rekomendasi_pa_1: Joi.string().optional(),
  form_rekomendasi_pa_2: Joi.string().optional(),
  form_persetujuan_perusahaan: Joi.string().optional(),
  transkip_nilai: Joi.string().optional(),
  krs: Joi.string().optional(),
  bukti_pembayaran: Joi.string().optional(),
  bukti_selesai_praktikum: Joi.string().optional(),
  ipk: Joi.string().optional(),
  jumlah_sks: Joi.string().optional(),
});

const setJadwal = Joi.object({
  tanggal_mulai_kp: Joi.date().required(),
  tanggal_selesai_kp: Joi.date().required(),
  id: Joi.string().required(),
});

const setJudulLaporan = Joi.object({
  id: Joi.string().required(),
  pembimbing_id: Joi.string().required(),
  judul_laporan: Joi.string().required(),
});

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
  setJadwal,
  setJudulLaporan,
};

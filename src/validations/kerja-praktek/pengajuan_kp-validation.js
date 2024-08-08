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

export default { create, getMahasiswa, getAllByKordinator, getById };

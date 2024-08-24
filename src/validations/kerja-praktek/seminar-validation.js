import Joi from "joi";

const create = Joi.object({
  mahasiswa_id: Joi.string().required(),
  bukti_acc_pembimbing: Joi.string().required(),
});

const disetujui = Joi.object({
  id: Joi.string().required(),
  tanggal_seminar: Joi.date().required(),
  jam_mulai_seminar: Joi.date().required(),
  jam_akhir_seminar: Joi.date().required(),
  ruangan: Joi.string().required(),
  lampiran: Joi.string().optional(),
  penguji_satu: Joi.string().required(),
  penguji_dua: Joi.string().required(),
});

const getPKordinator = Joi.object({
  page: Joi.number().required(),
  search: Joi.string().optional(),
});

const getPKordinatorById = Joi.object({
  id: Joi.string().required(),
});

const getPMahasiswa = Joi.object({
  mahasiswa_id: Joi.string().required(),
});

const penilaian = Joi.object({
  id: Joi.string().required(),
  nilai: Joi.string().required(),
  nilai_sidang_komprehensif: Joi.string().required(),
  nilai_pembimbing_satu: Joi.string().required(),
});

export default {
  create,
  disetujui,
  getPKordinator,
  getPKordinatorById,
  getPMahasiswa,
  penilaian,
};

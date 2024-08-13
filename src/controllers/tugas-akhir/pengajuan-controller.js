import pengajuanService from "../../service/tugas-akhir/pengajuan-service.js";
import validation from "../../validations/validation.js";

const create = async (req, res, next) => {
  try {
    req.body.mahasiswa_id = await req.id;
    const response = await pengajuanService.create(req.body);
    res.status(response.status).json(response).end();
  } catch (error) {
    next(error);
  }
};

const get = async (req, res, next) => {
  try {
    const { role, id } = await req;
    let response;
    switch (role) {
      case "kordinator":
        if (req.query.id) {
          req.body.id = await req.query.id;
          response = await pengajuanService.getIdKordinator(req.body);
        } else {
          req.body.page = (await req.query.page) || 1;
          req.body.search = (await req.query.search) || undefined;
          response = await pengajuanService.getKordinator(req.body);
        }
        break;
      case "mahasiswa":
        req.body.mahasiswa_id = id;
        response = await pengajuanService.getMahasiswa(req.body);

        break;
      case "pembimbing":
        if (req.query.id) {
          req.body.pembimbing_id = id;
          req.body.id = await req.query.id;
          response = await pengajuanService.getIdPembimbing(req.body);
        } else {
          req.body.pembimbing_id = id;
          req.body.page = (await req.query.page) || 1;
          req.body.search = (await req.query.search) || undefined;
          response = await pengajuanService.getAllPembimbing(req.body);
        }
        break;
      default:
        throw new Error("ERR: Role tidak diketahui");
    }
    res.status(response.status).json(response).end();
  } catch (error) {
    next(error);
  }
};

const ditolak = async (req, res, next) => {
  try {
    const response = await pengajuanService.ditolak(req.body);
    res.status(response.status).json(response).end();
  } catch (error) {
    next(error);
  }
};

const revisi = async (req, res, next) => {
  try {
    req.body.mahasiswa_id = await req.id;
    const response = await pengajuanService.revisi(req.body);
    res.status(response.status).json(response).end();
  } catch (error) {
    next(error);
  }
};

const diterima = async (req, res, next) => {
  try {
    const response = await pengajuanService.diterima(req.body);
    res.status(response.status).json(response).end();
  } catch (error) {
    next(error);
  }
};

export default { create, get, ditolak, revisi, diterima };

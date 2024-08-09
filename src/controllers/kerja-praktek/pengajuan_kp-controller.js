import pengajuan_kpService from "../../service/kerja-praktek/pengajuan_kp-service.js";

const create = async (req, res, next) => {
  try {
    req.body.mahasiswa_id = await req.id;
    const response = await pengajuan_kpService.create(req.body);
    res.status(response.status).json(response).end();
  } catch (error) {
    next(error);
  }
};

// ini belum fix, untuk get detail keselurhan harus lengkap setiap role nya, details pengajuan kp, disetujui, pembimbing / mahasiswanya
const get = async (req, res, next) => {
  try {
    const { role, id } = await req;
    let response;
    switch (role) {
      case "mahasiswa":
        req.body.id = await id;
        response = await pengajuan_kpService.getMahasiswa(req.body);
        break;
      case "kordinator":
        if (req.query.id) {
          req.body.id = await req.query.id;
          response = await pengajuan_kpService.getById(req.body);
        } else {
          req.body.page = (await req.query.page) || 1;
          req.body.search = (await req.query.search) || undefined;
          response = await pengajuan_kpService.getAllByKordinator(req.body);
        }
        break;
      case "pembimbing":
        if (req.query.id) {
          req.body.id = await req.id;
          req.body.byid = await req.query.id;
          response = await pengajuan_kpService.getByIdPembimbing(req.body);
        } else {
          req.body.page = (await req.query.page) || 1;
          req.body.search = (await req.query.search) || undefined;
          req.body.id = await req.id;
          response = await pengajuan_kpService.getAllByPembimbing(req.body);
        }
        break;
      default:
        throw new Error("role tidak diketahui");
    }
    res.status(response.status).json(response).end();
  } catch (error) {
    next(error);
  }
};

const diterima = async (req, res, next) => {
  try {
    const response = await pengajuan_kpService.diterima(req.body);
    res.status(response.status).json(response).end();
  } catch (error) {
    next(error);
  }
};

const ditolak = async (req, res, next) => {
  try {
    const response = await pengajuan_kpService.ditolak(req.body);
    res.status(response.status).json(response).end();
  } catch (error) {
    next(error);
  }
};

const revisi = async (req, res, next) => {
  try {
    req.body.mahasiswa_id = await req.id;
    const response = await pengajuan_kpService.revisi(req.body);
    res.status(response.status).json(response).end();
  } catch (error) {
    next(error);
  }
};

export default { create, get, diterima, ditolak, revisi };

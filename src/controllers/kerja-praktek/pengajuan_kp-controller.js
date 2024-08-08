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
        break;
      default:
        throw new Error("role tidak diketahui");
    }
    res.status(response.status).json(response).end();
  } catch (error) {
    next(error);
  }
};

export default { create, get };

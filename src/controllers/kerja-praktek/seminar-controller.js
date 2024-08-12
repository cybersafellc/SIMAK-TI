import seminarService from "../../service/kerja-praktek/seminar-service.js";

const create = async (req, res, next) => {
  try {
    req.body.mahasiswa_id = await req.id;
    const response = await seminarService.create(req.body);
    res.status(response.status).json(response).end();
  } catch (error) {
    next(error);
  }
};

const disetujui = async (req, res, next) => {
  try {
    const response = await seminarService.disetujui(req.body);
    res.status(response.status).json(response).end();
  } catch (error) {
    next(error);
  }
};

const get = async (req, res, next) => {
  try {
    const { role, id } = await req;
    switch (role) {
      case "kordinator":
        if (req.query.id) {
          req.body.id = await req.query.id;
          const response = await seminarService.getPKordinatorById(req.body);
          res.status(response.status).json(response).end();
        } else {
          req.body.search = (await req.query.search) || undefined;
          req.body.page = (await req.query.page) || 1;
          const response = await seminarService.getPKordinator(req.body);
          res.status(response.status).json(response).end();
        }
        break;
      case "mahasiswa":
        req.body.mahasiswa_id = id;
        const response = await seminarService.getPMahasiswa(req.body);
        res.status(response.status).json(response).end();
        break;
      default:
        throw new Error("ERR: Role tidak diketahui");
    }
  } catch (error) {
    next(error);
  }
};

const penilaian = async (req, res, next) => {
  try {
    const response = await seminarService.penilaian(req.body);
    res.status(response.status).json(response).end();
  } catch (error) {
    next(error);
  }
};

export default { create, disetujui, get, penilaian };

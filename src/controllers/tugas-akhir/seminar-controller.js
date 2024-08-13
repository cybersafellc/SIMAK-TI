import seminarService from "../../service/tugas-akhir/seminar-service.js";

const createSempro = async (req, res, next) => {
  try {
    req.body.mahasiswa_id = await req.id;
    const response = await seminarService.createSempro(req.body);
    res.status(response.status).json(response).end();
  } catch (error) {
    next(error);
  }
};

const setujuiSempro = async (req, res, next) => {
  try {
    const response = await seminarService.setujuiSempro(req.body);
    res.status(response.status).json(response).end();
  } catch (error) {
    next(error);
  }
};

const getSempro = async (req, res, next) => {
  try {
    const { role, id } = await req;
    let response;
    switch (role) {
      case "kordinator":
        if (req.query.id) {
          req.body.id = await req.query.id;
          response = await seminarService.getKordinatorByIdSempro(req.body);
        } else {
          req.body.page = (await req.query.page) || 1;
          req.body.search = (await req.query.search) || undefined;
          response = await seminarService.getKordinatorSempro(req.body);
        }
        break;
      case "mahasiswa":
        req.body.mahasiswa_id = id;
        response = await seminarService.getMahasiswaSempro(req.body);
        break;
      default:
        throw new Error("ERR: Role tidak diketahui");
    }
    res.status(response.status).json(response).end();
  } catch (error) {
    next(error);
  }
};

const penilaianSempro = async (req, res, next) => {
  try {
    const response = await seminarService.penilaianSempro(req.body);
    res.status(response.status).json(response).end();
  } catch (error) {
    next(error);
  }
};

export default { createSempro, setujuiSempro, getSempro, penilaianSempro };

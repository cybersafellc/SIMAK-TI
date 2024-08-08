import supertest from "supertest";
import {
  deletePembimbing,
  createPembimbing,
} from "./utils/pembimbing-utils.js";
import {
  createKordinator,
  deleteKordinator,
} from "./utils/kordinator-utils.js";
import { web } from "../src/app/web.js";
import { logger } from "../src/app/logging.js";

describe("POST : /pembimbing", () => {
  beforeEach(async () => {
    await createKordinator();
  });
  afterEach(async () => {
    await deleteKordinator();
    await deletePembimbing();
  });

  it("sukses membuat akun pembimbing", async () => {
    const login = await supertest(web).post("/kordinators/login").send({
      username: "testing",
      password: "testing",
    });

    expect(login.status).toBe(200);
    expect(login.body.error).toBe(false);
    expect(login.body.data.access_token).toBeDefined();

    const response = await supertest(web)
      .post("/pembimbing")
      .set("Authorization", `Bearer ${login.body.data.access_token}`)
      .send({
        nama: "testing",
        no_hp: "testing",
        nidn: "testing",
        jabatan: "testing",
        password: "testing",
        email: "testing",
      });
    logger.info(response.body);
    expect(response.status).toBe(200);
    expect(response.body.error).toBe(false);
  });

  it("inputan tidak valid", async () => {
    const login = await supertest(web).post("/kordinators/login").send({
      username: "testing",
      password: "testing",
    });
    expect(login.status).toBe(200);
    expect(login.body.error).toBe(false);
    expect(login.body.data.access_token).toBeDefined();

    const response = await supertest(web)
      .post("/pembimbing")
      .set("Authorization", `Bearer ${login.body.data.access_token}`)
      .send({
        nama: "",
        no_hp: "",
        nidn: "",
        jabatan: "",
        password: "",
        email: "",
      });
    logger.info(response.body);
    expect(response.status).toBe(400);
    expect(response.body.error).toBe(true);
  });

  it("username / nidn sudah teraftar", async () => {
    await createPembimbing();
    const login = await supertest(web).post("/kordinators/login").send({
      username: "testing",
      password: "testing",
    });
    expect(login.status).toBe(200);
    expect(login.body.error).toBe(false);
    expect(login.body.data.access_token).toBeDefined();
    const response = await supertest(web)
      .post("/pembimbing")
      .set("Authorization", `Bearer ${login.body.data.access_token}`)
      .send({
        nama: "testing",
        no_hp: "testing",
        nidn: "testing",
        jabatan: "testing",
        password: "testing",
        email: "testing",
      });
    logger.info(response.body);
    expect(response.status).toBe(400);
    expect(response.body.error).toBe(true);
  });
});

describe("POST : /pembimbing/login", () => {
  beforeEach(async () => {
    await createPembimbing();
  });
  afterEach(async () => {
    await deletePembimbing();
  });

  it("sukses login", async () => {
    const response = await supertest(web).post("/pembimbing/login").send({
      username: "testing",
      password: "testing",
    });
    logger.info(response.body);
    expect(response.status).toBe(200);
    expect(response.body.error).toBe(false);
    expect(response.body.data.access_token).toBeDefined();
  });

  it("inputan tidak valid", async () => {
    const response = await supertest(web).post("/pembimbing/login").send({
      username: "",
      password: "",
    });
    logger.info(response.body);
    expect(response.status).toBe(400);
    expect(response.body.error).toBe(true);
  });

  it("akun pembimbing belum terdaftar", async () => {
    const response = await supertest(web).post("/pembimbing/login").send({
      username: "testingsaya",
      password: "testing",
    });
    logger.info(response.body);
    expect(response.status).toBe(400);
    expect(response.body.error).toBe(true);
  });

  it("password salah", async () => {
    const response = await supertest(web).post("/pembimbing/login").send({
      username: "testing",
      password: "salah",
    });
    logger.info(response.body);
    expect(response.status).toBe(400);
    expect(response.body.error).toBe(true);
  });
});

describe("GET : /pembimbing/token-verify", () => {
  beforeEach(async () => {
    await createPembimbing();
  });
  afterEach(async () => {
    await deletePembimbing();
  });

  it("access_token active", async () => {
    const login = await supertest(web).post("/pembimbing/login").send({
      username: "testing",
      password: "testing",
    });
    expect(login.body.error).toBe(false);
    expect(login.body.data.access_token).toBeDefined();

    const response = await supertest(web)
      .get("/pembimbing/token-verify")
      .set("Authorization", `Bearer ${login.body.data.access_token}`);
    logger.info(response.body);
    expect(response.status).toBe(200);
    expect(response.body.error).toBe(false);
  });

  it("tidak menginput access_token", async () => {
    const response = await supertest(web).get("/pembimbing/token-verify");
    logger.info(response.body);
    expect(response.status).toBe(400);
    expect(response.body.error).toBe(true);
  });

  it("invalid access_token", async () => {
    const response = await supertest(web)
      .get("/pembimbing/token-verify")
      .set("Authorization", `Bearer invalidaccesstoken`);
    logger.info(response.body);
    expect(response.status).toBe(400);
    expect(response.body.error).toBe(true);
  });
});

describe("GET : /pembimbing/profile", () => {
  beforeEach(async () => {
    await createPembimbing();
  });
  afterEach(async () => {
    await deletePembimbing();
  });

  it("berhasil mendapatkan profile pembimbing", async () => {
    const login = await supertest(web).post("/pembimbing/login").send({
      username: "testing",
      password: "testing",
    });
    expect(login.body.error).toBe(false);
    expect(login.body.data.access_token).toBeDefined();

    const response = await supertest(web)
      .get("/pembimbing/profile")
      .set("Authorization", `Bearer ${login.body.data.access_token}`);
    logger.info(response.body);
    expect(response.status).toBe(200);
    expect(response.body.error).toBe(false);
  });
});

describe("GET : /pembimbing", () => {
  it("berhasil mendapatkan list pembimbing", async () => {
    const response = await supertest(web).get("/pembimbing");
    logger.info(response.body);
    expect(response.status).toBe(200);
    expect(response.body.error).toBe(false);
  });
  it("page di input string bukan number", async () => {
    const response = await supertest(web).get("/pembimbing?page=asumeneh");
    logger.info(response.body);
    expect(response.status).toBe(400);
    expect(response.body.error).toBe(true);
  });
});

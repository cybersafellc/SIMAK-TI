import supertest from "supertest";
import { createMahasiswa, deleteMahasiswa } from "./utils/mahasiswa-utils.js";
import { logger } from "../src/app/logging.js";
import { web } from "../src/app/web.js";
import {
  createKordinator,
  deleteKordinator,
} from "./utils/kordinator-utils.js";

describe("POST : /mahasiswa", () => {
  afterEach(async () => {
    await deleteMahasiswa();
  });

  it("berhasil membuat akun mahasiswa", async () => {
    const response = await supertest(web).post("/mahasiswa").send({
      nama: "testing",
      nim: "testing",
      no_hp: "testing",
      pembimbing_akademik: "testing",
      password: "testing",
      email: "testing",
    });
    logger.info(response.body);
    expect(response.status).toBe(200);
    expect(response.body.error).toBe(false);
  });

  it("memasukkan inputan tidak valid", async () => {
    const response = await supertest(web).post("/mahasiswa").send({
      nama: "",
      nim: "",
      no_hp: "",
      pembimbing_akademik: "",
      password: "",
      email: "",
    });
    logger.info(response.body);
    expect(response.status).toBe(400);
    expect(response.body.error).toBe(true);
  });

  it("mahasiswa sudah mendaftar sebelumnya", async () => {
    await createMahasiswa();
    const response = await supertest(web).post("/mahasiswa").send({
      nama: "testing",
      nim: "testing",
      no_hp: "testing",
      pembimbing_akademik: "testing",
      password: "testing",
      email: "testing",
    });
    logger.info(response.body);
    expect(response.status).toBe(400);
    expect(response.body.error).toBe(true);
  });
});

describe("POST : /mahasiswa/login", () => {
  beforeEach(async () => {
    await createMahasiswa();
  });
  afterEach(async () => {
    await deleteMahasiswa();
  });

  it("berhasil login role mahasiswa", async () => {
    const response = await supertest(web).post("/mahasiswa/login").send({
      username: "testing",
      password: "testing",
    });
    logger.info(response.body);
    expect(response.status).toBe(200);
    expect(response.body.error).toBe(false);
  });

  it("memasukkan inputan tidak valid", async () => {
    const response = await supertest(web).post("/mahasiswa/login").send({
      username: "",
      password: "",
    });
    logger.info(response.body);
    expect(response.status).toBe(400);
    expect(response.body.error).toBe(true);
  });

  it("mahasiswa tidak terdaftar", async () => {
    await deleteMahasiswa();
    const response = await supertest(web).post("/mahasiswa/login").send({
      username: "testing",
      password: "testing",
    });
    logger.info(response.body);
    expect(response.status).toBe(400);
    expect(response.body.error).toBe(true);
  });

  it("password salah", async () => {
    const response = await supertest(web).post("/mahasiswa/login").send({
      username: "testing",
      password: "wrongpass",
    });
    logger.info(response.body);
    expect(response.status).toBe(400);
    expect(response.body.error).toBe(true);
  });
});

describe("GET : /mahasiswa/token-verify", () => {
  beforeEach(async () => {
    await createMahasiswa();
  });
  afterEach(async () => {
    await deleteMahasiswa();
  });

  it("access_token active", async () => {
    const login = await supertest(web).post("/mahasiswa/login").send({
      username: "testing",
      password: "testing",
    });
    expect(login.status).toBe(200);
    expect(login.body.error).toBe(false);
    expect(login.body.data.access_token).toBeDefined();

    const response = await supertest(web)
      .get("/mahasiswa/token-verify")
      .set("Authorization", `Bearer ${login.body.data.access_token}`);
    logger.info(response.body);
    expect(response.status).toBe(200);
    expect(response.body.error).toBe(false);
  });

  it("tidak memasukkan access_token", async () => {
    const response = await supertest(web).get("/mahasiswa/token-verify");
    logger.info(response.body);
    expect(response.status).toBe(400);
    expect(response.body.error).toBe(true);
  });

  it("access_token invalid / salah", async () => {
    const response = await supertest(web)
      .get("/mahasiswa/token-verify")
      .set("Authorization", `Bearer invalidaccesstoken}`);
    logger.info(response.body);
    expect(response.status).toBe(400);
    expect(response.body.error).toBe(true);
  });
});

describe("GET : /mahasiswa/profile", () => {
  beforeEach(async () => {
    await createMahasiswa();
  });
  afterEach(async () => {
    await deleteMahasiswa();
  });

  it("berhasil mendapatkan informasi profile", async () => {
    const login = await supertest(web).post("/mahasiswa/login").send({
      username: "testing",
      password: "testing",
    });
    expect(login.status).toBe(200);
    expect(login.body.error).toBe(false);
    expect(login.body.data.access_token).toBeDefined();

    const response = await supertest(web)
      .get("/mahasiswa/profile")
      .set("Authorization", `Bearer ${login.body.data.access_token}`);
    logger.info(response.body);
    expect(response.status).toBe(200);
    expect(response.body.error).toBe(false);
  });
});

describe("GET : /mahasiswa", () => {
  beforeEach(async () => {
    await createKordinator();
  });
  afterEach(async () => {
    await deleteKordinator();
  });

  it("berhasil mendapatkan list semua mahasiswa", async () => {
    const login = await supertest(web).post("/kordinators/login").send({
      username: "testing",
      password: "testing",
    });
    expect(login.status).toBe(200);
    expect(login.body.error).toBe(false);
    expect(login.body.data.access_token).toBeDefined();

    const response = await supertest(web)
      .get("/mahasiswa")
      .set("Authorization", `Bearer ${login.body.data.access_token}`);
    logger.info(response.body);
    expect(response.status).toBe(200);
    expect(response.body.error).toBe(false);
  });
});

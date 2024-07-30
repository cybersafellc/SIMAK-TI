import supertest from "supertest";
import { web } from "../src/app/web.js";
import {
  createKordinator,
  deleteKordinator,
} from "./utils/kordinator-utils.js";
import { logger } from "../src/app/logging.js";

describe("POST : /kordinators", () => {
  afterEach(async () => {
    await deleteKordinator();
  });

  it("Berhasil membuat akun kordinator", async () => {
    const response = await supertest(web).post("/kordinators").send({
      nama: "testing",
      no_hp: "testing",
      nidn: "testing",
      jabatan: "testing",
      password: "testing",
      email: "testing",
      secret: "UMRIHEBAT123",
    });
    logger.info(response.body);
    expect(response.body.error).toBe(false);
    expect(response.status).toBe(200);
  });

  it("invalid input", async () => {
    const response = await supertest(web).post("/kordinators").send({
      nama: "",
      no_hp: "",
      nidn: "",
      jabatan: "",
      password: "",
      email: "",
      secret: "",
    });
    logger.info(response.body);
    expect(response.body.error).toBe(true);
    expect(response.status).toBe(400);
  });

  it("Invalid screet", async () => {
    const response = await supertest(web).post("/kordinators").send({
      nama: "testing",
      no_hp: "testing",
      nidn: "testing",
      jabatan: "testing",
      password: "testing",
      email: "testing",
      secret: "SALAH",
    });
    logger.info(response.body);
    expect(response.body.error).toBe(true);
    expect(response.status).toBe(400);
  });

  it("dosen sudah mendaftar menjadi kordinator", async () => {
    const createKordinator = await supertest(web).post("/kordinators").send({
      nama: "testing",
      no_hp: "testing",
      nidn: "testing",
      jabatan: "testing",
      password: "testing",
      email: "testing",
      secret: "UMRIHEBAT123",
    });
    expect(createKordinator.body.error).toBe(false);
    expect(createKordinator.status).toBe(200);

    const response = await supertest(web).post("/kordinators").send({
      nama: "testing",
      no_hp: "testing",
      nidn: "testing",
      jabatan: "testing",
      password: "testing",
      email: "testing",
      secret: "UMRIHEBAT123",
    });
    logger.info(response.body);
    expect(response.body.error).toBe(true);
    expect(response.status).toBe(400);
  });
});

describe("POST : /kordinators/login", () => {
  beforeEach(async () => {
    await createKordinator();
  });
  afterEach(async () => {
    await deleteKordinator();
  });

  it("berhasil login", async () => {
    const response = await supertest(web).post("/kordinators/login").send({
      username: "testing",
      password: "testing",
    });
    logger.info(response.body);
    expect(response.status).toBe(200);
    expect(response.body.error).toBe(false);
  });

  it("memasukkan inputan tidak valid", async () => {
    const response = await supertest(web).post("/kordinators/login").send({
      username: "",
      password: "",
    });
    logger.info(response.body);
    expect(response.status).toBe(400);
    expect(response.body.error).toBe(true);
  });

  it("username tidak ada", async () => {
    const response = await supertest(web).post("/kordinators/login").send({
      username: "tidakada",
      password: "testing",
    });
    logger.info(response.body);
    expect(response.status).toBe(400);
    expect(response.body.error).toBe(true);
  });

  it("password salah", async () => {
    const response = await supertest(web).post("/kordinators/login").send({
      username: "testing",
      password: "passsalah",
    });
    logger.info(response.body);
    expect(response.status).toBe(400);
    expect(response.body.error).toBe(true);
  });
});

describe("GET : /kordinators/token-verify", () => {
  beforeEach(async () => {
    await createKordinator();
  });
  afterEach(async () => {
    await deleteKordinator();
  });

  it("access_token active", async () => {
    const login = await supertest(web).post("/kordinators/login").send({
      username: "testing",
      password: "testing",
    });
    expect(login.status).toBe(200);
    expect(login.body.error).toBe(false);
    expect(login.body.data.access_token).toBeDefined();

    const response = await supertest(web)
      .get("/kordinators/token-verify")
      .set("Authorization", `Bearer ${login.body.data.access_token}`);
    logger.info(response);
    expect(response.status).toBe(200);
    expect(response.body.error).toBe(false);
  });

  it("tidak memasukkan access_token", async () => {
    const response = await supertest(web).get("/kordinators/token-verify");
    logger.info(response);
    expect(response.status).toBe(400);
    expect(response.body.error).toBe(true);
  });

  it("access_token invalid / mati", async () => {
    const response = await supertest(web)
      .get("/kordinators/token-verify")
      .set("Authorization", `Bearer testinginvalidtoken`);
    logger.info(response);
    expect(response.status).toBe(400);
    expect(response.body.error).toBe(true);
  });
});

describe("GET : /kordinators/profile", () => {
  beforeEach(async () => {
    await createKordinator();
  });
  afterEach(async () => {
    await deleteKordinator();
  });

  it("sukses mendapatkan profile", async () => {
    const login = await supertest(web).post("/kordinators/login").send({
      username: "testing",
      password: "testing",
    });
    expect(login.status).toBe(200);
    expect(login.body.error).toBe(false);
    expect(login.body.data.access_token).toBeDefined();

    const response = await supertest(web)
      .get("/kordinators/profile")
      .set("Authorization", `Bearer ${login.body.data.access_token}`);
    logger.info(response.body);
    expect(response.status).toBe(200);
    expect(response.body.error).toBe(false);
  });
});

describe("GET : /kordinators", () => {
  beforeEach(async () => {
    await createKordinator();
  });
  afterEach(async () => {
    await deleteKordinator();
  });

  it("sukses mendapatkan semua profile kordinator", async () => {
    const login = await supertest(web).post("/kordinators/login").send({
      username: "testing",
      password: "testing",
    });
    expect(login.status).toBe(200);
    expect(login.body.error).toBe(false);
    expect(login.body.data.access_token).toBeDefined();

    const response = await supertest(web)
      .get("/kordinators")
      .set("Authorization", `Bearer ${login.body.data.access_token}`);
    logger.info(response.body);
    expect(response.status).toBe(200);
    expect(response.body.error).toBe(false);
  });
});

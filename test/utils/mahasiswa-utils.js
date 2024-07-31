import { database } from "../../src/app/database.js";
import crypto from "crypto";
import bcrypt from "bcrypt";

const deleteMahasiswa = async () => {
  await database.mahasiswa.deleteMany({
    where: {
      username: "testing",
    },
  });
};

const createMahasiswa = async () => {
  const id = crypto.randomUUID();
  const password = await bcrypt.hash("testing", 10);
  await database.mahasiswa.create({
    data: {
      id: id,
      nama: "testing",
      nim: "testing",
      no_hp: "testing",
      pembimbing_akademik: "testing",
      username: "testing",
      password: password,
      email: "testing",
      status: "testing",
      remember_token: "",
    },
  });
};

export { deleteMahasiswa, createMahasiswa };

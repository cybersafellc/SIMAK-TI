import { database } from "../../src/app/database.js";
import crypto from "crypto";
import bcrypt from "bcrypt";

const createPembimbing = async () => {
  const password = await bcrypt.hash("testing", 10);
  await database.pembimbing.create({
    data: {
      id: crypto.randomUUID(),
      nama: "testing",
      no_hp: "testing",
      nidn: "testing",
      jabatan: "testing",
      username: "testing",
      password: password,
      email: "testing@gmail.com",
      status: "testing",
      remember_token: "",
    },
  });
};

const deletePembimbing = async () => {
  await database.pembimbing.deleteMany({
    where: {
      username: "testing",
    },
  });
};

export { createPembimbing, deletePembimbing };

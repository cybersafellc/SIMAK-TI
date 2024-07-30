import { database } from "../../src/app/database.js";
import crypto from "crypto";
import bcrypt from "bcrypt";

const deleteKordinator = async () => {
  await database.kordinator.deleteMany({
    where: {
      nidn: "testing",
    },
  });
};

const createKordinator = async () => {
  const password = await bcrypt.hash("testing", 10);
  await database.kordinator.create({
    data: {
      id: crypto.randomUUID(),
      nama: "testing",
      no_hp: "testing",
      nidn: "testing",
      jabatan: "testing",
      username: "testing",
      password: password,
      email: "testing",
      status: "testing",
      remember_token: "testing",
    },
  });
};

export { deleteKordinator, createKordinator };

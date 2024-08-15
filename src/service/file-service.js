import { database } from "../app/database.js";
import { Response } from "../app/response.js";
import { ResponseError } from "../errors/response-error.js";
import fileValidation from "../validations/file-validation.js";
import validation from "../validations/validation.js";
import fs from "fs";

const upload = async (request) => {
  const result = await validation(fileValidation.upload, request);
  const url = `${process.env.API_URL}/files/${result.filename}`;
  const responseExe = await database.form_or_file.create({
    data: {
      id: crypto.randomUUID(),
      deskripsi: result.description,
      url: url,
    },
  });
  return new Response(
    200,
    "berhasil mengupload file",
    responseExe,
    null,
    false
  );
};

const get = async (request) => {
  const result = await validation(fileValidation.get, request);
  const take = 30;
  result.page -= 1;
  result.page *= take;
  const files = await database.form_or_file.findMany({
    orderBy: {
      created_at: "desc",
    },
    where: {
      deskripsi: {
        contains: result.search,
      },
    },
    skip: result.page,
    take: take,
  });
  return new Response(200, "list files", files, null, false);
};

const deletes = async (request) => {
  const result = await validation(fileValidation.deletes, request);
  const filesDetails = await database.form_or_file.findUnique({
    where: {
      id: result.id,
    },
  });
  if (!filesDetails)
    throw new ResponseError(400, "tidak ada files ber id:" + result.id);
  try {
    await fs.unlinkSync("public/file/" + filesDetails.url.trim().split("/")[4]);
  } catch (err) {
    throw new ResponseError(
      400,
      "gagal menghapus file di server | " + err.message
    );
  }
  const responseDelete = await database.form_or_file.delete({
    where: {
      id: result.id,
    },
  });
  return new Response(200, "berhasil menghapus file", responseDelete);
};

export default { upload, get, deletes };

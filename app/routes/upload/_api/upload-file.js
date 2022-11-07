import { unstable_parseMultipartFormData } from "@remix-run/node";

import { addFile } from "~/models/file.server.js";

export const action = async ({ request }) => {
  const os = require("node:os");
  const path = require("node:path");

  const uploadHandler = async ({ name, filename, contentType: type }) => {
    if (filename === "") {
      throw new Error("There's no filename!");
    }
    const filepath = path.join(os.tmpdir(), filename);
    const { id } = await addFile({ name: filename, filepath, type });
    return JSON.stringify({ id, name: filename, filepath, type });
  };

  const formData = await unstable_parseMultipartFormData(
    request,
    uploadHandler
  );

  const files = formData.getAll("files").map((f) => JSON.parse(f));
  return files;
};
